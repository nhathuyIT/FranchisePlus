import { useMemo } from "react";
import { FormDialog } from "@/components/form-dialog";
import type { SubmitResult } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import {
  createShiftSchema,
  getCreateShiftFields,
  type CreateShiftFormData,
} from "../create-shift-form.config";
import type { FranchiseSelectItem } from "@/api/franchise/franchise.type";

type CreateShiftDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFranchiseId: string;
  franchiseOptions: FranchiseSelectItem[];
  defaultValues: CreateShiftFormData;
  onSubmit: (data: CreateShiftFormData) => Promise<SubmitResult | void>;
};

export const CreateShiftDialog = ({
  open,
  onOpenChange,
  currentFranchiseId,
  franchiseOptions,
  defaultValues,
  onSubmit,
}: CreateShiftDialogProps) => {
  const fields = useMemo(
    () => getCreateShiftFields(franchiseOptions, currentFranchiseId),
    [currentFranchiseId, franchiseOptions],
  );

  return (
    <FormDialog<CreateShiftFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Shift"
      description="Add a new shift template to the selected franchise."
      size="md"
      schema={createShiftSchema}
      fields={fields}
      defaultValues={defaultValues}
      mode="create"
      submitText="Create Shift"
      columns={2}
      onSubmit={onSubmit}
      renderFooter={({ isSubmitting, onCancel }) => (
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Shift"}
          </Button>
        </div>
      )}
    />
  );
};
