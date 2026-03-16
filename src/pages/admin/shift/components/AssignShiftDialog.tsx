import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "@/types/customer";
import type { Shift } from "@/types/shift";
import type { AssignShiftFormState } from "../shift-page.utils";
import { formatClock } from "../shift-page.utils";

type AssignShiftDialogProps = {
  open: boolean;
  shift: Shift | null;
  users: Customer[];
  form: AssignShiftFormState;
  onOpenChange: (open: boolean) => void;
  onFormChange: (patch: Partial<AssignShiftFormState>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
};

export const AssignShiftDialog = ({
  open,
  shift,
  users,
  form,
  onOpenChange,
  onFormChange,
  onSubmit,
  isPending,
}: AssignShiftDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
          <DialogDescription>
            {shift
              ? `Assign "${shift.name}" to a team member.`
              : "Choose a shift to assign."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="rounded-2xl bg-[#F8F4F0] p-4">
            <p className="text-sm font-semibold text-[#3E2723]">
              {shift?.name ?? "Shift"}
            </p>
            <p className="mt-2 text-sm text-[#6D4C41]">
              {shift
                ? `${formatClock(shift.startTime)} - ${formatClock(shift.endTime)}`
                : "--:--"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-shift-user">Employee</Label>
            <Select
              value={form.userId || "none"}
              onValueChange={(value) =>
                onFormChange({ userId: value === "none" ? "" : value })
              }
            >
              <SelectTrigger id="assign-shift-user" className="w-full">
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={String(user.id)} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-shift-date">Work date</Label>
            <Input
              id="assign-shift-date"
              type="date"
              value={form.workDate}
              onChange={(event) =>
                onFormChange({ workDate: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-shift-note">Note</Label>
            <Textarea
              id="assign-shift-note"
              placeholder="Optional note for this assignment..."
              value={form.note}
              onChange={(event) => onFormChange({ note: event.target.value })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6D4C41] text-white hover:bg-[#3E2723]"
              disabled={isPending}
            >
              {isPending ? "Assigning..." : "Assign Shift"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
