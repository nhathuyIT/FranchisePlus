import type { FieldConfig, SelectOption } from "@/lib/form/field-config";
import type { CreateShiftFormData } from "@/lib/schemas/shift.schema";

export function getCreateShiftFields(
  franchiseOptions: SelectOption[],
  showFranchiseField: boolean,
): FieldConfig<CreateShiftFormData>[] {
  return [
    {
      name: "franchise_id",
      type: "select",
      label: "Franchise",
      placeholder: "Select franchise",
      required: true,
      hidden: !showFranchiseField,
      options: franchiseOptions,
      colSpan: 2,
    },
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
}
