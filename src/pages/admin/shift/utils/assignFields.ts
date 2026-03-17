import type { FieldConfig, SelectOption } from "@/lib/form/field-config";
import type { AssignShiftFormData } from "@/lib/schemas/shift-assignment.schema";

export function getAssignFields(
  employeeOptions: SelectOption[],
): FieldConfig<AssignShiftFormData>[] {
  return [
    {
      name: "userIds",
      type: "multiselect",
      label: "Employees",
      description: "Choose one or more employees for this shift.",
      required: true,
      options: employeeOptions,
      colSpan: 2,
    },
    {
      name: "workDate",
      type: "date",
      label: "Work Date",
      required: true,
    },
    {
      name: "note",
      type: "textarea",
      label: "Note",
      placeholder: "Optional assignment note",
      rows: 4,
      colSpan: 2,
    },
  ];
}
