import { z } from "zod";

export const SHIFT_ASSIGNMENT_STATUS_VALUES = [
  "ASSIGNED",
  "COMPLETED",
  "ABSENT",
  "CANCELED",
] as const;

export const ShiftAssignmentStatusSchema = z.enum(
  SHIFT_ASSIGNMENT_STATUS_VALUES,
);

export const AssignShiftSchema = z.object({
  userIds: z.array(z.string()).min(1, "Select at least one employee"),
  workDate: z.string().min(1, "Work date is required"),
  note: z
    .string()
    .max(300, "Note must be 300 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export const ShiftStatusUpdateSchema = z.object({
  shiftName: z.string(),
  employeeName: z.string(),
  assignedBy: z.string(),
  workDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: ShiftAssignmentStatusSchema,
});

export type AssignShiftFormData = z.infer<typeof AssignShiftSchema>;
export type ShiftStatusUpdateFormData = z.infer<typeof ShiftStatusUpdateSchema>;
