import { z } from "zod";

/**
 * Customer form validation schema
 */
export const CustomerSchema = z.object({
  name: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Name too long - keep it under 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .max(15, "Phone number too long - maximum 15 digits")
    .regex(
      /^[0-9+\-\s()]*$/,
      "Phone number can only contain digits, spaces, +, -, and parentheses",
    )
    .optional()
    .or(z.literal("")),

  avatarUrl: z
    .string()
    .url("Enter a valid URL starting with http:// or https://")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;
