import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ShiftCalendarView } from "../utils/shiftFormatters";

type ShiftCalendarSkeletonProps = {
  view: ShiftCalendarView;
  dayCount?: number;
};

type ShiftListPanelSkeletonProps = {
  itemCount?: number;
};

type ShiftRefreshSkeletonProps = {
  className?: string;
};

const WEEKDAY_SKELETON_COUNT = 7;

export function ShiftCalendarSkeleton({
  view,
  dayCount,
}: ShiftCalendarSkeletonProps) {
  const resolvedDayCount = dayCount && dayCount > 0
    ? dayCount
    : view === "month"
      ? 35
      : 7;
  const itemCountPerDay = view === "month" ? 2 : 4;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: WEEKDAY_SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={`weekday-skeleton-${index}`} className="h-9 w-full rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: resolvedDayCount }).map((_, index) => (
          <div
            key={`calendar-skeleton-${index}`}
            className={cn(
              "rounded-2xl border border-[#F0E5DA] bg-[#FFFCF9] p-3",
              view === "month" ? "min-h-36" : "min-h-64",
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <Skeleton className="h-8 w-11 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>

            <div className="space-y-2">
              {Array.from({ length: itemCountPerDay }).map((__, itemIndex) => (
                <div
                  key={`calendar-skeleton-item-${index}-${itemIndex}`}
                  className="rounded-2xl border border-[#E8DFD6] bg-white/70 p-3"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShiftListPanelSkeleton({
  itemCount = 4,
}: ShiftListPanelSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={`shift-list-skeleton-${index}`}
          className="rounded-2xl border border-[#F0E5DA] bg-[#FFFCF9] p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-5 w-32 max-w-full" />
              <Skeleton className="mt-3 h-4 w-28 max-w-full" />
              <Skeleton className="mt-3 h-3 w-40 max-w-full" />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShiftRefreshSkeleton({
  className,
}: ShiftRefreshSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Skeleton className="h-3.5 w-3.5 rounded-full" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
