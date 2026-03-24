import { useState } from "react";
import { CalendarDays, Building2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuthStore } from "@/stores/auth-store";
import { useShiftCalendarState } from "../hooks/useShiftCalendarState";
import { useStaffShiftPageData } from "../hooks/useStaffShiftPageData";
import type { ShiftCalendarEvent } from "../hooks/useShiftPageData";
import { ShiftCalendarToolbar } from "./ShiftCalendarToolbar";
import { ShiftAssignmentTooltip } from "./ShiftAssignmentTooltip";
import { ShiftAssignmentDialog } from "./ShiftAssignmentDialog";
import type { ShiftStatusUpdateFormData } from "@/lib/schemas/shift-assignment.schema";
import {
  SHIFT_WEEKDAY_LABELS,
  formatReadableDate,
  getDisplayShiftName,
  getShiftStatusLabel,
} from "../utils/shiftFormatters";

function buildViewOnlyValues(
  event: ShiftCalendarEvent,
): ShiftStatusUpdateFormData {
  return {
    shiftName: getDisplayShiftName(event.shiftName),
    employeeName: event.employeeName,
    assignedBy: "",
    workDate: event.workDate,
    startTime: event.startTime,
    endTime: event.endTime,
    status: event.status,
  };
}

export function StaffShiftView() {
  const { authUser } = useAuthStore();

  const userId = authUser?.user?.id ? String(authUser.user.id) : "";
  const userName = authUser?.user?.name ?? "";
  const userAvatarUrl = authUser?.user?.avatarUrl ?? null;
  const franchiseName =
    authUser?.franchiseRoles?.find(
      (fr) => fr.franchiseId === authUser.currentFranchiseId,
    )?.franchiseName ?? "";

  const calendar = useShiftCalendarState();

  const pageData = useStaffShiftPageData({
    userId,
    userName,
    userAvatarUrl,
  });

  const [viewingEvent, setViewingEvent] = useState<ShiftCalendarEvent | null>(
    null,
  );

  const visibleEventCount = calendar.view === "month" ? 3 : 6;

  const todayAssignments =
    pageData.eventsByDate.get(calendar.selectedDateKey) ?? [];

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-hide">
      <div className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col">
        <PageHeader
          title="My Shifts"
          description="View your assigned shifts and schedule."
          icon={CalendarDays}
          action={
            <div className="min-w-60 rounded-2xl border border-[#E8DFD6] bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#D97706]" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8D6E63]">
                  Franchise
                </p>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#3E2723]">
                {franchiseName || "Not assigned"}
              </p>
            </div>
          }
        />

        {/* Summary bar */}
        <div className="mb-6 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#6D4C41]">
              {todayAssignments.length > 0
                ? `You have ${todayAssignments.length} shift(s) on ${formatReadableDate(calendar.selectedDateKey)}.`
                : `No shifts assigned on ${formatReadableDate(calendar.selectedDateKey)}.`}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-[#E8DFD6] bg-[#F8F4F0] text-[#6D4C41]"
              >
                Total this period: {pageData.totalCount}
              </Badge>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1">
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

            {/* Calendar grid */}
            {pageData.error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
                <p className="font-medium text-rose-700">
                  {pageData.error.message}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => pageData.refetch()}
                  className="mt-4 border-rose-200 text-rose-700"
                >
                  Retry
                </Button>
              </div>
            ) : pageData.isLoading ? (
              <div className="rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] px-6 py-14 text-center text-[#8D6E63]">
                Loading your shifts...
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-7 gap-1.5">
                  {SHIFT_WEEKDAY_LABELS.map((label) => (
                    <div
                      key={label}
                      className="rounded-xl bg-[#F8F4F0] py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#8D6E63]"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div className="mt-1.5 grid grid-cols-7 gap-1.5">
                  {calendar.days.map((day) => {
                    const dayEvents =
                      pageData.eventsByDate.get(day.dateKey) ?? [];
                    const visibleEvents = dayEvents.slice(0, visibleEventCount);
                    const overflowCount =
                      dayEvents.length - visibleEvents.length;
                    const isSelected = day.dateKey === calendar.selectedDateKey;

                    return (
                      <div
                        key={day.dateKey}
                        className={cn(
                          "rounded-2xl border p-3 transition-colors",
                          calendar.view === "month" ? "min-h-36" : "min-h-64",
                          isSelected
                            ? "border-[#6D4C41] bg-[#FFF8F0] shadow-md"
                            : "border-[#F0E5DA] bg-[#FFFCF9]",
                          !day.isCurrentPeriod && "bg-[#FAF6F2] opacity-70",
                        )}
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => calendar.selectDate(day.dateKey)}
                            className={cn(
                              "h-auto rounded-full px-3 py-1 font-semibold",
                              isSelected
                                ? "bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                                : "text-[#6D4C41] hover:bg-[#EFE3D8]",
                            )}
                          >
                            {day.date.getDate()}
                          </Button>

                          <div className="flex items-center gap-2">
                            {day.isToday && (
                              <Badge
                                variant="outline"
                                className="border-[#D97706]/20 bg-[#FFF4E5] text-[#D97706]"
                              >
                                Today
                              </Badge>
                            )}

                            {dayEvents.length > 0 && (
                              <Badge
                                variant="outline"
                                className="border-[#E8DFD6] bg-white text-[#8D6E63]"
                              >
                                {dayEvents.length}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {visibleEvents.map((event) => (
                            <ShiftAssignmentTooltip
                              key={event.id}
                              event={event}
                              label={event.shiftName}
                              isActive={viewingEvent?.id === event.id}
                              franchiseName={franchiseName}
                              onSelect={() => setViewingEvent(event)}
                            />
                          ))}

                          {overflowCount > 0 && (
                            <button
                              type="button"
                              onClick={() => calendar.selectDate(day.dateKey)}
                              className="text-xs font-medium text-[#6D4C41] underline-offset-4 hover:underline"
                            >
                              +{overflowCount} more
                            </button>
                          )}

                          {dayEvents.length === 0 &&
                            (isSelected || calendar.view === "week") && (
                              <div className="rounded-xl border border-dashed border-[#E8DFD6] px-3 py-5 text-center text-xs text-[#A1887F]">
                                No shifts
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {pageData.isFetching && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#8D6E63]">
                    <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                    Refreshing shifts...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected date detail panel */}
          {todayAssignments.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#3E2723]">
                <CalendarDays className="h-4.5 w-4.5 text-[#D97706]" />
                Shifts on {formatReadableDate(calendar.selectedDateKey)}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {todayAssignments.map((event) => {
                  const displayName = getDisplayShiftName(event.shiftName);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setViewingEvent(event)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md",
                        viewingEvent?.id === event.id
                          ? "border-[#6D4C41] bg-[#FFF8F0] shadow-md"
                          : "border-[#F0E5DA] bg-[#FFFCF9]",
                      )}
                    >
                      {displayName && (
                        <p className="mb-1 text-sm font-semibold text-[#3E2723]">
                          {displayName}
                        </p>
                      )}
                      <p className="text-xs text-[#8D6E63]">
                        {event.startTime.slice(0, 5)} -{" "}
                        {event.endTime.slice(0, 5)}
                      </p>
                      <Badge variant="outline" className="mt-2 text-[11px]">
                        {getShiftStatusLabel(event.status)}
                      </Badge>
                      {event.note && (
                        <p className="mt-2 text-xs text-[#A1887F] italic">
                          {event.note}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View-only detail dialog */}
      <ShiftAssignmentDialog
        open={!!viewingEvent}
        values={viewingEvent ? buildViewOnlyValues(viewingEvent) : undefined}
        canUpdateStatus={false}
        onOpenChange={(open) => {
          if (!open) setViewingEvent(null);
        }}
        onSubmit={async () => {}}
        onSuccess={() => setViewingEvent(null)}
      />
    </div>
  );
}
