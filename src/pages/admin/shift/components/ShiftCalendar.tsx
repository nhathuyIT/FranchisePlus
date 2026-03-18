import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ShiftCalendarEvent } from "../hooks/useShiftPageData";
import type {
  ShiftCalendarDay,
  ShiftCalendarView,
} from "../utils/shiftFormatters";
import { SHIFT_WEEKDAY_LABELS } from "../utils/shiftFormatters";
import { ShiftAssignmentTooltip } from "./ShiftAssignmentTooltip";

type ShiftCalendarProps = {
  franchiseId: string;
  franchiseName: string;
  view: ShiftCalendarView;
  days: ShiftCalendarDay[];
  selectedDateKey: string;
  eventsByDate: Map<string, ShiftCalendarEvent[]>;
  activeAssignmentId: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  onSelectDate: (dateKey: string) => void;
  onSelectAssignment: (event: ShiftCalendarEvent) => void;
  onRetry: () => void;
};

export function ShiftCalendar({
  franchiseId,
  franchiseName,
  view,
  days,
  selectedDateKey,
  eventsByDate,
  activeAssignmentId,
  isLoading,
  isRefreshing,
  error,
  onSelectDate,
  onSelectAssignment,
  onRetry,
}: ShiftCalendarProps) {
  if (!franchiseId) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FBF8F5] px-6 py-14 text-center text-[#8D6E63]">
        Select a franchise to load shift assignments.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
        <p className="font-medium text-rose-700">{error.message}</p>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-4 border-rose-200 text-rose-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] px-6 py-14 text-center text-[#8D6E63]">
        Loading assignments...
      </div>
    );
  }

  const visibleEventCount = view === "month" ? 3 : 6;

  return (
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
          {days.map((day) => {
            const dayEvents = eventsByDate.get(day.dateKey) ?? [];
            const visibleEvents = dayEvents.slice(0, visibleEventCount);
            const overflowCount = dayEvents.length - visibleEvents.length;
            const isSelected = day.dateKey === selectedDateKey;

            return (
              <div
                key={day.dateKey}
                className={cn(
                  "rounded-2xl border p-3 transition-colors",
                  view === "month" ? "min-h-36" : "min-h-64",
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
                    onClick={() => onSelectDate(day.dateKey)}
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
                      isActive={activeAssignmentId === event.id}
                      franchiseName={franchiseName}
                      onSelect={() => onSelectAssignment(event)}
                    />
                  ))}

                  {overflowCount > 0 && (
                    <button
                      type="button"
                      onClick={() => onSelectDate(day.dateKey)}
                      className="text-xs font-medium text-[#6D4C41] underline-offset-4 hover:underline"
                    >
                      +{overflowCount} more
                    </button>
                  )}

                  {dayEvents.length === 0 &&
                    (isSelected || view === "week") && (
                      <div className="rounded-xl border border-dashed border-[#E8DFD6] px-3 py-5 text-center text-xs text-[#A1887F]">
                        No tasks assigned
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

      {isRefreshing && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[#8D6E63]">
          <RotateCcw className="h-3.5 w-3.5 animate-spin" />
          Refreshing assignments...
        </div>
      )}
    </div>
  );
}
