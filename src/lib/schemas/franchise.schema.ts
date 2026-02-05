import { z } from "zod";

/**
 * Franchise form validation schema
 * Includes cross-field validation for closed_at > opened_at
 */
export const FranchiseSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code cannot exceed 20 characters")
      .regex(
        /^[A-Z0-9-]+$/,
        "Code must contain only uppercase letters, numbers, and hyphens"
      ),

    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters"),

    logo_url: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),

    address: z
      .string()
      .min(1, "Address is required")
      .max(500, "Address cannot exceed 500 characters"),

    opened_at: z
      .string()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .optional()
      .or(z.literal("")),

    closed_at: z
      .string()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .optional()
      .or(z.literal("")),

    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      // Advanced validation: closed_at must be after opened_at
      if (data.closed_at && data.opened_at) {
        return new Date(data.closed_at) > new Date(data.opened_at);
      }
      return true;
    },
    {
      message: "Closed date must be after opened date",
      path: ["closed_at"],
    }
  );

export type FranchiseFormData = z.infer<typeof FranchiseSchema>;
