import { useMemo } from "react";
import { useShiftAssignmentSearchQuery } from "@/hooks/shift/useShiftAssignment.hook";
import { useShiftSearchQuery } from "@/hooks/shift/useShift.hook";
import { useUserSearch } from "@/hooks/user";
import { useUserFranchiseRoleSearch } from "@/hooks/user-franchise-role";
import type { Shift } from "@/types/shift";
import type {
  ShiftAssignmentListItem,
  ShiftAssignmentStatus,
} from "@/types/shift-assignment.type";
import {
  hasDisplayShiftName,
  normalizeDateKey,
} from "../utils/shiftFormatters";

export type ShiftCalendarEvent = {
  id: string;
  shiftId: string;
  shiftName: string;
  taskName: string;
  userId: string;
  employeeName: string;
  employeeAvatarUrl: string | null;
  workDate: string;
  startTime: string;
  endTime: string;
  status: ShiftAssignmentStatus;
  note: string;
};

export type ShiftListItem = Shift & {
  assignedCount: number;
};

type SearchMode = "userName" | "shiftName" | null;

type UseShiftPageDataOptions = {
  franchiseId: string;
  selectedDateKey: string;
  searchMode: SearchMode;
  searchTargetId: string;
};

function toEvent(
  assignment: ShiftAssignmentListItem,
  shiftById: Map<string, Shift>,
  userById: Map<string, { name: string; avatarUrl: string | null }>,
): ShiftCalendarEvent {
  const shiftId = String(assignment.shiftId);
  const userId = String(assignment.userId);
  const shift = shiftById.get(shiftId);
  const user = userById.get(userId);
  const workDate = normalizeDateKey(assignment.workDate);

  const employeeName = assignment.userName || user?.name || "Unknown Employee";
  const startTime = assignment.startTime || shift?.startTime || "";
  const endTime = assignment.endTime || shift?.endTime || "";
  const shiftName = shift?.name?.trim() ?? "";

  return {
    id: assignment.id,
    shiftId,
    shiftName,
    taskName: shiftName,
    userId,
    employeeName,
    employeeAvatarUrl: user?.avatarUrl ?? null,
    workDate,
    startTime,
    endTime,
    status: assignment.status,
    note: assignment.note || "",
  };
}

function sortEvents(events: ShiftCalendarEvent[]) {
  return [...events].sort((left, right) => {
    return (
      left.workDate.localeCompare(right.workDate) ||
      left.startTime.localeCompare(right.startTime) ||
      left.endTime.localeCompare(right.endTime) ||
      left.shiftName.localeCompare(right.shiftName) ||
      left.employeeName.localeCompare(right.employeeName)
    );
  });
}

function groupEventsByDate(events: ShiftCalendarEvent[]) {
  const eventMap = new Map<string, ShiftCalendarEvent[]>();

  for (const event of sortEvents(events)) {
    const currentEvents = eventMap.get(event.workDate) ?? [];
    currentEvents.push(event);
    eventMap.set(event.workDate, currentEvents);
  }

  return eventMap;
}

function getError(error: unknown) {
  return error instanceof Error ? error : null;
}

export function useShiftPageData({
  franchiseId,
  selectedDateKey,
  searchMode,
  searchTargetId,
}: UseShiftPageDataOptions) {
  const shiftsQuery = useShiftSearchQuery(
    {
      searchCondition: {
        franchise_id: franchiseId,
        is_deleted: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
      },
    },
    !!franchiseId,
  );

  // Franchise-level base query — always active, used for shift panel counts
  const franchiseAssignmentsQuery = useShiftAssignmentSearchQuery(
    {
      searchCondition: { is_deleted: false },
      pageInfo: { pageNum: 1, pageSize: 1000 },
    },
    !!franchiseId,
  );

  // Filtered search query — only enabled when user or shift search is active
  const isSearching =
    (searchMode === "userName" || searchMode === "shiftName") &&
    !!searchTargetId;

  const searchQuery = useShiftAssignmentSearchQuery(
    {
      searchCondition: {
        is_deleted: false,
        user_id: searchMode === "userName" ? searchTargetId : undefined,
        work_date: undefined,
        shift_id: searchMode === "shiftName" ? searchTargetId : undefined,
      },
      pageInfo: { pageNum: 1, pageSize: 1000 },
    },
    !!franchiseId && isSearching,
  );

  const usersQuery = useUserSearch({
    searchCondition: {
      keyword: undefined,
      isActive: true,
      isDeleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 1000,
    },
  });

  const employeeRolesQuery = useUserFranchiseRoleSearch(
    {
      searchCondition: {
        franchiseId: franchiseId || undefined,
        isDeleted: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 1000,
      },
    },
    {
      enabled: !!franchiseId,
    },
  );

  const shifts = useMemo(
    () =>
      [...(shiftsQuery.data?.data ?? [])]
        .filter((shift) => shift.isActive && !shift.isDeleted)
        .sort(
          (left, right) =>
            left.startTime.localeCompare(right.startTime) ||
            left.endTime.localeCompare(right.endTime) ||
            left.name.localeCompare(right.name),
        ),
    [shiftsQuery.data],
  );

  const shiftById = useMemo(
    () =>
      new Map<string, Shift>(shifts.map((shift) => [String(shift.id), shift])),
    [shifts],
  );

  const users = useMemo(
    () =>
      [...(usersQuery.data?.pageData ?? [])]
        .filter((user) => user.isActive && !user.isDeleted)
        .sort((left, right) => left.name.localeCompare(right.name)),
    [usersQuery.data],
  );

  const userById = useMemo(
    () =>
      new Map(
        users.map((user) => [
          String(user.id),
          {
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
        ]),
      ),
    [users],
  );

  const assignableUserIds = useMemo(
    () =>
      new Set(
        (employeeRolesQuery.data?.pageData ?? [])
          .filter((assignment) => !assignment.isDeleted)
          .map((assignment) => String(assignment.userId)),
      ),
    [employeeRolesQuery.data],
  );

  const employees = useMemo(
    () => users.filter((user) => assignableUserIds.has(String(user.id))),
    [users, assignableUserIds],
  );

  const franchiseEvents = useMemo(
    () =>
      (franchiseAssignmentsQuery.data?.data ?? [])
        .map((assignment) => toEvent(assignment, shiftById, userById))
        .filter((event) => hasDisplayShiftName(event.taskName)),
    [franchiseAssignmentsQuery.data, shiftById, userById],
  );

  const displayedEvents = useMemo(
    () =>
      (isSearching
        ? (searchQuery.data?.data ?? [])
        : (franchiseAssignmentsQuery.data?.data ?? [])
      )
        .map((assignment) => toEvent(assignment, shiftById, userById))
        .filter((event) => hasDisplayShiftName(event.taskName)),
    [
      isSearching,
      searchQuery.data,
      franchiseAssignmentsQuery.data,
      shiftById,
      userById,
    ],
  );

  const franchiseEventsByDate = useMemo(
    () => groupEventsByDate(franchiseEvents),
    [franchiseEvents],
  );

  const displayedEventsByDate = useMemo(
    () => groupEventsByDate(displayedEvents),
    [displayedEvents],
  );

  const assignedCountByShiftId = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const event of franchiseEventsByDate.get(selectedDateKey) ?? []) {
      countMap.set(event.shiftId, (countMap.get(event.shiftId) ?? 0) + 1);
    }
    return countMap;
  }, [franchiseEventsByDate, selectedDateKey]);

  const shiftsForPanel: ShiftListItem[] = useMemo(
    () =>
      shifts.map((shift) => ({
        ...shift,
        assignedCount: assignedCountByShiftId.get(String(shift.id)) ?? 0,
      })),
    [shifts, assignedCountByShiftId],
  );

  const activeAssignmentsQuery = isSearching
    ? searchQuery
    : franchiseAssignmentsQuery;

  const calendarError =
    getError(shiftsQuery.error) ||
    getError(usersQuery.error) ||
    getError(activeAssignmentsQuery.error);

  const shiftListError =
    getError(shiftsQuery.error) || getError(franchiseAssignmentsQuery.error);

  const isCalendarLoading =
    !!franchiseId &&
    (shiftsQuery.isLoading ||
      usersQuery.isLoading ||
      activeAssignmentsQuery.isLoading);

  const isCalendarFetching =
    !!franchiseId &&
    !isCalendarLoading &&
    (shiftsQuery.isFetching ||
      usersQuery.isFetching ||
      activeAssignmentsQuery.isFetching);

  const isShiftListLoading =
    !!franchiseId &&
    (shiftsQuery.isLoading || franchiseAssignmentsQuery.isLoading);

  async function refetchAll() {
    await Promise.all([
      shiftsQuery.refetch(),
      franchiseAssignmentsQuery.refetch(),
      usersQuery.refetch(),
      employeeRolesQuery.refetch(),
      searchQuery.refetch(),
    ]);
  }

  return {
    shifts,
    shiftsForPanel,
    employees,
    displayedEvents,
    displayedEventsByDate,
    franchiseEventsByDate,
    isCalendarLoading,
    isCalendarFetching,
    isShiftListLoading,
    calendarError,
    shiftListError,
    refetchAll,
    displayedResultCount: displayedEvents.length,
  };
}
