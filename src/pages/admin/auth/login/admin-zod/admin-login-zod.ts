import { z } from "zod";
export const AdminLoginZod = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type AdminLoginZodType = z.infer<typeof AdminLoginZod>;
