import type { FranchiseSelectItem } from "@/api/franchise/franchise.type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatReadableDate } from "../shift-page.utils";

type ShiftOverviewFiltersProps = {
  canSelectFranchise: boolean;
  franchiseOptions: FranchiseSelectItem[];
  activeFranchiseId: string;
  selectedFranchise?: FranchiseSelectItem;
  scopedFranchiseName?: string;
  selectedDateKey: string;
  assignedCount: number;
  openSlotsCount: number;
  onFranchiseChange: (franchiseId: string) => void;
  onDateChange: (dateKey: string) => void;
};

export const ShiftOverviewFilters = ({
  canSelectFranchise,
  franchiseOptions,
  activeFranchiseId,
  selectedFranchise,
  scopedFranchiseName,
  selectedDateKey,
  assignedCount,
  openSlotsCount,
  onFranchiseChange,
  onDateChange,
}: ShiftOverviewFiltersProps) => {
  const displayFranchise =
    selectedFranchise ??
    franchiseOptions.find((franchise) => franchise.value === activeFranchiseId);
  const displayFranchiseName =
    displayFranchise?.name ?? scopedFranchiseName ?? "Franchise not available";
  const hasScopedFranchise = displayFranchiseName !== "Franchise not available";

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_220px_180px]">
      <div className="rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8D6E63]">
              Franchise Scope
            </p>
            <p className="mt-2 text-lg font-semibold text-[#3E2723]">
              {canSelectFranchise
                ? "Choose the franchise to review shifts"
                : displayFranchiseName}
            </p>
            <p className="mt-1 text-sm text-[#8D6E63]">
              {canSelectFranchise
                ? "Switch location context before reviewing assignments or creating shifts."
                : "This schedule follows your assigned franchise automatically."}
            </p>
          </div>

          <span className="rounded-full bg-[#F3E7DB] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6D4C41]">
            {canSelectFranchise ? "Admin Access" : "Role Scoped"}
          </span>
        </div>

        {canSelectFranchise ? (
          <div className="mt-4 space-y-2">
            <Label htmlFor="shift-franchise-select">Franchise</Label>
            <Select
              value={activeFranchiseId || "none"}
              onValueChange={(value) => {
                if (value === "none") return;
                onFranchiseChange(value);
              }}
              disabled={franchiseOptions.length === 0}
            >
              <SelectTrigger
                id="shift-franchise-select"
                className="w-full border-[#E8DFD6] focus:border-[#6D4C41]"
              >
                <SelectValue placeholder="Select franchise" />
              </SelectTrigger>
              <SelectContent>
                {franchiseOptions.map((franchise) => (
                  <SelectItem key={franchise.value} value={franchise.value}>
                    {franchise.name} ({franchise.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <div className="rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
                Franchise Name
              </p>
              <p className="mt-2 break-words text-lg font-semibold text-[#3E2723]">
                {displayFranchiseName}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8DFD6] bg-[#FFFCF9] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
                Reference
              </p>
              <p className="mt-2 text-sm font-semibold text-[#3E2723]">
                {displayFranchise?.code || "Scoped account"}
              </p>
              <p className="mt-1 text-xs text-[#8D6E63]">
                Assignments are filtered for this franchise only.
              </p>
            </div>
          </div>
        )}

        <p className="mt-3 text-sm text-[#8D6E63]">
          {canSelectFranchise
            ? displayFranchise
              ? `Working with ${displayFranchise.name}.`
              : "Choose a franchise to load assignments and shifts."
            : hasScopedFranchise
              ? `Working with ${displayFranchiseName}.`
              : "Your account is scoped to a franchise."}
        </p>
      </div>

      <div className="rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8D6E63]">
          Focus Date
        </p>
        <div className="mt-3 space-y-2">
          <Label htmlFor="shift-date-select">Selected day</Label>
          <Input
            id="shift-date-select"
            type="date"
            value={selectedDateKey}
            onChange={(event) => onDateChange(event.target.value)}
            className="border-[#E8DFD6] focus-visible:ring-[#6D4C41]/20"
          />
        </div>
        <p className="mt-3 text-sm text-[#8D6E63]">
          {formatReadableDate(selectedDateKey)}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8D6E63]">
            Assigned
          </p>
          <p className="mt-2 text-3xl font-bold text-[#3E2723]">
            {assignedCount}
          </p>
          <p className="text-sm text-[#8D6E63]">Task labels on this day</p>
        </div>
        <div className="rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8D6E63]">
            Open Slots
          </p>
          <p className="mt-2 text-3xl font-bold text-[#3E2723]">
            {openSlotsCount}
          </p>
          <p className="text-sm text-[#8D6E63]">Shifts still unassigned</p>
        </div>
      </div>
    </div>
  );
};
