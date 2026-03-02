import { z } from "zod";

export const ClientRegisterZod = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ClientRegisterZodType = z.infer<typeof ClientRegisterZod>;
