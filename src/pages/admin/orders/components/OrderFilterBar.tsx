import { RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminOrderStatus } from "../models/order-management.type";

interface OrderFilterBarProps {
  statusFilters: Array<{ value: AdminOrderStatus | "all"; label: string }>;
  statusFilter: AdminOrderStatus | "all";
  onStatusFilterChange: (value: AdminOrderStatus | "all") => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  disabled?: boolean;
}

export function OrderFilterBar({
  statusFilters,
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
  onRefresh,
  isRefreshing,
  disabled = false,
}: OrderFilterBarProps) {
  return (
    <div className="mb-4 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => {
          const isActive = filter.value === statusFilter;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusFilterChange(filter.value)}
              disabled={disabled}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-[#6D4C41] bg-[#6D4C41] text-white"
                  : "border-[#D7CCC8] bg-white text-[#5D4037] hover:bg-[#F5F0EA]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D6E63]" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by order code or phone"
            disabled={disabled}
            className="border-[#E8DFD6] bg-white pl-10"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={disabled || isRefreshing}
          className="border-[#D9CBBF] text-[#6D4C41] hover:bg-[#FFF8F1]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
