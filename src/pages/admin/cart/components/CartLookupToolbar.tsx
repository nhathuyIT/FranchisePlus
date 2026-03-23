import type { PopoverSearchSelectOption } from "@/components/form-dialog";
import { PopoverSearchSelect } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { CustomerStatusFilter } from "../types";

const CUSTOMER_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "CHECKED_OUT", value: "CHECKED_OUT" },
  { label: "CANCELED", value: "CANCELED" },
] as const;

interface CartLookupToolbarProps {
  selectedUserId?: string;
  userOptions: PopoverSearchSelectOption[];
  userSearchOpen: boolean;
  onUserSearchOpenChange: (open: boolean) => void;
  userSearchValue: string;
  onUserSearchValueChange: (value: string) => void;
  onUserChange: (userId: string) => void;
  isUserSearchLoading: boolean;
  customerStatus: CustomerStatusFilter;
  onCustomerStatusChange: (value: CustomerStatusFilter) => void;
  onClear: () => void;
  isClearDisabled: boolean;
}

export const CartLookupToolbar = ({
  selectedUserId,
  userOptions,
  userSearchOpen,
  onUserSearchOpenChange,
  userSearchValue,
  onUserSearchValueChange,
  onUserChange,
  isUserSearchLoading,
  customerStatus,
  onCustomerStatusChange,
  onClear,
  isClearDisabled,
}: CartLookupToolbarProps) => (
  <div className="mb-4 flex shrink-0 flex-wrap items-center gap-3">
    <div className="min-w-[320px] flex-1">
      <PopoverSearchSelect
        value={selectedUserId}
        onValueChange={onUserChange}
        options={userOptions}
        open={userSearchOpen}
        onOpenChange={onUserSearchOpenChange}
        searchValue={userSearchValue}
        onSearchValueChange={onUserSearchValueChange}
        placeholder="Search and select user"
        searchPlaceholder="Search user by name, email, or phone..."
        emptyText="No users found"
        loadingText="Searching users..."
        isLoading={isUserSearchLoading}
        minChars={3}
        triggerClassName="border-[#E8DFD6] bg-white"
        contentClassName="w-[min(42rem,calc(100vw-2rem))]"
      />
    </div>

    <Select
      value={customerStatus}
      onValueChange={(value) => onCustomerStatusChange(value as CustomerStatusFilter)}
    >
      <SelectTrigger className="w-44 border-[#E8DFD6] focus:border-[#6D4C41]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {CUSTOMER_STATUS_OPTIONS.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Button
      type="button"
      variant="outline"
      onClick={onClear}
      disabled={isClearDisabled}
      className="gap-2 border-[#E8DFD6] bg-white text-[#6D4C41] hover:bg-[#FAF8F5]"
    >
      <X className="h-4 w-4" />
      Clear
    </Button>
  </div>
);
