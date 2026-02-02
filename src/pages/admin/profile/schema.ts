import { z } from "zod";

// 1. Profile Schema
export const profileSchema = z.object({
  name: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().optional(),
});

// 2. Change Password Schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Mật khẩu cũ không đúng"),
  newPassword: z.string().min(6, "Mật khẩu mới phải từ 6 ký tự"),
  confirmPassword: z.string().min(6, "Vui lòng xác nhận lại mật khẩu"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// 3. Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
});

// 4. Reset Password Schema
export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  confirmPassword: z.string().min(6, "Vui lòng xác nhận lại mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không trùng khớp",
  path: ["confirmPassword"],
});

// Export Types
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;