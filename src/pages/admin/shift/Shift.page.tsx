import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { useFormDialog, type SubmitResult } from "@/components/form-dialog";
import { useSearchUsers } from "@/hooks/admin/useUser.hooks";
import { useFranchiseSelect } from "@/hooks/franchise";
import { useUserFranchiseRoleSearch } from "@/hooks/user-franchise-role";
import {
  useCreateShiftMutation,
  useShiftDetailQueries,
  useShiftSearchQuery,
} from "@/hooks/shift/useShift.hook";
import {
  useAssignShiftForUserMutation,
  useChangeShiftAssignmentStatusMutation,
  useShiftAssignmentSearchQuery,
} from "@/hooks/shift/useShiftAssignment.hook";
import { useAuthStore } from "@/stores/auth-store";
import type { Shift } from "@/types/shift";
import type { UserFranchiseRoleSearchRequest } from "@/api/user-franchise-role/user-franchise-role.type";
import type {
  ShiftAssignmentListItem,
  SearchShiftAssignmentsRequest,
} from "@/types/shift-assignment.type";
import {
  AssignShiftDialog,
  CreateShiftDialog,
  ShiftAssignmentDetailDialog,
  ShiftCalendarBoard,
  ShiftOverviewFilters,
  UnassignedShiftPanel,
} from "./components";
import type { CreateShiftFormData } from "./create-shift-form.config";
import type { ShiftAssignmentDetailFormData } from "./shift-assignment-detail-form.config";
import {
  buildCalendarDays,
  formatClock,
  formatDateKey,
  formatReadableDate,
  parseDateKey,
  startOfMonth,
  type AssignShiftFormState,
  normalizeWorkDate,
} from "./shift-page.utils";

const ShiftPage = () => {
  const { authUser, getCurrentRole, isAdmin } = useAuthStore();
  const currentRole = getCurrentRole();
  const currentRoleCode =
    currentRole?.code ||
    (currentRole as unknown as { role?: string } | null)?.role ||
    "";
  const canSelectFranchise = isAdmin();
  const canManageShifts =
    canSelectFranchise || currentRoleCode === "MANAGER";
  const currentFranchiseId = authUser?.currentFranchiseId
    ? String(authUser.currentFranchiseId)
    : "";
  const lockedFranchiseId =
    !canSelectFranchise && currentFranchiseId ? currentFranchiseId : "";
  const currentFranchiseName =
    authUser?.franchiseRoles?.find(
      (franchiseRole) => franchiseRole.franchiseId === currentFranchiseId,
    )?.franchiseName ?? "";
  const todayKey = formatDateKey(new Date());

  const [selectedFranchiseId, setSelectedFranchiseId] =
    useState(canSelectFranchise ? currentFranchiseId : "");
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [monthCursor, setMonthCursor] = useState(() =>
    startOfMonth(parseDateKey(todayKey)),
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);
  const [assigningShift, setAssigningShift] = useState<Shift | null>(null);
  const [assignForm, setAssignForm] = useState<AssignShiftFormState>({
    userId: "",
    workDate: todayKey,
    note: "",
  });

  const { data: franchiseOptions = [] } = useFranchiseSelect();
  const createShiftMutation = useCreateShiftMutation();
  const assignShiftMutation = useAssignShiftForUserMutation();
  const changeShiftAssignmentStatusMutation =
    useChangeShiftAssignmentStatusMutation();
  const assignmentDialog = useFormDialog<ShiftAssignmentListItem>();

  const activeFranchiseId =
    lockedFranchiseId ||
    selectedFranchiseId ||
    franchiseOptions[0]?.value ||
    "";
  const createShiftDefaultValues = useMemo(
    (): CreateShiftFormData => ({
      franchiseId:
        lockedFranchiseId ||
        activeFranchiseId ||
        franchiseOptions[0]?.value ||
        "",
      name: "",
      startTime: "",
      endTime: "",
    }),
    [activeFranchiseId, franchiseOptions, lockedFranchiseId],
  );

  const shiftSearchParams = useMemo(
    () => ({
      searchCondition: {
        franchise_id: activeFranchiseId || undefined,
        is_deleted: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
      },
    }),
    [activeFranchiseId],
  );

  const userSearchParams = useMemo(
    () => ({
      searchCondition: {
        keyword: "",
        isDeleted: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 1000,
      },
    }),
    [],
  );
  const employeeScopeFranchiseId = canSelectFranchise
    ? activeFranchiseId
    : currentFranchiseId;
  const employeeFranchiseRoleSearchParams =
    useMemo<UserFranchiseRoleSearchRequest>(
      () => ({
        searchCondition: {
          franchiseId: employeeScopeFranchiseId || undefined,
          isDeleted: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
        },
      }),
      [employeeScopeFranchiseId],
    );
  const assignmentSearchParams = useMemo<SearchShiftAssignmentsRequest>(
    () => ({
      searchCondition: {
        shift_id: "",
        user_id: "",
        work_date: "",
        assigned_by: "",
        status: "" as const,
        is_deleted: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 1000,
      },
    }),
    [],
  );

  const shiftsQuery = useShiftSearchQuery(
    shiftSearchParams,
    !!activeFranchiseId,
  );
  const assignmentSearchQuery = useShiftAssignmentSearchQuery(
    assignmentSearchParams,
    !!activeFranchiseId,
  );
  const employeeFranchiseRolesQuery = useUserFranchiseRoleSearch(
    employeeFranchiseRoleSearchParams,
    {
      enabled: !!employeeScopeFranchiseId,
    },
  );
  const usersQuery = useSearchUsers(userSearchParams);

  const users = useMemo(
    () =>
      [...(usersQuery.data?.users ?? [])]
        .filter((user) => user.isActive && !user.isDeleted)
        .sort((left, right) => left.name.localeCompare(right.name)),
    [usersQuery.data?.users],
  );

  const allUsersById = useMemo(
    () =>
      new Map(
        (usersQuery.data?.users ?? []).map((user) => [String(user.id), user]),
      ),
    [usersQuery.data?.users],
  );

  const usersById = useMemo(
    () => new Map(users.map((user) => [String(user.id), user])),
    [users],
  );
  const assignableUserIds = useMemo(
    () =>
      new Set(
        (employeeFranchiseRolesQuery.data?.pageData ?? [])
          .filter((assignment) => !assignment.isDeleted && assignment.userId)
          .map((assignment) => String(assignment.userId)),
      ),
    [employeeFranchiseRolesQuery.data?.pageData],
  );
  const assignableUsers = useMemo(
    () =>
      users.filter((user) => assignableUserIds.has(String(user.id))),
    [assignableUserIds, users],
  );

  const shifts = useMemo(
    () =>
      [...(shiftsQuery.data?.data ?? [])]
        .filter((shift) => shift.isActive && !shift.isDeleted)
        .sort((left, right) => left.startTime.localeCompare(right.startTime)),
    [shiftsQuery.data?.data],
  );

  const shiftsById = useMemo(
    () => new Map(shifts.map((shift) => [shift.id, shift])),
    [shifts],
  );
  const searchedAssignments = useMemo(
    () =>
      [...(assignmentSearchQuery.data?.data ?? [])].filter(
        (assignment) =>
          !assignment.isDeleted && shiftsById.has(String(assignment.shiftId)),
      ),
    [assignmentSearchQuery.data?.data, shiftsById],
  );
  const assignmentShiftIds = useMemo(
    () =>
      Array.from(
        new Set(
          searchedAssignments.map((assignment) => String(assignment.shiftId)),
        ),
      ),
    [searchedAssignments],
  );
  const shiftDetailQueries = useShiftDetailQueries(
    assignmentShiftIds,
    !!activeFranchiseId,
  );
  const assignmentShiftDetailsById = useMemo(() => {
    const map = new Map<string, Shift>();

    assignmentShiftIds.forEach((shiftId, index) => {
      const shift = shiftDetailQueries[index]?.data?.data;
      if (shift) {
        map.set(shiftId, shift);
      }
    });

    return map;
  }, [assignmentShiftIds, shiftDetailQueries]);

  const assignmentsByDate = useMemo(() => {
    const grouped = new Map<string, ShiftAssignmentListItem[]>();

    for (const assignment of searchedAssignments) {
      const dateKey = normalizeWorkDate(assignment.workDate);
      const currentItems = grouped.get(dateKey) ?? [];
      currentItems.push(assignment);
      grouped.set(dateKey, currentItems);
    }

    for (const [dateKey, items] of grouped) {
      grouped.set(
        dateKey,
        [...items].sort((left, right) => {
          const leftShift =
            assignmentShiftDetailsById.get(String(left.shiftId)) ??
            shiftsById.get(String(left.shiftId));
          const rightShift =
            assignmentShiftDetailsById.get(String(right.shiftId)) ??
            shiftsById.get(String(right.shiftId));
          const leftUserName =
            left.userName || usersById.get(String(left.userId))?.name || "";
          const rightUserName =
            right.userName || usersById.get(String(right.userId))?.name || "";

          return (
            (left.startTime || leftShift?.startTime || "").localeCompare(
              right.startTime || rightShift?.startTime || "",
            ) ||
            (left.endTime || leftShift?.endTime || "").localeCompare(
              right.endTime || rightShift?.endTime || "",
            ) ||
            (leftShift?.name ?? "").localeCompare(rightShift?.name ?? "") ||
            leftUserName.localeCompare(rightUserName)
          );
        }),
      );
    }

    return grouped;
  }, [assignmentShiftDetailsById, searchedAssignments, shiftsById, usersById]);

  const selectedDayAssignments = useMemo(
    () => assignmentsByDate.get(selectedDateKey) ?? [],
    [assignmentsByDate, selectedDateKey],
  );

  const activeSelectedAssignmentId = useMemo(
    () =>
      selectedDayAssignments.some(
        (assignment) => assignment.id === selectedAssignmentId,
      )
        ? selectedAssignmentId
        : null,
    [selectedAssignmentId, selectedDayAssignments],
  );

  const activeAssignmentShiftIds = useMemo(
    () =>
      new Set(
        selectedDayAssignments.map((assignment) => String(assignment.shiftId)),
      ),
    [selectedDayAssignments],
  );

  const unassignedShifts = useMemo(
    () =>
      shifts.filter((shift) => !activeAssignmentShiftIds.has(String(shift.id))),
    [activeAssignmentShiftIds, shifts],
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(monthCursor),
    [monthCursor],
  );

  const selectedFranchise = useMemo(() => {
    const activeFranchise = franchiseOptions.find(
      (option) => option.value === activeFranchiseId,
    );

    if (activeFranchise) {
      return activeFranchise;
    }

    if (activeFranchiseId && currentFranchiseName) {
      return {
        value: activeFranchiseId,
        name: currentFranchiseName,
        code: "",
      };
    }

    return undefined;
  }, [activeFranchiseId, currentFranchiseName, franchiseOptions]);
  const assignmentDialogValues = useMemo<
    ShiftAssignmentDetailFormData | undefined
  >(() => {
    if (!assignmentDialog.data) {
      return undefined;
    }

    const selectedAssignment = assignmentDialog.data;
    const selectedShift =
      assignmentShiftDetailsById.get(String(selectedAssignment.shiftId)) ??
      shiftsById.get(String(selectedAssignment.shiftId)) ??
      null;
    const selectedUser =
      allUsersById.get(String(selectedAssignment.userId)) ??
      usersById.get(String(selectedAssignment.userId)) ??
      null;
    const assignedByUserName =
      allUsersById.get(String(selectedAssignment.assignedBy))?.name ||
      usersById.get(String(selectedAssignment.assignedBy))?.name ||
      selectedAssignment.assignedBy ||
      "Unknown";

    return {
      taskName: selectedShift?.name ?? "Unknown shift",
      employeeName:
        selectedAssignment.userName ||
        selectedUser?.name ||
        "Loading employee...",
      employeeEmail: selectedUser?.email ?? "No email available",
      employeePhone: selectedUser?.phone || "No phone number available",
      workDate: formatReadableDate(
        normalizeWorkDate(selectedAssignment.workDate),
      ),
      shiftTime: `${formatClock(
        selectedAssignment.startTime || selectedShift?.startTime,
      )} - ${formatClock(selectedAssignment.endTime || selectedShift?.endTime)}`,
      note: selectedAssignment.note?.trim() || "No notes for this assignment.",
      assignedBy: assignedByUserName,
      createdAt: formatReadableDate(
        normalizeWorkDate(selectedAssignment.createdAt),
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      ),
      updatedAt: formatReadableDate(
        normalizeWorkDate(selectedAssignment.updatedAt),
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      ),
      status: selectedAssignment.status,
    };
  }, [
    allUsersById,
    assignmentDialog.data,
    assignmentShiftDetailsById,
    shiftsById,
    usersById,
  ]);

  const boardLoading =
    !!activeFranchiseId &&
    (shiftsQuery.isLoading ||
      assignmentSearchQuery.isLoading ||
      usersQuery.isLoading);
  const boardRefreshing =
    !!activeFranchiseId &&
    (shiftsQuery.isFetching ||
      assignmentSearchQuery.isFetching ||
      usersQuery.isFetching ||
      shiftDetailQueries.some((query) => query.isFetching));
  const boardError =
    (shiftsQuery.error instanceof Error && shiftsQuery.error) ||
    (assignmentSearchQuery.error instanceof Error &&
      assignmentSearchQuery.error) ||
    (usersQuery.error instanceof Error && usersQuery.error) ||
    null;

  const updateSelectedDate = (nextDateKey: string) => {
    setSelectedDateKey(nextDateKey);
    setMonthCursor(startOfMonth(parseDateKey(nextDateKey)));
    setAssignForm((prev) => ({ ...prev, workDate: nextDateKey }));
  };

  const handleOpenCreateShift = () => {
    if (!canManageShifts) {
      toast.error("Your current role can only view shifts.");
      return;
    }

    const franchiseId =
      lockedFranchiseId || activeFranchiseId || franchiseOptions[0]?.value;

    if (!franchiseId) {
      toast.error("Select a franchise before creating a shift.");
      return;
    }

    setIsCreateShiftOpen(true);
  };

  const handleCloseAssignmentDialog = () => {
    assignmentDialog.close();
    setSelectedAssignmentId(null);
  };

  const handleCreateShift = async (
    values: CreateShiftFormData,
  ): Promise<SubmitResult | void> => {
    if (!canManageShifts) {
      return {
        success: false,
        error: "Your current role can only view shifts.",
      };
    }

    await createShiftMutation.mutateAsync({
      franchise_id: lockedFranchiseId || values.franchiseId,
      name: values.name,
      start_time: values.startTime,
      end_time: values.endTime,
    });

    setIsCreateShiftOpen(false);
  };

  const handleUpdateAssignmentStatus = async (
    values: ShiftAssignmentDetailFormData,
  ): Promise<SubmitResult | void> => {
    if (!canManageShifts) {
      return {
        success: false,
        error: "Your current role can only view shifts.",
      };
    }

    const selectedAssignment = assignmentDialog.data;

    if (!selectedAssignment) {
      return {
        success: false,
        error: "No assignment selected.",
      };
    }

    await changeShiftAssignmentStatusMutation.mutateAsync({
      shiftAssignmentId: selectedAssignment.id,
      data: {
        status: values.status,
      },
    });
  };

  const handleOpenAssignShift = (shift: Shift) => {
    if (!canManageShifts) {
      toast.error("Your current role can only view shifts.");
      return;
    }

    if (!employeeScopeFranchiseId) {
      toast.error("Select a franchise before assigning the shift.");
      return;
    }

    if (
      employeeFranchiseRolesQuery.isLoading ||
      employeeFranchiseRolesQuery.isFetching
    ) {
      toast.error("Employee list is still loading for this franchise.");
      return;
    }

    if (employeeFranchiseRolesQuery.error instanceof Error) {
      toast.error("Failed to load employees for this franchise.", {
        description: employeeFranchiseRolesQuery.error.message,
      });
      return;
    }

    if (assignableUsers.length === 0) {
      toast.error("No employees are assigned to this franchise.");
      return;
    }

    setAssigningShift(shift);
    setAssignForm({
      userId: "",
      workDate: selectedDateKey,
      note: "",
    });
  };

  const handleAssignShift = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canManageShifts) {
      toast.error("Your current role can only view shifts.");
      return;
    }

    if (!assigningShift || !assignForm.userId || !assignForm.workDate) {
      toast.error("Choose a user and work date before assigning the shift.");
      return;
    }

    await assignShiftMutation.mutateAsync({
      user_id: assignForm.userId,
      shift_id: assigningShift.id,
      work_date: assignForm.workDate,
      note: assignForm.note.trim() || undefined,
    });

    updateSelectedDate(assignForm.workDate);
    setAssigningShift(null);
  };

  const handleRetry = () => {
    if (activeFranchiseId) {
      void shiftsQuery.refetch();
      void assignmentSearchQuery.refetch();
      shiftDetailQueries.forEach((query) => {
        void query.refetch();
      });
    }
    void usersQuery.refetch();
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto scrollbar-hide scrollbar-invisible">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col pb-6">
        <PageHeader
          title="Shifts"
          description="Coordinate daily assignments with a calendar-first board."
          icon={CalendarDays}
        />

        <ShiftOverviewFilters
          canSelectFranchise={canSelectFranchise}
          franchiseOptions={franchiseOptions}
          activeFranchiseId={activeFranchiseId}
          selectedFranchise={selectedFranchise}
          scopedFranchiseName={currentFranchiseName}
          selectedDateKey={selectedDateKey}
          assignedCount={selectedDayAssignments.length}
          openSlotsCount={unassignedShifts.length}
          onFranchiseChange={(franchiseId) => {
            setSelectedFranchiseId(franchiseId);
            setSelectedAssignmentId(null);
          }}
          onDateChange={updateSelectedDate}
        />

        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="flex min-h-0 flex-col">
            <ShiftCalendarBoard
              activeFranchiseId={activeFranchiseId}
              boardError={boardError}
              boardLoading={boardLoading}
              boardRefreshing={boardRefreshing}
              monthCursor={monthCursor}
              calendarDays={calendarDays}
              assignmentsByDate={assignmentsByDate}
              selectedDateKey={selectedDateKey}
              activeSelectedAssignmentId={activeSelectedAssignmentId}
              shiftDetailsById={assignmentShiftDetailsById}
              shiftsById={shiftsById}
              usersById={usersById}
              onPreviousMonth={() =>
                setMonthCursor(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
              onNextMonth={() =>
                setMonthCursor(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
              onSelectDate={updateSelectedDate}
              onSelectAssignment={(assignment, dateKey) => {
                updateSelectedDate(dateKey);
                setSelectedAssignmentId(assignment.id);
                assignmentDialog.openEdit(assignment);
              }}
              onRetry={handleRetry}
            />
          </div>

          <UnassignedShiftPanel
            activeFranchiseId={activeFranchiseId}
            boardLoading={boardLoading}
            canManageShifts={canManageShifts}
            selectedDateKey={selectedDateKey}
            selectedFranchise={selectedFranchise}
            unassignedShifts={unassignedShifts}
            onCreate={handleOpenCreateShift}
            onAssign={handleOpenAssignShift}
          />
        </div>
      </div>

      <CreateShiftDialog
        open={isCreateShiftOpen}
        onOpenChange={setIsCreateShiftOpen}
        currentFranchiseId={lockedFranchiseId}
        franchiseOptions={franchiseOptions}
        defaultValues={createShiftDefaultValues}
        onSubmit={handleCreateShift}
      />

      <ShiftAssignmentDetailDialog
        open={assignmentDialog.isOpen}
        onOpenChange={(open) => !open && handleCloseAssignmentDialog()}
        values={assignmentDialogValues}
        canManageStatus={canManageShifts}
        onSubmit={handleUpdateAssignmentStatus}
      />

      <AssignShiftDialog
        open={!!assigningShift}
        shift={assigningShift}
        users={assignableUsers}
        form={assignForm}
        onOpenChange={(open) => !open && setAssigningShift(null)}
        onFormChange={(patch) =>
          setAssignForm((prev) => ({ ...prev, ...patch }))
        }
        onSubmit={handleAssignShift}
        isPending={assignShiftMutation.isPending}
      />
    </div>
  );
};

export default ShiftPage;
