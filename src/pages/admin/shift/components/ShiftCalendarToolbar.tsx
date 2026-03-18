import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShiftCalendarView } from "../utils/shiftFormatters";
import { formatReadableDate } from "../utils/shiftFormatters";

type ShiftCalendarToolbarProps = {
  view: ShiftCalendarView;
  label: string;
  selectedDateKey: string;
  onViewChange: (view: ShiftCalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function ShiftCalendarToolbar({
  view,
  label,
  selectedDateKey,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: ShiftCalendarToolbarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-[#3E2723]">
          <CalendarDays className="h-5 w-5 text-[#D97706]" />
          <h2 className="text-xl font-semibold">Assignment Calendar</h2>
        </div>
        <p className="mt-1 text-sm text-[#8D6E63]">
          Focus date: {formatReadableDate(selectedDateKey)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={view}
          onValueChange={(nextValue) =>
            onViewChange(nextValue as ShiftCalendarView)
          }
        >
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 rounded-full border border-[#E8DFD6] bg-[#F8F4F0] px-2 py-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onPrevious}
            className="rounded-full text-[#6D4C41] hover:bg-[#EADFD5]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-44 text-center text-sm font-semibold text-[#3E2723]">
            {label}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onNext}
            className="rounded-full text-[#6D4C41] hover:bg-[#EADFD5]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onToday}
          className="border-[#E8DFD6] text-[#6D4C41] hover:bg-[#F3E8DD]"
        >
          Today
        </Button>
      </div>
    </div>
  );
}
