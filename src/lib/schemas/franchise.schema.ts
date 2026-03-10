import { z } from "zod";

const TIME_24H_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Franchise form validation schema
 * Includes cross-field validation for closedAt > openedAt
 */
export const FranchiseSchema = z
  .object({
    code: z
      .string()
      .min(3, "Enter at least 3 characters (e.g., CF-D1-001)")
      .max(20, "Code too long - maximum 20 characters")
      .regex(
        /^[A-Z0-9-]+$/,
        "Use uppercase letters, numbers, and hyphens only. Example: CF-D1-001"
      ),

    name: z
      .string()
      .min(1, "Franchise name is required")
      .max(100, "Name too long - keep it under 100 characters"),

    hotline: z
      .string()
      .regex(/^[0-9]{10,11}$/, "Enter a valid phone number (10-11 digits)")
      .optional()
      .or(z.literal("")),

    logoUrl: z
      .string()
      .url("Enter a valid URL starting with http:// or https://")
      .optional()
      .or(z.literal("")),

    address: z
      .string()
      .min(1, "Please enter the franchise address")
      .max(500, "Address too long - keep it under 500 characters"),

    openedAt: z
      .string()
      .regex(TIME_24H_REGEX, "Enter time in HH:mm format (e.g., 08:00)")
      .optional()
      .or(z.literal("")),

    closedAt: z
      .string()
      .regex(TIME_24H_REGEX, "Enter time in HH:mm format (e.g., 22:00)")
      .optional()
      .or(z.literal("")),

    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.closedAt && data.openedAt) {
        return toMinutes(data.closedAt) > toMinutes(data.openedAt);
      }
      return true;
    },
    {
      message: "Closing time must be later than opening time.",
      path: ["closedAt"],
    }
  );

export type FranchiseFormData = z.infer<typeof FranchiseSchema>;
