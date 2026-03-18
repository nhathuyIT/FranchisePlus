import { Clock3, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Shift } from "@/types/shift";
import { formatTimeLabel } from "../utils/shiftFormatters";

type ShiftDetailDialogProps = {
  open: boolean;
  shift: Shift | null;
  onOpenChange: (open: boolean) => void;
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="text-sm font-medium text-[#8D6E63]">{label}</span>
      <span className="text-right text-sm font-semibold text-[#3E2723]">
        {children}
      </span>
    </div>
  );
}

export function ShiftDetailDialog({
  open,
  shift,
  onOpenChange,
}: ShiftDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723]">Shift Detail</DialogTitle>
          <DialogDescription className="text-[#8D6E63]">
            View shift template information.
          </DialogDescription>
        </DialogHeader>

        {shift && (
          <div className="divide-y divide-[#F0E5DA]">
            <DetailRow label="Shift Name">{shift.name}</DetailRow>

            <DetailRow label="Time">
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#8D6E63]" />
                {formatTimeLabel(shift.startTime)} –{" "}
                {formatTimeLabel(shift.endTime)}
              </span>
            </DetailRow>

            <DetailRow label="Franchise">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#8D6E63]" />
                {shift.franchiseId}
              </span>
            </DetailRow>

            <DetailRow label="Status">
              {shift.isActive ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-[#D7CCC8] text-[#8D6E63]"
                >
                  Inactive
                </Badge>
              )}
            </DetailRow>

            <DetailRow label="Created">
              {new Date(shift.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </DetailRow>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
