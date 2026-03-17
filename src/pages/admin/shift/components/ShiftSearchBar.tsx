import { Search, X } from "lucide-react";
import {
  PopoverSearchSelect,
  type PopoverSearchSelectOption,
} from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShiftSearchMode } from "../utils/shiftFormatters";

type ShiftSearchBarProps = {
  mode: ShiftSearchMode;
  options: PopoverSearchSelectOption[];
  selectedOptionId?: string;
  helperText: string;
  disabled?: boolean;
  disableClear?: boolean;
  onModeChange: (mode: ShiftSearchMode) => void;
  onOptionChange: (value: string) => void;
  onClear: () => void;
};

const MODE_OPTIONS: Array<{ label: string; value: ShiftSearchMode }> = [
  { label: "User Name", value: "userName" },
  { label: "Shift Name", value: "shiftName" },
  { label: "Franchise Name", value: "franchiseName" },
];

function getSearchCopy(mode: ShiftSearchMode) {
  switch (mode) {
    case "userName":
      return {
        placeholder: "Search employee",
        searchPlaceholder: "Type employee name...",
        emptyText: "No employees found",
      };
    case "shiftName":
      return {
        placeholder: "Search shift",
        searchPlaceholder: "Type shift name...",
        emptyText: "No shifts found",
      };
    case "franchiseName":
    default:
      return {
        placeholder: "Search franchise",
        searchPlaceholder: "Type franchise name...",
        emptyText: "No franchises found",
      };
  }
}

export function ShiftSearchBar({
  mode,
  options,
  selectedOptionId,
  helperText,
  disabled = false,
  disableClear = false,
  onModeChange,
  onOptionChange,
  onClear,
}: ShiftSearchBarProps) {
  const searchCopy = getSearchCopy(mode);

  return (
    <div className="rounded-2xl border border-[#E8DFD6] bg-[#FCF9F6] p-4">
      <div className="mb-3 flex items-center gap-2 text-[#3E2723]">
        <Search className="h-4 w-4 text-[#D97706]" />
        <p className="text-sm font-semibold">Search Assignments</p>
      </div>

      <div className="space-y-3">
        <Select
          value={mode}
          onValueChange={(value) => onModeChange(value as ShiftSearchMode)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full border-[#E8DFD6] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <PopoverSearchSelect
            value={selectedOptionId}
            onValueChange={onOptionChange}
            options={options}
            disabled={disabled || options.length === 0}
            placeholder={searchCopy.placeholder}
            searchPlaceholder={searchCopy.searchPlaceholder}
            emptyText={searchCopy.emptyText}
            triggerClassName="border-[#E8DFD6] bg-white"
            contentClassName="w-[min(36rem,calc(100vw-2rem))]"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onClear}
            disabled={disabled || disableClear || !selectedOptionId}
            className="border-[#E8DFD6] bg-white text-[#6D4C41] hover:bg-[#F3E8DD]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#8D6E63]">{helperText}</p>
    </div>
  );
}
