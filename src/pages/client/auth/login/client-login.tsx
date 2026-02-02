import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Coffee, Lock, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";
import {
  UserDataMock,
  RoleDataMock,
  UserFranchiseRoleDataMock,
} from "@/const/user.const";
import {
  ClientLoginZod,
  type ClientLoginZodType,
} from "./client-zod/client-login-zod";

const ClientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientLoginZodType>({
    resolver: zodResolver(ClientLoginZod),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: ClientLoginZodType) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // TODO: This should use Customer entity, not User entity
      // For now, using User mock data for demonstration
      const user = UserDataMock.find(
        (u) => u.email === data.email && u.password_hash === data.password,
      );

      if (!user) {
        toast.error("Invalid credentials", {
          description: "Email or password is incorrect",
        });
        return;
      }

      // Get user's roles and franchise assignments
      const userFranchiseRoles = UserFranchiseRoleDataMock.filter(
        (ufr) => ufr.user_id === user.id,
      );
      const roles = RoleDataMock.filter((role) =>
        userFranchiseRoles.some((ufr) => ufr.role_id === role.id),
      );

      // Build AuthUser object
      const authUser = {
        user,
        roles,
        franchiseRoles: userFranchiseRoles,
        currentFranchiseId: userFranchiseRoles[0]?.franchise_id || null,
      };

      login(authUser);

      navigate("/");
    } catch (error) {
      toast.error(
        "Login failed",
        error instanceof Error ? { description: error.message } : undefined,
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-stone-900 dark:via-orange-950 dark:to-stone-900 p-4">
      <div className="absolute inset-0 opacity-5">
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
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-full p-6 shadow-2xl">
            <Coffee size={48} className="text-orange-50" strokeWidth={2.5} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-8 pt-16 border border-orange-200 dark:border-orange-900">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-900 dark:text-orange-50 mb-2">
              Customer Portal
            </h1>
            <p className="text-orange-700 dark:text-orange-300 text-sm">
              Welcome back! Please login to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-orange-900 dark:text-orange-100 font-medium"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 dark:text-orange-400"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className={`pl-10 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-600 bg-white dark:bg-stone-900 ${
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-orange-900 dark:text-orange-100 font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 dark:text-orange-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`pl-10 border-orange-200 dark:border-orange-800 focus:border-orange-500 dark:focus:border-orange-600 bg-white dark:bg-stone-900 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={14} />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Need help? Contact Customer Support
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center justify-center gap-2">
            <Coffee size={16} />
            <span>FranchisePlus Coffee - Your Coffee, Your Way</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
