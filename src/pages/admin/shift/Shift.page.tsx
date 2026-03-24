import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type {
  PopoverSearchSelectOption,
  SubmitResult,
} from "@/components/form-dialog";
import { DeleteDialog } from "@/components/form-dialog";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectOption } from "@/lib/form/field-config";
import type { CreateShiftFormData, UpdateShiftFormData } from "@/lib/schemas/shift.schema";
import type {
  AssignShiftFormData,
  ShiftStatusUpdateFormData,
} from "@/lib/schemas/shift-assignment.schema";
import { useFranchiseSelect } from "@/hooks/franchise";
import { useCreateShiftMutation, useDeleteShiftMutation, useUpdateShiftMutation } from "@/hooks/shift/useShift.hook";
import {
  useAssignShiftForUserMutation,
  useAssignShiftsForUserBulkMutation,
  useChangeShiftAssignmentStatusMutation,
} from "@/hooks/shift/useShiftAssignment.hook";
import { useAuthStore } from "@/stores/auth-store";
import type { Shift } from "@/types/shift";
import { AssignShiftDialog } from "./components/AssignShiftDialog";
import { CreateShiftDialog } from "./components/CreateShiftDialog";
import { ShiftAssignmentDialog } from "./components/ShiftAssignmentDialog";
import { ShiftCalendar } from "./components/ShiftCalendar";
import { ShiftCalendarToolbar } from "./components/ShiftCalendarToolbar";
import { ShiftDetailDialog } from "./components/ShiftDetailDialog";
import { ShiftListPanel } from "./components/ShiftListPanel";
import { ShiftSearchBar } from "./components/ShiftSearchBar";
import { StaffShiftView } from "./components/StaffShiftView";
import { UpdateShiftDialog } from "./components/UpdateShiftDialog";
import {
  type ShiftCalendarEvent,
  useShiftPageData,
} from "./hooks/useShiftPageData";
import { useShiftCalendarState } from "./hooks/useShiftCalendarState";
import {
  formatReadableDate,
  formatTimeLabel,
  getDisplayShiftName,
  type ShiftSearchMode,
} from "./utils/shiftFormatters";

type AssignmentDialogState = {
  assignmentId: string;
  values: ShiftStatusUpdateFormData;
};

function buildAssignmentDialogValues(
  event: ShiftCalendarEvent,
  assignedByName: string,
): ShiftStatusUpdateFormData {
  return {
    shiftName: getDisplayShiftName(event.shiftName),
    employeeName: event.employeeName,
    assignedBy: assignedByName,
    workDate: event.workDate,
    startTime: event.startTime,
    endTime: event.endTime,
    status: event.status,
  };
}

function getSearchHelperText(
  mode: ShiftSearchMode,
  canSelectFranchise: boolean,
) {
  if (mode === "userName") {
    return "Shows all assignments for the selected user across all dates.";
  }

  if (mode === "shiftName") {
    return "Loads assignments for the selected shift name.";
  }

  if (canSelectFranchise) {
    return "Search a franchise name to switch the page context.";
  }

  return "Your account is already scoped to a single franchise.";
}

function ShiftAdminPage() {
  const { authUser, isAdmin } = useAuthStore();
  const canSelectFranchise = isAdmin();
  const currentFranchiseId = authUser?.currentFranchiseId
    ? String(authUser.currentFranchiseId)
    : "";
  const currentFranchiseName =
    authUser?.franchiseRoles?.find(
      (franchiseRole) => franchiseRole.franchiseId === currentFranchiseId,
    )?.franchiseName ?? "";

  const [selectedFranchiseId, setSelectedFranchiseId] =
    useState(currentFranchiseId);
  const [searchMode, setSearchMode] = useState<ShiftSearchMode>("userName");
  const [searchTargetId, setSearchTargetId] = useState("");
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);
  const [assigningShift, setAssigningShift] = useState<Shift | null>(null);
  const [detailShift, setDetailShift] = useState<Shift | null>(null);
  const [updatingShift, setUpdatingShift] = useState<Shift | null>(null);
  const [deletingShift, setDeletingShift] = useState<Shift | null>(null);
  const [assignmentDialogState, setAssignmentDialogState] =
    useState<AssignmentDialogState | null>(null);

  const { data: franchiseOptions = [] } = useFranchiseSelect();
  const calendar = useShiftCalendarState();

  const activeFranchiseId = canSelectFranchise
    ? selectedFranchiseId || franchiseOptions[0]?.value || currentFranchiseId
    : currentFranchiseId;

  const pageData = useShiftPageData({
    franchiseId: activeFranchiseId,
    selectedDateKey: calendar.selectedDateKey,
    searchMode:
      searchMode === "franchiseName"
        ? null
        : searchMode === "userName" || searchMode === "shiftName"
          ? searchMode
          : null,
    searchTargetId,
  });

  const createShiftMutation = useCreateShiftMutation();
  const updateShiftMutation = useUpdateShiftMutation();
  const deleteShiftMutation = useDeleteShiftMutation();
  const assignShiftMutation = useAssignShiftForUserMutation();
  const assignShiftBulkMutation = useAssignShiftsForUserBulkMutation();
  const changeShiftAssignmentStatusMutation =
    useChangeShiftAssignmentStatusMutation();

  const selectedFranchise =
    franchiseOptions.find((option) => option.value === activeFranchiseId) ??
    (activeFranchiseId
      ? {
          value: activeFranchiseId,
          name: currentFranchiseName || activeFranchiseId,
          code: "",
        }
      : undefined);

  const assignerFranchiseName =
    authUser?.franchiseRoles?.find(
      (fr) =>
        String(fr.userId) === String(authUser.user.id) &&
        fr.franchiseId === activeFranchiseId,
    )?.franchiseName ||
    selectedFranchise?.name ||
    "";

  const employeeFieldOptions: SelectOption[] = pageData.employees.map(
    (employee) => ({
      label: employee.email
        ? `${employee.name} (${employee.email})`
        : employee.name,
      value: String(employee.id),
    }),
  );

  const createShiftFranchiseOptions: SelectOption[] = franchiseOptions.map(
    (franchise) => ({
      label: franchise.code
        ? `${franchise.name} (${franchise.code})`
        : franchise.name,
      value: franchise.value,
    }),
  );

  const employeeSearchOptions: PopoverSearchSelectOption[] =
    pageData.employees.map((employee) => ({
      value: String(employee.id),
      label: (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{employee.name}</span>
          <span className="truncate text-xs text-[#8D6E63]">
            {employee.email}
          </span>
        </div>
      ),
      searchText: `${employee.name} ${employee.email}`,
    }));

  const shiftSearchOptions: PopoverSearchSelectOption[] = pageData.shifts.map(
    (shift) => ({
      value: String(shift.id),
      label: (
        <div className="flex min-w-0 items-center justify-between gap-3">
          <span className="truncate font-medium">{shift.name}</span>
          <span className="shrink-0 text-xs text-[#8D6E63]">
            {formatTimeLabel(shift.startTime)} -{" "}
            {formatTimeLabel(shift.endTime)}
          </span>
        </div>
      ),
      searchText: shift.name,
    }),
  );

  const franchiseSearchOptions: PopoverSearchSelectOption[] = canSelectFranchise
    ? franchiseOptions.map((franchise) => ({
        value: franchise.value,
        label: (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{franchise.name}</span>
            <span className="truncate text-xs text-[#8D6E63]">
              {franchise.code}
            </span>
          </div>
        ),
        searchText: `${franchise.name} ${franchise.code}`,
      }))
    : activeFranchiseId
      ? [
          {
            value: activeFranchiseId,
            label: (
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                  {selectedFranchise?.name || currentFranchiseName}
                </span>
              </div>
            ),
            searchText:
              selectedFranchise?.name ||
              currentFranchiseName ||
              activeFranchiseId,
          },
        ]
      : [];

  let searchOptions = employeeSearchOptions;
  if (searchMode === "shiftName") {
    searchOptions = shiftSearchOptions;
  }
  if (searchMode === "franchiseName") {
    searchOptions = franchiseSearchOptions;
  }

  const selectedEmployee = pageData.employees.find(
    (employee) => String(employee.id) === searchTargetId,
  );
  const selectedShift = pageData.shifts.find(
    (shift) => String(shift.id) === searchTargetId,
  );

  let summaryText = `Showing ${pageData.displayedResultCount} assignment(s) for ${selectedFranchise?.name || "the active franchise"}.`;

  if (searchMode === "userName" && selectedEmployee) {
    summaryText = `Showing ${pageData.displayedResultCount} assignment(s) for ${selectedEmployee.name} on ${formatReadableDate(calendar.selectedDateKey)}.`;
  }

  if (searchMode === "shiftName" && selectedShift) {
    summaryText = `Showing ${pageData.displayedResultCount} assignment(s) for the ${selectedShift.name} shift.`;
  }

  const selectedSearchOptionId =
    searchMode === "franchiseName"
      ? activeFranchiseId || undefined
      : searchTargetId || undefined;

  async function handleCreateShift(
    values: CreateShiftFormData,
  ): Promise<SubmitResult | void> {
    if (!activeFranchiseId && !values.franchise_id) {
      return {
        success: false,
        error: "Choose a franchise before creating a shift.",
      };
    }

    await createShiftMutation.mutateAsync({
      ...values,
      franchise_id: values.franchise_id || activeFranchiseId,
    });
  }

  async function handleUpdateShift(
    values: UpdateShiftFormData,
  ): Promise<SubmitResult | void> {
    if (!updatingShift) {
      return { success: false, error: "No shift selected for update." };
    }

    await updateShiftMutation.mutateAsync({
      shiftId: String(updatingShift.id),
      data: values,
    });
  }

  async function handleDeleteShift() {
    if (!deletingShift) return;
    await deleteShiftMutation.mutateAsync(String(deletingShift.id));
    setDeletingShift(null);
  }

  async function handleAssignShift(
    values: AssignShiftFormData,
  ): Promise<SubmitResult | void> {
    if (!assigningShift) {
      return {
        success: false,
        error: "Choose a shift before assigning employees.",
      };
    }

    const assignmentItems = values.userIds.map((userId) => ({
      user_id: userId,
      shift_id: assigningShift.id,
      work_date: values.workDate,
      note: values.note?.trim() || undefined,
    }));

    if (assignmentItems.length === 1) {
      await assignShiftMutation.mutateAsync(assignmentItems[0]);
      return;
    }

    await assignShiftBulkMutation.mutateAsync({
      items: assignmentItems,
    });
  }

  async function handleChangeAssignmentStatus(
    values: ShiftStatusUpdateFormData,
  ): Promise<SubmitResult | void> {
    if (!assignmentDialogState) {
      return {
        success: false,
        error: "Choose an assignment before updating status.",
      };
    }

    await changeShiftAssignmentStatusMutation.mutateAsync({
      shiftAssignmentId: assignmentDialogState.assignmentId,
      data: {
        status: values.status,
      },
    });
  }

  function handleFranchiseChange(nextFranchiseId: string) {
    setSelectedFranchiseId(nextFranchiseId);
    setSearchTargetId("");
    setAssigningShift(null);
    setAssignmentDialogState(null);
  }

  function handleSearchModeChange(nextMode: ShiftSearchMode) {
    setSearchMode(nextMode);
    setSearchTargetId("");
  }

  function handleSearchOptionChange(nextValue: string) {
    if (searchMode === "franchiseName") {
      handleFranchiseChange(nextValue);
      return;
    }

    setSearchTargetId(nextValue);
  }

  function handleClearSearch() {
    if (searchMode !== "franchiseName") {
      setSearchTargetId("");
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-hide">
      <div className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col">
        <PageHeader
          title="Shift Management"
          description="Schedule shift assignments, update attendance status, and manage franchise coverage."
          icon={CalendarDays}
          action={
            canSelectFranchise ? (
              <div className="min-w-70">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8D6E63]">
                  Franchise
                </p>
                <Select
                  value={activeFranchiseId || undefined}
                  onValueChange={handleFranchiseChange}
                  disabled={franchiseOptions.length === 0}
                >
                  <SelectTrigger className="w-full border-[#E8DFD6] bg-white">
                    <SelectValue placeholder="Select franchise" />
                  </SelectTrigger>
                  <SelectContent>
                    {franchiseOptions.map((franchise) => (
                      <SelectItem key={franchise.value} value={franchise.value}>
                        {franchise.name}{" "}
                        {franchise.code ? `(${franchise.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="min-w-60 rounded-2xl border border-[#E8DFD6] bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8D6E63]">
                  Active Franchise
                </p>
                <p className="mt-1 text-sm font-semibold text-[#3E2723]">
                  {selectedFranchise?.name ||
                    currentFranchiseName ||
                    "Scoped Franchise"}
                </p>
              </div>
            )
          }
        />

        <div className="mb-6 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
          <p className="text-sm font-medium text-[#6D4C41]">{summaryText}</p>
        </div>

        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-10">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
              <ShiftCalendarToolbar
                view={calendar.view}
                label={calendar.label}
                selectedDateKey={calendar.selectedDateKey}
                onViewChange={calendar.setView}
                onPrevious={calendar.goToPrevious}
                onNext={calendar.goToNext}
                onToday={calendar.goToToday}
              />

              <ShiftCalendar
                franchiseId={activeFranchiseId}
                franchiseName={assignerFranchiseName}
                view={calendar.view}
                days={calendar.days}
                selectedDateKey={calendar.selectedDateKey}
                eventsByDate={pageData.displayedEventsByDate}
                activeAssignmentId={assignmentDialogState?.assignmentId ?? null}
                isLoading={pageData.isCalendarLoading}
                isRefreshing={pageData.isCalendarFetching}
                error={pageData.calendarError}
                onSelectDate={calendar.selectDate}
                onSelectAssignment={(event) =>
                  setAssignmentDialogState({
                    assignmentId: event.id,
                    values: buildAssignmentDialogValues(
                      event,
                      authUser?.user?.name ?? "",
                    ),
                  })
                }
                onRetry={() => {
                  void pageData.refetchAll();
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <ShiftListPanel
              franchiseId={activeFranchiseId}
              selectedDateKey={calendar.selectedDateKey}
              shifts={pageData.shiftsForPanel}
              isLoading={pageData.isShiftListLoading}
              error={pageData.shiftListError}
              onCreateShift={() => setIsCreateShiftOpen(true)}
              onAssign={(shift) => setAssigningShift(shift)}
              onDetail={(shift) => setDetailShift(shift)}
              onUpdate={(shift) => setUpdatingShift(shift)}
              onDelete={(shift) => setDeletingShift(shift)}
              onRetry={() => {
                void pageData.refetchAll();
              }}
              searchBar={
                <ShiftSearchBar
                  mode={searchMode}
                  options={searchOptions}
                  selectedOptionId={selectedSearchOptionId}
                  helperText={getSearchHelperText(
                    searchMode,
                    canSelectFranchise,
                  )}
                  disableClear={searchMode === "franchiseName"}
                  onModeChange={handleSearchModeChange}
                  onOptionChange={handleSearchOptionChange}
                  onClear={handleClearSearch}
                />
              }
            />
          </div>
        </div>
      </div>

      <CreateShiftDialog
        open={isCreateShiftOpen}
        activeFranchiseId={activeFranchiseId}
        canSelectFranchise={canSelectFranchise}
        franchiseOptions={createShiftFranchiseOptions}
        onOpenChange={setIsCreateShiftOpen}
        onSubmit={handleCreateShift}
        onSuccess={() => setIsCreateShiftOpen(false)}
      />

      <AssignShiftDialog
        open={!!assigningShift}
        shift={assigningShift}
        employeeOptions={employeeFieldOptions}
        defaultWorkDate={calendar.selectedDateKey}
        onOpenChange={(open) => {
          if (!open) {
            setAssigningShift(null);
          }
        }}
        onSubmit={handleAssignShift}
        onSuccess={() => setAssigningShift(null)}
      />

      <ShiftAssignmentDialog
        open={!!assignmentDialogState}
        values={assignmentDialogState?.values}
        onOpenChange={(open) => {
          if (!open) {
            setAssignmentDialogState(null);
          }
        }}
        onSubmit={handleChangeAssignmentStatus}
        onSuccess={() => setAssignmentDialogState(null)}
      />

      <ShiftDetailDialog
        open={!!detailShift}
        shift={detailShift}
        onOpenChange={(open) => {
          if (!open) setDetailShift(null);
        }}
      />

      <UpdateShiftDialog
        open={!!updatingShift}
        shift={updatingShift}
        onOpenChange={(open) => {
          if (!open) setUpdatingShift(null);
        }}
        onSubmit={handleUpdateShift}
        onSuccess={() => setUpdatingShift(null)}
      />

      <DeleteDialog
        open={!!deletingShift}
        onOpenChange={(open) => {
          if (!open) setDeletingShift(null);
        }}
        entity={deletingShift}
        entityName="Shift"
        onConfirm={handleDeleteShift}
        isDeleting={deleteShiftMutation.isPending}
        getDisplayName={(shift) => shift.name}
        deleteMessage={(shift) =>
          `Delete the "${shift.name}" shift? All assignments for this shift will also be removed.`
        }
      />
    </div>
  );
}

function ShiftPage() {
  const { isAdmin, getCurrentRole } = useAuthStore();
  const currentRole = getCurrentRole();
  const roleCode =
    currentRole?.code ||
    (currentRole as unknown as { role?: string })?.role ||
    "";

  if (isAdmin() || roleCode === "MANAGER") {
    return <ShiftAdminPage />;
  }

  return <StaffShiftView />;
}

export default ShiftPage;
