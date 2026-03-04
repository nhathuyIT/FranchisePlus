import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Coffee,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientChangePassword } from "@/hooks/client/useClient.hooks";
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

const ErrorMsg = ({ message }: { message?: string }) =>
  message ? (
    <div className="flex items-center gap-1.5 text-red-500 text-xs pl-1 mt-1">
      <AlertCircle size={12} />
      <span>{message}</span>
    </div>
  ) : null;

function ClientChangePassword() {
  const changePasswordMutation = useClientChangePassword();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  const withFocus = (field: string, reg: ReturnType<typeof register>) => ({
    ...reg,
    onFocus: () => setFocusedField(field),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      setFocusedField(null);
      reg.onBlur(e);
    },
  });

  const iconBox = (field: string) =>
    `absolute left-4 top-1/2 -translate-y-1/2 rounded-xl p-2 transition-colors duration-200 ${
      focusedField === field
        ? "bg-orange-700 text-white"
        : "bg-stone-100 dark:bg-stone-800 text-stone-400"
    }`;

  const ringWrap = (field: string) =>
    `relative group rounded-2xl transition-all duration-300 ${
      focusedField === field ? "ring-2 ring-orange-600/30" : ""
    }`;

  const inputBase =
    "pl-14 h-[46px] pr-10 rounded-2xl border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder:text-stone-300 focus:border-orange-700 transition-all duration-200 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-stone-900 dark:via-orange-950 dark:to-stone-900 p-4">
      {/* Background coffee decorations */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-orange-900 dark:text-orange-100">
          <Coffee size={120} />
        </div>
        <div className="absolute bottom-20 right-20 text-orange-900 dark:text-orange-100">
          <Coffee size={150} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-orange-900 dark:text-orange-100">
          <Coffee size={80} />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Floating icon */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-linear-to-br from-orange-600 to-orange-800 rounded-full p-6 shadow-2xl">
            <ShieldCheck size={48} className="text-orange-50" strokeWidth={2} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-8 pt-16 border border-orange-200 dark:border-orange-900"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-900 dark:text-orange-50 mb-2">
              Change Password
            </h1>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Enter your current password and choose a strong new one
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Current Password */}
            <div>
              <Label
                htmlFor="oldPassword"
                className="text-stone-700 dark:text-stone-200 font-medium text-sm mb-1.5 block"
              >
                Current Password
              </Label>
              <div className={ringWrap("oldPassword")}>
                <div className={iconBox("oldPassword")}>
                  <KeyRound size={14} />
                </div>
                <Input
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  placeholder="Enter current password"
                  className={`${inputBase} ${
                    errors.oldPassword ? "border-red-400" : ""
                  }`}
                  {...withFocus("oldPassword", register("oldPassword"))}
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-700 transition-colors"
                  tabIndex={-1}
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <ErrorMsg message={errors.oldPassword?.message} />
            </div>

            {/* New Password */}
            <div>
              <Label
                htmlFor="newPassword"
                className="text-stone-700 dark:text-stone-200 font-medium text-sm mb-1.5 block"
              >
                New Password
              </Label>
              <div className={ringWrap("newPassword")}>
                <div className={iconBox("newPassword")}>
                  <KeyRound size={14} />
                </div>
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className={`${inputBase} ${
                    errors.newPassword ? "border-red-400" : ""
                  }`}
                  {...withFocus("newPassword", register("newPassword"))}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-700 transition-colors"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <ErrorMsg message={errors.newPassword?.message} />
            </div>

            {/* Confirm Password */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-stone-700 dark:text-stone-200 font-medium text-sm mb-1.5 block"
              >
                Confirm New Password
              </Label>
              <div className={ringWrap("confirmPassword")}>
                <div className={iconBox("confirmPassword")}>
                  <KeyRound size={14} />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your new password"
                  className={`${inputBase} ${
                    errors.confirmPassword ? "border-red-400" : ""
                  }`}
                  {...withFocus("confirmPassword", register("confirmPassword"))}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-700 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <ErrorMsg message={errors.confirmPassword?.message} />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full h-12 mt-2 bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
            >
              {changePasswordMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating password...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} />
                  Update Password
                </span>
              )}
            </Button>

            {/* Back link */}
            <div className="text-center">
              <Link
                to={ROUTER_URL.HOME}
                className="inline-flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors"
              >
                <ArrowLeft size={15} />
                Back to Homepage
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Need help? Contact Customer Support
            </p>
          </div>
        </motion.div>

        {/* Bottom branding */}
        <div className="mt-8 text-center">
          <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center justify-center gap-2">
            <Coffee size={16} />
            <span>FranchisePlus Coffee - Your Coffee, Your Way</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientChangePassword;
