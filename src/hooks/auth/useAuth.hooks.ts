import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as authApi from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTER_URL } from "@/router/route.const";
import type {
  LoginRequest,
  SwitchContextRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  VerifyTokenRequest,
  ResendTokenRequest,
  RegisterRequest,
} from "@/types/auth.type";
import type { Role, UserFranchiseRole } from "@/types/user.type";

// API role format from backend (after axios camelCase interceptor)
interface ApiRoleResponse {
  role: string;
  scope: string;
  franchiseId: string | null;
  franchiseName: string | null;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      await authApi.login(data);

      const profile = await authApi.getProfile();
      return profile;
    },
    onSuccess: (data) => {
      if (!data) {
        toast.error("Login failed", {
          description: "Invalid response from server",
        });
        return;
      }

      // Check if API returns roles in the format: {role, scope, franchiseId, franchiseName}
      // (after axios interceptor converts snake_case → camelCase)
      const apiRoles = data.roles as unknown as ApiRoleResponse[];
      const transformedFranchiseRoles: UserFranchiseRole[] = [];
      const transformedRoles: Role[] = [];

      if (apiRoles && apiRoles.length > 0 && "role" in apiRoles[0]) {
        // Transform the roles to match expected format
        apiRoles.forEach((r, index) => {
          const roleId = index + 1; // Generate temporary IDs
          transformedRoles.push({
            id: roleId,
            code: r.role,
            name: r.role,
            description: null,
            scope: r.scope as "GLOBAL" | "FRANCHISE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
          });
          transformedFranchiseRoles.push({
            id: index + 1,
            franchiseId: r.franchiseId || null,
            franchiseName: r.franchiseName || null,
            roleId: roleId,
            userId: data.user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
          });
        });
      }

      const franchiseRoles =
        transformedFranchiseRoles.length > 0
          ? transformedFranchiseRoles
          : data.franchiseRoles || [];

      const roles = transformedRoles.length > 0 ? transformedRoles : data.roles;

      if (franchiseRoles && franchiseRoles.length > 1) {
        navigate(
          ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.ROLE_SELECTOR,
          {
            state: {
              user: data.user,
              roles: roles,
              franchiseRoles: franchiseRoles,
            },
          },
        );
        return;
      }

      const authUser = {
        user: data.user,
        roles: roles,
        franchiseRoles: franchiseRoles,
        currentRoleId: franchiseRoles?.[0]?.roleId || roles[0]?.id || null,
        currentFranchiseId: franchiseRoles?.[0]?.franchiseId || null,
      };

      setAuth(authUser);
      toast.success("Welcome back!", {
        description: `Logged in as ${roles[0]?.name || roles[0]?.code}`,
      });

      navigate(ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.DASHBOARD);
    },
    onError: (error) => {
      console.error("[useLogin] Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Invalid credentials or server error",
      });
    },
  });
};

export const useClientLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      await authApi.login(data);

      const profile = await authApi.getProfile();
      return profile;
    },
    onSuccess: (data) => {
      if (!data) {
        toast.error("Login failed", {
          description: "Invalid response from server",
        });
        return;
      }
      const authUser = {
        user: data.user,
        roles: data.roles,
        franchiseRoles: data.franchiseRoles || [],
        currentRoleId:
          data.franchiseRoles?.[0]?.roleId || data.roles[0]?.id || null,
        currentFranchiseId: data.franchiseRoles?.[0]?.franchiseId || null,
      };

      setAuth(authUser);
      toast.success("Welcome back!", {
        description: `Logged in successfully`,
      });

      navigate("/");
    },
    onError: (error) => {
      console.error("[useClientLogin] Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Invalid credentials or server error",
      });
    },
  });
};

/**
 * AUTH-02: Switch Context Mutation
 * Flow: switchContext API → getProfile API → update store (preserve all roles/franchiseRoles for future switching)
 */
export const useSwitchContext = () => {
  const { authUser, login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: SwitchContextRequest) => {
      await authApi.switchContext(data);
      // After switching, call getProfile to get fresh context (currentRoleId, currentFranchiseId, etc.)
      const freshProfile = await authApi.getProfile();
      return freshProfile;
    },
    onSuccess: (freshProfile) => {
      if (!freshProfile || !authUser) return;

      // Update context from fresh profile, but PRESERVE all roles & franchiseRoles so user can switch again
      const updatedAuthUser = {
        ...authUser,
        user: freshProfile.user,
        currentRoleId: freshProfile.currentRoleId ?? authUser.currentRoleId,
        currentFranchiseId: freshProfile.currentFranchiseId
          ? String(freshProfile.currentFranchiseId)
          : null,
      };

      login(updatedAuthUser);
      toast.success("Role switched successfully");
    },
    onError: (error) => {
      console.error("[useSwitchContext] Switch context error:", error);
      toast.error("Failed to switch role", {
        description: error.message || "Please try again",
      });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: () => {
      toast.success("Session refreshed");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success("Password reset email sent", {
        description: "Please check your email for instructions",
      });
    },
  });
};

export const useChangePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully", {
        description: "You can now login with your new password",
      });
      navigate(ROUTER_URL.ADMIN_ROUTER.LOGIN);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout: clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth(false);
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate(ROUTER_URL.ADMIN_ROUTER.LOGIN);
    },
    onError: () => {
      clearAuth(false);
      queryClient.clear();
      navigate(ROUTER_URL.ADMIN_ROUTER.LOGIN);
    },
  });
};

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: (data: VerifyTokenRequest) => authApi.verifyToken(data),
  });
};

export const useResendToken = () => {
  return useMutation({
    mutationFn: (data: ResendTokenRequest) => authApi.resendToken(data),
    onSuccess: () => {
      toast.success("Verification email sent", {
        description: "Please check your email",
      });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => {
      console.log("[useRegister] Sending data:", data);
      return authApi.register(data);
    },
    onSuccess: () => {
      toast.success("Registration successful!", {
        description: "Please login with your credentials",
      });
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      console.error("[useRegister] Registration error:", error);
      console.error("[useRegister] Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Please check your information and try again";
      toast.error("Registration failed", {
        description: errorMessage,
      });
    },
  });
};
