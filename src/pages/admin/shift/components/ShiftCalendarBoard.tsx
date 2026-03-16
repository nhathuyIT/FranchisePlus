import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customer";
import type { Shift } from "@/types/shift";
import type { ShiftAssignmentListItem } from "@/types/shift-assignment.type";
import {
  WEEKDAY_LABELS,
  type CalendarCell,
  formatClock,
  formatMonthLabel,
  getStatusStyles,
} from "../shift-page.utils";

type ShiftCalendarBoardProps = {
  activeFranchiseId: string;
  boardError: Error | null;
  boardLoading: boolean;
  boardRefreshing: boolean;
  monthCursor: Date;
  calendarDays: CalendarCell[];
  assignmentsByDate: Map<string, ShiftAssignmentListItem[]>;
  selectedDateKey: string;
  activeSelectedAssignmentId: string | null;
  shiftDetailsById: Map<string, Shift>;
  shiftsById: Map<string, Shift>;
  usersById: Map<string, Customer>;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (dateKey: string) => void;
  onSelectAssignment: (
    assignment: ShiftAssignmentListItem,
    dateKey: string,
  ) => void;
  onRetry: () => void;
};

type AssignmentHoverPreviewProps = {
  assignment: ShiftAssignmentListItem;
  shift?: Shift;
  user?: Customer;
  userName: string;
  isOpen: boolean;
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: () => void;
};

const formatStatusLabel = (status: ShiftAssignmentListItem["status"]) =>
  `${status.charAt(0)}${status.slice(1).toLowerCase()}`;

const getInitials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "NA";

const AssignmentHoverPreview = ({
  assignment,
  shift,
  user,
  userName,
  isOpen,
  isActive,
  onOpen,
  onClose,
  onSelect,
}: AssignmentHoverPreviewProps) => {
  const taskName = shift?.name ?? "Unknown task";
  const timeRange = `${formatClock(assignment.startTime || shift?.startTime)} - ${formatClock(assignment.endTime || shift?.endTime)}`;

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          onFocus={onOpen}
          onBlur={onClose}
          onClick={onSelect}
          className={cn(
            "w-full rounded-xl border px-3 py-2 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D4C41]/25",
            getStatusStyles(assignment.status),
            isActive && "ring-2 ring-[#6D4C41]/25",
          )}
        >
          <p className="truncate text-sm font-semibold">
            {`${taskName} - ${userName}`}
          </p>
          <p className="truncate text-xs opacity-90">{timeRange}</p>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="pointer-events-none w-80 rounded-[24px] border border-[#E8DFD6] bg-white/98 p-0 shadow-[0_24px_60px_rgba(93,64,55,0.18)]"
      >
        <div className="relative overflow-hidden rounded-[24px]">
          <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-r from-[#F3E7DB] via-[#FFF8F1] to-[#F8EFE7]" />

          <div className="relative p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A1887F]">
                  Task
                </p>
                <p className="mt-1 truncate text-base font-semibold text-[#3E2723]">
                  {taskName}
                </p>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 border px-2.5 py-1 text-[11px] font-semibold",
                  getStatusStyles(assignment.status),
                )}
              >
                {formatStatusLabel(assignment.status)}
              </Badge>
            </div>

            <div className="mt-4 rounded-2xl border border-[#F0E5DA] bg-white/90 p-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
                Employee
              </p>

              <div className="mt-2 flex items-center gap-3">
                <Avatar size="lg" className="border border-[#E8DFD6] shadow-sm">
                  {user?.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={userName} />
                  ) : null}
                  <AvatarFallback className="bg-[#F3E7DB] text-sm font-semibold text-[#6D4C41]">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#3E2723]">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-[#8D6E63]">
                    {user?.email || "Assigned staff member"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#F0E5DA] bg-[#FCF9F6] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
                  Shift Time
                </p>
                <p className="mt-2 text-sm font-semibold text-[#3E2723]">
                  {timeRange}
                </p>
              </div>

              <div className="rounded-2xl border border-[#F0E5DA] bg-[#FCF9F6] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-[#3E2723]">
                  {formatStatusLabel(assignment.status)}
                </p>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#8D6E63]">
              Hover to preview. Click to open assignment details.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ShiftCalendarBoard = ({
  activeFranchiseId,
  boardError,
  boardLoading,
  boardRefreshing,
  monthCursor,
  calendarDays,
  assignmentsByDate,
  selectedDateKey,
  activeSelectedAssignmentId,
  shiftDetailsById,
  shiftsById,
  usersById,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
  onSelectAssignment,
  onRetry,
}: ShiftCalendarBoardProps) => {
  const [hoveredAssignmentId, setHoveredAssignmentId] = useState<string | null>(
    null,
  );
  const visibleCalendarDays = calendarDays.slice(0, 35);

  return (
    <div className="rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#3E2723]">
            Assignment Calendar
          </h2>
          <p className="mt-1 text-sm text-[#8D6E63]">
            Hover a task to preview details, then click to inspect or update it.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#E8DFD6] bg-[#F8F4F0] px-2 py-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onPreviousMonth}
            className="rounded-full text-[#6D4C41] hover:bg-[#EADFD5]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-40 text-center text-sm font-semibold text-[#3E2723]">
            {formatMonthLabel(monthCursor)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onNextMonth}
            className="rounded-full text-[#6D4C41] hover:bg-[#EADFD5]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!activeFranchiseId ? (
        <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FBF8F5] px-6 py-10 text-center text-[#8D6E63]">
          Pick a franchise to load the monthly shift board.
        </div>
      ) : boardError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
          <p className="font-medium text-rose-700">{boardError.message}</p>
          <Button
            type="button"
            onClick={onRetry}
            variant="outline"
            className="mt-4 border-rose-200 text-rose-700"
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-190">
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="rounded-xl bg-[#F8F4F0] py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#8D6E63]"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {visibleCalendarDays.map((day) => {
                const dayAssignments = assignmentsByDate.get(day.dateKey) ?? [];
                const isSelectedDay = day.dateKey === selectedDateKey;
                const visibleAssignments = dayAssignments.slice(0, 3);
                const overflowCount =
                  dayAssignments.length - visibleAssignments.length;

                return (
                  <div
                    key={day.dateKey}
                    className={cn(
                      "min-h-36 rounded-2xl border p-3 transition-colors",
                      isSelectedDay
                        ? "border-[#6D4C41] bg-[#FFF8F0] shadow-md"
                        : "border-[#F0E5DA] bg-[#FFFCF9]",
                      !day.isCurrentMonth && "bg-[#FAF6F2] opacity-65",
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectDate(day.dateKey)}
                        className={cn(
                          "h-auto rounded-full px-3 py-1 font-semibold",
                          isSelectedDay
                            ? "bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                            : "text-[#6D4C41] hover:bg-[#EFE3D8]",
                        )}
                      >
                        {day.date.getDate()}
                      </Button>

                      {dayAssignments.length > 0 && (
                        <Badge
                          variant="outline"
                          className="border-[#E8DFD6] bg-white text-[#8D6E63]"
                        >
                          {dayAssignments.length}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      {visibleAssignments.map((assignment) => {
                        const shift =
                          shiftDetailsById.get(String(assignment.shiftId)) ??
                          shiftsById.get(String(assignment.shiftId));
                        const user = usersById.get(String(assignment.userId));
                        const userName =
                          assignment.userName ||
                          user?.name ||
                          "Loading user...";

                        return (
                          <AssignmentHoverPreview
                            key={assignment.id}
                            assignment={assignment}
                            shift={shift}
                            user={user}
                            userName={userName}
                            isOpen={hoveredAssignmentId === assignment.id}
                            isActive={
                              activeSelectedAssignmentId === assignment.id
                            }
                            onOpen={() => setHoveredAssignmentId(assignment.id)}
                            onClose={() =>
                              setHoveredAssignmentId((current) =>
                                current === assignment.id ? null : current,
                              )
                            }
                            onSelect={() =>
                              onSelectAssignment(assignment, day.dateKey)
                            }
                          />
                        );
                      })}

                      {overflowCount > 0 && (
                        <button
                          type="button"
                          onClick={() => onSelectDate(day.dateKey)}
                          className="text-xs font-medium text-[#6D4C41] underline-offset-4 hover:underline"
                        >
                          +{overflowCount} more
                        </button>
                      )}

                      {isSelectedDay && dayAssignments.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[#E8DFD6] px-3 py-5 text-center text-xs text-[#A1887F]">
                          No tasks assigned
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {boardRefreshing && !boardLoading && (
        <p className="mt-4 text-xs text-[#8D6E63]">
          Refreshing shifts and assignments...
        </p>
      )}
    </div>
  );
};
