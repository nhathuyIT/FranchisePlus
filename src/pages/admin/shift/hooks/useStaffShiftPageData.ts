import { useMemo } from "react";
import { useGetAllShiftsAssignByUserQuery } from "@/hooks/shift/useShiftAssignment.hook";
import { useShiftDetailQueries } from "@/hooks/shift/useShift.hook";
import type { ShiftAssignment } from "@/types/shift-assignment.type";
import type { Shift } from "@/types/shift";
import type { ShiftCalendarEvent } from "./useShiftPageData";
import { formatDateKey, normalizeDateKey } from "../utils/shiftFormatters";

type UseStaffShiftPageDataOptions = {
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  cursorDate: Date;
};

function toStaffEvent(
  assignment: ShiftAssignment,
  shiftById: Map<string, Shift>,
  userName: string,
  userAvatarUrl: string | null,
): ShiftCalendarEvent {
  const shiftId = String(assignment.shiftId);
  const shift = shiftById.get(shiftId);
  const workDate = normalizeDateKey(assignment.workDate);
  const shiftName = shift?.name?.trim() ?? "";

  return {
    id: assignment.id,
    shiftId,
    shiftName,
    taskName: shiftName,
    userId: assignment.userId,
    employeeName: userName,
    employeeAvatarUrl: userAvatarUrl,
    workDate,
    startTime: shift?.startTime ?? "",
    endTime: shift?.endTime ?? "",
    status: assignment.status,
    note: assignment.note || "",
  };
}

function groupEventsByDate(events: ShiftCalendarEvent[]) {
  const eventMap = new Map<string, ShiftCalendarEvent[]>();
  const sorted = [...events].sort(
    (a, b) =>
      a.workDate.localeCompare(b.workDate) ||
      a.startTime.localeCompare(b.startTime) ||
      a.endTime.localeCompare(b.endTime),
  );

  for (const event of sorted) {
    const current = eventMap.get(event.workDate) ?? [];
    current.push(event);
    eventMap.set(event.workDate, current);
  }

  return eventMap;
}

export function useStaffShiftPageData({
  userId,
  userName,
  userAvatarUrl,
  cursorDate,
}: UseStaffShiftPageDataOptions) {
  const dateParam = formatDateKey(cursorDate);

  const assignmentsQuery = useGetAllShiftsAssignByUserQuery(userId, dateParam);

  // httpClient.get already extracts res.data.data, so the actual runtime value
  // is ShiftAssignment[] — not the ShiftAssignmentListResponse wrapper.
  const assignments: ShiftAssignment[] = useMemo(() => {
    const raw = assignmentsQuery.data as unknown;
    return Array.isArray(raw) ? (raw as ShiftAssignment[]) : [];
  }, [assignmentsQuery.data]);

  const uniqueShiftIds = useMemo(() => {
    const ids = new Set<string>();
    for (const a of assignments) {
      ids.add(String(a.shiftId));
    }
    return Array.from(ids);
  }, [assignments]);

  const shiftDetailQueries = useShiftDetailQueries(
    uniqueShiftIds,
    uniqueShiftIds.length > 0,
  );

  const shiftById = useMemo(() => {
    const map = new Map<string, Shift>();
    for (const query of shiftDetailQueries) {
      // httpClient.get extracts res.data.data, so query.data is already Shift
      // (not GetShiftResponse wrapper).
      const raw = query.data as unknown as Shift | null | undefined;
      if (raw?.id) {
        map.set(String(raw.id), raw);
      }
    }
    return map;
  }, [shiftDetailQueries]);

  const events = useMemo(
    () =>
      assignments.map((a) =>
        toStaffEvent(a, shiftById, userName, userAvatarUrl),
      ),
    [assignments, shiftById, userName, userAvatarUrl],
  );

  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  const isShiftDetailsLoading = shiftDetailQueries.some((q) => q.isLoading);
  const isLoading =
    !!userId && (assignmentsQuery.isLoading || isShiftDetailsLoading);
  const isFetching =
    !!userId &&
    !isLoading &&
    (assignmentsQuery.isFetching ||
      shiftDetailQueries.some((q) => q.isFetching));

  const error =
    assignmentsQuery.error instanceof Error ? assignmentsQuery.error : null;

  return {
    events,
    eventsByDate,
    isLoading,
    isFetching,
    error,
    totalCount: events.length,
    refetch: () => assignmentsQuery.refetch(),
  };
}
