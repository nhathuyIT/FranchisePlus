import { z } from "zod";

export const CreateShiftSchema = z
  .object({
    franchise_id: z.string().min(1, "Franchise is required"),
    name: z
      .string()
      .trim()
      .min(1, "Shift name is required")
      .max(100, "Shift name must be 100 characters or fewer"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
  })
  .superRefine((values, context) => {
    if (
      values.start_time &&
      values.end_time &&
      values.end_time <= values.start_time
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_time"],
        message: "End time must be later than start time",
      });
    }
  });

export type CreateShiftFormData = z.infer<typeof CreateShiftSchema>;

export const UpdateShiftSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Shift name is required")
      .max(100, "Shift name must be 100 characters or fewer"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
  })
  .superRefine((values, context) => {
    if (
      values.start_time &&
      values.end_time &&
      values.end_time <= values.start_time
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_time"],
        message: "End time must be later than start time",
      });
    }
  });

export type UpdateShiftFormData = z.infer<typeof UpdateShiftSchema>;
