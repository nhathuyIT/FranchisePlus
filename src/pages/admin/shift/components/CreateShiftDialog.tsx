import { FormDialog, type SubmitResult } from "@/components/form-dialog";
import type { SelectOption } from "@/lib/form/field-config";
import { CreateShiftSchema, type CreateShiftFormData } from "@/lib/schemas/shift.schema";
import { getCreateShiftFields } from "../utils/createShiftFields";

type CreateShiftDialogProps = {
  open: boolean;
  activeFranchiseId: string;
  canSelectFranchise: boolean;
  franchiseOptions: SelectOption[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateShiftFormData) => Promise<SubmitResult | void>;
  onSuccess: () => void;
};

export function CreateShiftDialog({
  open,
  activeFranchiseId,
  canSelectFranchise,
  franchiseOptions,
  onOpenChange,
  onSubmit,
  onSuccess,
}: CreateShiftDialogProps) {
  return (
    <FormDialog<CreateShiftFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Shift"
      description="Create a shift template for the active franchise."
      size="md"
      schema={CreateShiftSchema}
      fields={getCreateShiftFields(franchiseOptions, canSelectFranchise)}
      defaultValues={{
        franchise_id: activeFranchiseId,
        name: "",
        start_time: "",
        end_time: "",
      }}
      mode="create"
      submitText="Create Shift"
      columns={2}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
