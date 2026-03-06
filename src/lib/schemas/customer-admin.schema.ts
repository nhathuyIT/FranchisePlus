import { z } from "zod";

/**
 * Customer admin form validation schema
 * Used for editing customer details (admin does not create customers)
 */
export const CustomerAdminSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Name too long - keep it under 100 characters"),

  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Enter a valid phone number (10-11 digits)")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(500, "Address too long - keep it under 500 characters")
    .optional()
    .or(z.literal("")),

  avatarUrl: z
    .string()
    .url("Enter a valid URL starting with http:// or https://")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
});

export type CustomerAdminFormData = z.infer<typeof CustomerAdminSchema>;
