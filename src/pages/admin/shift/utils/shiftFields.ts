import type { FieldConfig, SelectOption } from "@/lib/form/field-config";
import {
  SHIFT_ASSIGNMENT_STATUS_VALUES,
  type ShiftStatusUpdateFormData,
} from "@/lib/schemas/shift-assignment.schema";

const STATUS_OPTIONS: SelectOption[] = SHIFT_ASSIGNMENT_STATUS_VALUES.map(
  (status) => ({
    label: `${status.charAt(0)}${status.slice(1).toLowerCase()}`,
    value: status,
  }),
);

export function getShiftFields(
  canUpdateStatus: boolean,
): FieldConfig<ShiftStatusUpdateFormData>[] {
  return [
    {
      name: "shiftName",
      type: "text",
      label: "Shift Name",
      disabled: true,
      colSpan: 2,
    },
    {
      name: "employeeName",
      type: "text",
      label: "Employee Name",
      disabled: true,
      colSpan: 2,
    },
    {
      name: "assignedBy",
      type: "text",
      label: "Assigned By",
      disabled: true,
      colSpan: 2,
    },
    {
      name: "workDate",
      type: "date",
      label: "Work Date",
      disabled: true,
    },
    {
      name: "startTime",
      type: "time",
      label: "Start Time",
      disabled: true,
    },
    {
      name: "endTime",
      type: "time",
      label: "End Time",
      disabled: true,
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      options: STATUS_OPTIONS,
      disabled: !canUpdateStatus,
    },
  ];
}
