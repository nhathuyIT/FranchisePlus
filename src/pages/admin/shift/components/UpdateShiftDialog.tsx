import { FormDialog, type SubmitResult } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import {
  UpdateShiftSchema,
  type UpdateShiftFormData,
} from "@/lib/schemas/shift.schema";
import type { Shift } from "@/types/shift";

const UPDATE_SHIFT_FIELDS: FieldConfig<UpdateShiftFormData>[] = [
  {
    name: "name",
    type: "text",
    label: "Shift Name",
    placeholder: "Opening Shift",
    required: true,
    colSpan: 2,
  },
  {
    name: "start_time",
    type: "time",
    label: "Start Time",
    required: true,
  },
  {
    name: "end_time",
    type: "time",
    label: "End Time",
    required: true,
  },
];

type UpdateShiftDialogProps = {
  open: boolean;
  shift: Shift | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateShiftFormData) => Promise<SubmitResult | void>;
  onSuccess: () => void;
};

export function UpdateShiftDialog({
  open,
  shift,
  onOpenChange,
  onSubmit,
  onSuccess,
}: UpdateShiftDialogProps) {
  return (
    <FormDialog<UpdateShiftFormData>
      key={shift?.id}
      open={open}
      onOpenChange={onOpenChange}
      title="Update Shift"
      description={`Edit details for the "${shift?.name ?? ""}" shift.`}
      size="md"
      schema={UpdateShiftSchema}
      fields={UPDATE_SHIFT_FIELDS}
      defaultValues={{
        name: shift?.name ?? "",
        start_time: shift?.startTime ?? "",
        end_time: shift?.endTime ?? "",
      }}
      mode="edit"
      submitText="Save Changes"
      columns={2}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
