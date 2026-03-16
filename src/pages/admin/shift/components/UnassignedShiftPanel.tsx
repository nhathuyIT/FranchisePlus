import { Clock3, Plus, Sparkles } from "lucide-react";
import type { FranchiseSelectItem } from "@/api/franchise/franchise.type";
import { Button } from "@/components/ui/button";
import type { Shift } from "@/types/shift";
import { formatClock, formatReadableDate } from "../shift-page.utils";

type UnassignedShiftPanelProps = {
  activeFranchiseId: string;
  boardLoading: boolean;
  canManageShifts: boolean;
  selectedDateKey: string;
  selectedFranchise?: FranchiseSelectItem;
  unassignedShifts: Shift[];
  onCreate: () => void;
  onAssign: (shift: Shift) => void;
};

export const UnassignedShiftPanel = ({
  activeFranchiseId,
  boardLoading,
  canManageShifts,
  selectedDateKey,
  selectedFranchise,
  unassignedShifts,
  onCreate,
  onAssign,
}: UnassignedShiftPanelProps) => {
  return (
    <div className="flex min-h-0 flex-col rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#3E2723]">
            Unassigned Shifts
          </h2>
          <p className="mt-1 text-sm text-[#8D6E63]">
            {canManageShifts
              ? `Ready-to-fill shifts for ${formatReadableDate(selectedDateKey)}.`
              : `View open shifts for ${formatReadableDate(selectedDateKey)}.`}
          </p>
        </div>

        {canManageShifts ? (
          <Button
            type="button"
            onClick={onCreate}
            className="rounded-full bg-[#6D4C41] text-white shadow-md transition-all duration-300 hover:bg-[#3E2723] hover:shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        ) : (
          <span className="rounded-full bg-[#F3E7DB] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6D4C41]">
            View Only
          </span>
        )}
      </div>

      <div className="mb-4 rounded-2xl bg-[#F8F4F0] p-4 text-sm text-[#6D4C41]">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="h-4 w-4 text-[#D97706]" />
          {selectedFranchise
            ? canManageShifts
              ? `${selectedFranchise.name} has ${unassignedShifts.length} open shift${unassignedShifts.length === 1 ? "" : "s"} on this date.`
              : `${selectedFranchise.name} currently has ${unassignedShifts.length} open shift${unassignedShifts.length === 1 ? "" : "s"} for review on this date.`
            : "Choose a franchise to see open shifts."}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {!activeFranchiseId ? (
          <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FBF8F5] px-5 py-8 text-center text-[#8D6E63]">
            Franchise selection is required before you can manage shifts.
          </div>
        ) : boardLoading ? (
          <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FBF8F5] px-5 py-8 text-center text-[#8D6E63]">
            Loading shifts and assignments...
          </div>
        ) : unassignedShifts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FBF8F5] px-5 py-8 text-center text-[#8D6E63]">
            Every active shift already has an assignment on this day.
          </div>
        ) : (
          unassignedShifts.map((shift) => (
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
                    {formatClock(shift.startTime)} - {formatClock(shift.endTime)}
                  </p>
                </div>

                {canManageShifts ? (
                  <Button
                    type="button"
                    onClick={() => onAssign(shift)}
                    variant="outline"
                    className="border-[#D7CCC8] bg-white text-[#6D4C41] hover:bg-[#F3E8DD]"
                  >
                    Assign
                  </Button>
                ) : (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#A1887F]">
                    View Only
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
