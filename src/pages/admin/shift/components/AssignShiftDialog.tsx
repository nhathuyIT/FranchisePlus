import { FormDialog, type SubmitResult } from "@/components/form-dialog";
import type { SelectOption } from "@/lib/form/field-config";
import {
  AssignShiftSchema,
  type AssignShiftFormData,
} from "@/lib/schemas/shift-assignment.schema";
import type { Shift } from "@/types/shift";
import { getAssignFields } from "../utils/assignFields";
import { formatTimeLabel } from "../utils/shiftFormatters";

type AssignShiftDialogProps = {
  open: boolean;
  shift: Shift | null;
  employeeOptions: SelectOption[];
  defaultWorkDate: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssignShiftFormData) => Promise<SubmitResult | void>;
  onSuccess: () => void;
};

export function AssignShiftDialog({
  open,
  shift,
  employeeOptions,
  defaultWorkDate,
  onOpenChange,
  onSubmit,
  onSuccess,
}: AssignShiftDialogProps) {
  return (
    <FormDialog<AssignShiftFormData>
      open={open}
      onOpenChange={onOpenChange}
      title={shift ? `Assign ${shift.name}` : "Assign Shift"}
      description={
        shift
          ? `${formatTimeLabel(shift.startTime)} - ${formatTimeLabel(shift.endTime)}. One employee uses the single assignment API; multiple employees use the bulk API.`
          : "Choose a shift to assign."
      }
      size="lg"
      schema={AssignShiftSchema}
      fields={getAssignFields(employeeOptions)}
      defaultValues={{
        userIds: [],
        workDate: defaultWorkDate,
        note: "",
      }}
      mode="create"
      submitText="Assign Shift"
      columns={2}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
}
