import { z } from "zod";

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
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Select a valid opening date or leave empty",
      })
      .optional()
      .or(z.literal("")),

    closedAt: z
      .string()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Select a valid closing date or leave empty",
      })
      .optional()
      .or(z.literal("")),

    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      // Advanced validation: closedAt must be after openedAt
      if (data.closedAt && data.openedAt) {
        return new Date(data.closedAt) > new Date(data.openedAt);
      }
      return true;
    },
    {
      message: "Closing date must be later than the opening date. Check both dates.",
      path: ["closedAt"],
    }
  );

export type FranchiseFormData = z.infer<typeof FranchiseSchema>;
