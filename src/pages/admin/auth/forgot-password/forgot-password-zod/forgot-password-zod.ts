import { z } from "zod";

export const ForgotPasswordZod = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type ForgotPasswordZodType = z.infer<typeof ForgotPasswordZod>;
