import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForgotPassword } from "@/hooks/auth/useAuth.hooks";
import { ROUTER_URL } from "@/router/route.const";
import {
  ForgotPasswordZod,
  type ForgotPasswordZodType,
} from "../forgot-password-zod/forgot-password-zod";

export const ForgotPasswordForm = () => {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordZodType>({
    resolver: zodResolver(ForgotPasswordZod),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordZodType) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-amber-900 dark:text-amber-100 font-medium"
        >
          Email Address
        </Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400"
            size={18}
          />
          <Input
            id="email"
            type="email"
            placeholder="your.email@franchiseplus.com"
            className={`pl-10 border-amber-200 dark:border-amber-800 focus:border-amber-500 dark:focus:border-amber-600 bg-white dark:bg-stone-900 ${
              errors.email ? "border-red-500" : ""
            }`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={14} />
            <span>{errors.email.message}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {forgotPasswordMutation.isPending ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending reset link...
          </span>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          to={ROUTER_URL.ADMIN_ROUTER.LOGIN}
          className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </form>
  );
};
