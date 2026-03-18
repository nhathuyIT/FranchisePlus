import { Button } from "@/components/ui/button";
import { FormDialog, type SubmitResult } from "@/components/form-dialog";
import {
  ShiftStatusUpdateSchema,
  type ShiftStatusUpdateFormData,
} from "@/lib/schemas/shift-assignment.schema";
import { getShiftFields } from "../utils/shiftFields";

type ShiftAssignmentDialogProps = {
  open: boolean;
  values?: ShiftStatusUpdateFormData;
  canUpdateStatus?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ShiftStatusUpdateFormData) => Promise<SubmitResult | void>;
  onSuccess: () => void;
};

const EMPTY_VALUES: ShiftStatusUpdateFormData = {
  shiftName: "",
  employeeName: "",
  assignedBy: "",
  workDate: "",
  startTime: "",
  endTime: "",
  status: "ASSIGNED",
};

export function ShiftAssignmentDialog({
  open,
  values,
  canUpdateStatus = true,
  onOpenChange,
  onSubmit,
  onSuccess,
}: ShiftAssignmentDialogProps) {
  return (
    <FormDialog<ShiftStatusUpdateFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Shift Assignment"
      description="Review the assignment and update the current status."
      size="lg"
      schema={ShiftStatusUpdateSchema}
      fields={getShiftFields(canUpdateStatus)}
      defaultValues={EMPTY_VALUES}
      values={values}
      mode="edit"
      columns={2}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
      renderFooter={({ form, isSubmitting, onCancel }) => {
        if (!canUpdateStatus) {
          return (
            <div className="flex justify-end">
              <Button type="button" onClick={onCancel}>
                Close
              </Button>
            </div>
          );
        }

        const hasStatusChanged = form.watch("status") !== values?.status;

        return (
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6D4C41] text-white hover:bg-[#3E2723]"
              disabled={isSubmitting || !values || !hasStatusChanged}
            >
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </div>
        );
      }}
    />
  );
}
