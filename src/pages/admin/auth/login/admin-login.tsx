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
import { ROUTER_URL } from "@/router/route.const";
import {
  AdminLoginZod,
  type AdminLoginZodType,
} from "./admin-zod/admin-login-zod";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginZodType>({
    resolver: zodResolver(AdminLoginZod),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginZodType) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
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

      // Check if user has staff role (ADMIN, MANAGER, or STAFF)
      const hasStaffRole = roles.some((role) =>
        ["ADMIN", "MANAGER", "STAFF"].includes(role.code),
      );

      if (!hasStaffRole) {
        toast.error("Access Denied", {
          description: "This portal is for staff only",
        });
        return;
      }

      // Build AuthUser object
      const authUser = {
        user,
        roles,
        franchiseRoles: userFranchiseRoles,
        currentFranchiseId: userFranchiseRoles[0]?.franchise_id || null,
      };

      login(authUser);
      toast.success("Welcome back!", {
        description: `Logged in as ${user.name}`,
      });

      navigate(ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.DASHBOARD);
    } catch (error) {
      toast.error(
        "Login failed",
        error instanceof Error ? { description: error.message } : undefined,
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-stone-900 dark:via-amber-950 dark:to-stone-900 p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-amber-900 dark:text-amber-100">
          <Coffee size={120} />
        </div>
        <div className="absolute bottom-20 right-20 text-amber-900 dark:text-amber-100">
          <Coffee size={150} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-amber-900 dark:text-amber-100">
          <Coffee size={80} />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-full p-6 shadow-2xl">
            <Coffee size={48} className="text-amber-50" strokeWidth={2.5} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-8 pt-16 border border-amber-200 dark:border-amber-900">
          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-amber-900 dark:text-amber-100 font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`pl-10 border-amber-200 dark:border-amber-800 focus:border-amber-500 dark:focus:border-amber-600 bg-white dark:bg-stone-900 ${
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
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
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
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Need help? Contact IT Support
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
            <Coffee size={16} />
            <span>FranchisePlus Coffee Management System</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
