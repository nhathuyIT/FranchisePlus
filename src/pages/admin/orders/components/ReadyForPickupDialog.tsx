/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, UserRound } from "lucide-react";
import { PopoverSearchSelect } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useUserFranchiseRoleSearch } from "@/hooks/user-franchise-role";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReadyForPickupPayload } from "../models/order-management.type";

const isStaffRole = (roleCode?: string | null, roleName?: string | null) => {
  const normalized = `${roleCode || ""} ${roleName || ""}`.toUpperCase();

  return (
    normalized.includes("STAFF") ||
    normalized.includes("EMPLOYEE") ||
    normalized.includes("SHIP") ||
    normalized.includes("DELIVERY")
  );
};

interface ReadyForPickupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  franchiseId: string;
  isSubmitting: boolean;
  onSubmit: (payload: ReadyForPickupPayload) => Promise<void>;
}

export function ReadyForPickupDialog({
  open,
  onOpenChange,
  franchiseId,
  isSubmitting,
  onSubmit,
}: ReadyForPickupDialogProps) {
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const debouncedSearchValue = useDebounce(
    searchValue.trim(),
    350,
    searchValue,
  );
  const staffQuery = useUserFranchiseRoleSearch(
    {
      searchCondition: {
        franchiseId: franchiseId || undefined,
        isDeleted: false,
        ...(debouncedSearchValue ? { keyword: debouncedSearchValue } : {}),
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 1000,
      },
    },
    {
      enabled: open && !!franchiseId,
    },
  );

  useEffect(() => {
    if (!open) {
      setSelectedStaffId("");
      setSearchValue("");
      setValidationError("");
    }
  }, [open]);

  const staffAssignments = useMemo(
    () =>
      (staffQuery.data?.pageData ?? []).filter(
        (assignment) =>
          assignment.franchiseId === franchiseId &&
          !assignment.isDeleted &&
          isStaffRole(assignment.roleCode, assignment.roleName),
      ),
    [franchiseId, staffQuery.data?.pageData],
  );

  const staffMembers = useMemo(() => {
    const uniqueStaffByUserId = new Map<
      string,
      {
        userId: string;
        name: string;
        email?: string | null;
        roleLabel?: string | null;
      }
    >();

    for (const assignment of staffAssignments) {
      if (!assignment.userId || uniqueStaffByUserId.has(assignment.userId)) {
        continue;
      }

      uniqueStaffByUserId.set(assignment.userId, {
        userId: assignment.userId,
        name: assignment.userName?.trim() || assignment.userId,
        email: assignment.userEmail,
        roleLabel: assignment.roleName || assignment.roleCode,
      });
    }

    return Array.from(uniqueStaffByUserId.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [staffAssignments]);

  const options = useMemo(
    () =>
      staffMembers.map((staff) => ({
        value: staff.userId,
        label: (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{staff.name}</span>
            <span className="truncate text-xs text-[#8D6E63]">
              {[staff.email, staff.roleLabel].filter(Boolean).join(" - ") ||
                staff.userId}
            </span>
          </div>
        ),
        searchText: [staff.name, staff.email, staff.roleLabel]
          .filter(Boolean)
          .join(" "),
      })),
    [staffMembers],
  );

  const selectedStaff = staffMembers.find(
    (staff) => staff.userId === selectedStaffId,
  );

  const handleSubmit = async () => {
    if (!selectedStaffId) {
      setValidationError("Select one delivery staff member before submitting.");
      return;
    }

    setValidationError("");

    try {
      await onSubmit({ staffId: selectedStaffId });
      onOpenChange(false);
    } catch {
      // Toast is handled by the mutation hook.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ready for Pickup</DialogTitle>
          <DialogDescription>
            Choose the delivery staff assigned to this order before moving it to
            the next status.
          </DialogDescription>
        </DialogHeader>

        {!franchiseId ? (
          <div className="flex items-start gap-3 rounded-2xl border border-[#F2D6C9] bg-[#FFF7F2] px-4 py-4 text-sm text-[#7A271A]">
            <AlertCircle className="mt-0.5 h-4 w-4 text-[#C2410C]" />
            <p>
              This order does not have a valid franchise, so the staff list
              cannot be loaded.
            </p>
          </div>
        ) : staffQuery.error instanceof Error ? (
          <div className="rounded-2xl border border-[#F5C6CB] bg-[#FFF5F5] px-4 py-4 text-sm text-[#9B2C2C]">
            <p className="font-semibold">
              Failed to load staff role assignments.
            </p>
            <p className="mt-1">{staffQuery.error.message}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void staffQuery.refetch();
              }}
              className="mt-4 border-[#E8DFD6] text-[#6D4C41]"
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <PopoverSearchSelect
              value={selectedStaffId}
              onValueChange={(value) => {
                setSelectedStaffId(value);
                setValidationError("");
              }}
              options={options}
              placeholder="Select one delivery staff member"
              searchPlaceholder="Search by name, email, or role"
              emptyText="No staff role assignments found for this franchise"
              isLoading={staffQuery.isLoading || staffQuery.isFetching}
              loadingText="Loading staff..."
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
            />

            {selectedStaff && (
              <div className="rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-4">
                <div className="flex items-start gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 text-[#8D6E63]" />
                  <div>
                    <p className="text-sm font-semibold text-[#3E2723]">
                      {selectedStaff.name}
                    </p>
                    <p className="mt-1 text-sm text-[#6D4C41]">
                      {[selectedStaff.email, selectedStaff.roleLabel]
                        .filter(Boolean)
                        .join(" - ") || selectedStaff.userId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {validationError && (
              <p className="text-sm text-[#9B2C2C]">{validationError}</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E8DFD6] text-[#6D4C41]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={!franchiseId || isSubmitting}
            className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
          >
            {isSubmitting ? "Submitting..." : "Confirm Staff"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
