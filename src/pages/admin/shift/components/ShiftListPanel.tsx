import type { ReactNode } from "react";
import { Clock3, MoreHorizontal, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Shift } from "@/types/shift";
import type { ShiftListItem } from "../hooks/useShiftPageData";
import {
  formatReadableDate,
  formatTimeLabel,
} from "../utils/shiftFormatters";
import { ShiftListPanelSkeleton } from "./ShiftLoadingSkeletons";

type ShiftListPanelProps = {
  franchiseId: string;
  selectedDateKey: string;
  shifts: ShiftListItem[];
  isLoading: boolean;
  error: Error | null;
  searchBar: ReactNode;
  onCreateShift: () => void;
  onAssign: (shift: Shift) => void;
  onDetail: (shift: Shift) => void;
  onUpdate: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
  onRetry: () => void;
};

export function ShiftListPanel({
  franchiseId,
  selectedDateKey,
  shifts,
  isLoading,
  error,
  searchBar,
  onCreateShift,
  onAssign,
  onDetail,
  onUpdate,
  onDelete,
  onRetry,
}: ShiftListPanelProps) {
  return (
    <div className="flex min-h-0 flex-col rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#3E2723]">Shift List</h2>
          <p className="mt-1 text-sm text-[#8D6E63]">
            Assign employees for {formatReadableDate(selectedDateKey)}.
          </p>
        </div>

        <Button
          type="button"
          onClick={onCreateShift}
          disabled={!franchiseId}
          className="rounded-full bg-[#6D4C41] text-white shadow-md transition-all duration-300 hover:bg-[#3E2723] hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Shift
        </Button>
      </div>

      <div className="mb-4">{searchBar}</div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {!franchiseId ? (
          <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FBF8F5] px-5 py-8 text-center text-[#8D6E63]">
            Select a franchise to load shifts.
          </div>
        ) : isLoading ? (
          <ShiftListPanelSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
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
        ) : shifts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FBF8F5] px-5 py-8 text-center text-[#8D6E63]">
            No active shifts found for this franchise.
          </div>
        ) : (
          shifts.map((shift) => (
            <div
              key={shift.id}
              className="rounded-2xl border border-[#F0E5DA] bg-[#FFFCF9] p-4 transition-colors hover:border-[#D7CCC8]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-[#3E2723]">
                    {shift.name}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-[#6D4C41]">
                    <Clock3 className="h-4 w-4" />
                    {formatTimeLabel(shift.startTime)} -{" "}
                    {formatTimeLabel(shift.endTime)}
                  </p>
                  <p className="mt-2 text-xs text-[#8D6E63]">
                    {shift.assignedCount} assignment
                    {shift.assignedCount === 1 ? "" : "s"} on the selected day
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onAssign(shift)}
                    className="border-[#D7CCC8] bg-white text-[#6D4C41] hover:bg-[#F3E8DD]"
                  >
                    Assign
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#8D6E63] hover:bg-[#F3E8DD] hover:text-[#6D4C41]"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        onClick={() => onDetail(shift)}
                        className="cursor-pointer gap-2 text-[#3E2723]"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdate(shift)}
                        className="cursor-pointer gap-2 text-[#3E2723]"
                      >
                        <Pencil className="h-4 w-4" />
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(shift)}
                        className="cursor-pointer gap-2 text-rose-600 focus:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
