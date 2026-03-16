import { z } from "zod";
import type { FieldConfig } from "@/lib/form/field-config";

export const shiftAssignmentStatusOptions = [
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Absent", value: "ABSENT" },
  { label: "Canceled", value: "CANCELED" },
] as const;

export const shiftAssignmentDetailSchema = z.object({
  taskName: z.string(),
  employeeName: z.string(),
  employeeEmail: z.string(),
  employeePhone: z.string(),
  workDate: z.string(),
  shiftTime: z.string(),
  note: z.string(),
  assignedBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(["ASSIGNED", "COMPLETED", "ABSENT", "CANCELED"]),
});

export type ShiftAssignmentDetailFormData = z.infer<
  typeof shiftAssignmentDetailSchema
>;

export const shiftAssignmentDetailDefaultValues: ShiftAssignmentDetailFormData =
  {
    taskName: "Unknown shift",
    employeeName: "Loading employee...",
    employeeEmail: "No email available",
    employeePhone: "No phone number available",
    workDate: "--",
    shiftTime: "--:-- - --:--",
    note: "No notes for this assignment.",
    assignedBy: "Unknown",
    createdAt: "--",
    updatedAt: "--",
    status: "ASSIGNED",
  };

export const shiftAssignmentDetailFields: FieldConfig<ShiftAssignmentDetailFormData>[] =
  [
    {
      name: "taskName",
      type: "text",
      label: "Task",
      disabled: true,
      colSpan: 2,
    },
    {
      name: "employeeName",
      type: "text",
      label: "Employee",
      disabled: true,
    },
    {
      name: "employeeEmail",
      type: "text",
      label: "Email",
      disabled: true,
    },
    {
      name: "employeePhone",
      type: "text",
      label: "Phone",
      disabled: true,
    },
    {
      name: "workDate",
      type: "text",
      label: "Work Date",
      disabled: true,
    },
    {
      name: "shiftTime",
      type: "text",
      label: "Shift Time",
      disabled: true,
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      options: [...shiftAssignmentStatusOptions],
    },
    {
      name: "assignedBy",
      type: "text",
      label: "Assigned By",
      disabled: true,
    },
    {
      name: "createdAt",
      type: "text",
      label: "Created",
      disabled: true,
    },
    {
      name: "updatedAt",
      type: "text",
      label: "Updated",
      disabled: true,
    },
    {
      name: "note",
      type: "textarea",
      label: "Notes",
      disabled: true,
      rows: 4,
      colSpan: 2,
    },
  ];
