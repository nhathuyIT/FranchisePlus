import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/auth/useAuth.hooks";
import { ROUTER_URL } from "@/router/route.const";

const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormType = z.infer<typeof ChangePasswordSchema>;

function AdminChangePassword() {
  const changePasswordMutation = useChangePassword();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="h-full flex items-center justify-center py-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-amber-600 to-amber-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <KeyRound size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Change Password</h1>
            <p className="text-amber-100 mt-1 text-sm">
              Enter your current password and choose a new one
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Current Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="oldPassword"
                  className="text-amber-900 dark:text-amber-100 font-medium"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400"
                    size={18}
                  />
                  <Input
                    id="oldPassword"
                    type={showOld ? "text" : "password"}
                    placeholder="Enter current password"
                    className={`pl-10 pr-10 border-amber-200 dark:border-amber-800 focus:border-amber-500 bg-white dark:bg-stone-800 ${
                      errors.oldPassword ? "border-red-500" : ""
                    }`}
                    {...register("oldPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
                    tabIndex={-1}
                  >
                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.oldPassword && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.oldPassword.message}</span>
                  </div>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-amber-900 dark:text-amber-100 font-medium"
                >
                  New Password
                </Label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400"
                    size={18}
                  />
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`pl-10 pr-10 border-amber-200 dark:border-amber-800 focus:border-amber-500 bg-white dark:bg-stone-800 ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.newPassword.message}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-amber-900 dark:text-amber-100 font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400"
                    size={18}
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className={`pl-10 pr-10 border-amber-200 dark:border-amber-800 focus:border-amber-500 bg-white dark:bg-stone-800 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.confirmPassword.message}</span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {changePasswordMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating password...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>

              {/* Back */}
              <div className="text-center">
                <Link
                  to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.DASHBOARD}`}
                  className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChangePassword;
