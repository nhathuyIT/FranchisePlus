import { z } from "zod";

/**
 * User form validation schema
 */
export const UserSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
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
    .regex(/^[0-9]{10,11}$/, "Enter a valid phone number (10-11 digits)")
    .optional()
    .or(z.literal("")),

  avatarUrl: z
    .string()
    .url("Enter a valid URL starting with http:// or https://")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
});

export type UserFormData = z.infer<typeof UserSchema>;
