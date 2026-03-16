import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import type { SubmitResult } from "@/components/form-dialog";
import {
  shiftAssignmentDetailDefaultValues,
  shiftAssignmentDetailFields,
  shiftAssignmentDetailSchema,
  type ShiftAssignmentDetailFormData,
} from "../shift-assignment-detail-form.config";

type ShiftAssignmentDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values?: ShiftAssignmentDetailFormData;
  canManageStatus: boolean;
  onSubmit: (
    data: ShiftAssignmentDetailFormData,
  ) => Promise<SubmitResult | void>;
};

export const ShiftAssignmentDetailDialog = ({
  open,
  onOpenChange,
  values,
  canManageStatus,
  onSubmit,
}: ShiftAssignmentDetailDialogProps) => {
  const fields = useMemo(
    () =>
      shiftAssignmentDetailFields.map((field) =>
        field.name === "status"
          ? {
              ...field,
              disabled: !canManageStatus,
            }
          : field,
      ),
    [canManageStatus],
  );

  return (
    <FormDialog<ShiftAssignmentDetailFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Assignment Detail"
      description={
        canManageStatus
          ? "Review assignment details and update the task status."
          : "Review assignment details in view-only mode."
      }
      size="xl"
      schema={shiftAssignmentDetailSchema}
      fields={fields}
      defaultValues={shiftAssignmentDetailDefaultValues}
      values={values}
      mode="edit"
      submitText={canManageStatus ? "Update Status" : "Close"}
      columns={2}
      onSubmit={onSubmit}
      renderFooter={({ form, isSubmitting, onCancel }) => {
        if (!canManageStatus) {
          return (
            <div className="flex justify-end gap-3">
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
};
