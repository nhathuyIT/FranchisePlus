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
} from "@/types/auth.type";

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

      if (data.franchiseRoles && data.franchiseRoles.length > 1) {
        navigate(
          ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.ROLE_SELECTOR,
          {
            state: {
              user: data.user,
              roles: data.roles,
              franchiseRoles: data.franchiseRoles,
            },
          },
        );
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
        description: `Logged in as ${data.roles[0]?.name}`,
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
 */
export const useSwitchContext = () => {
  const queryClient = useQueryClient();
  const { switchRole } = useAuthStore();

  return useMutation({
    mutationFn: (data: SwitchContextRequest) => authApi.switchContext(data),
    onSuccess: (_data, variables) => {
      switchRole({
        id: `${variables.roleId}-${variables.franchiseId || "global"}`,
        roleId: variables.roleId,
        roleName: "", // Will be updated from store
        roleCode: "",
        franchiseId: variables.franchiseId,
        franchiseName: null,
        isGlobal: !variables.franchiseId,
      });

      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });

      toast.success("Role switched successfully");
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
      clearAuth();
      queryClient.clear();
      toast.success("Logged out successfully");
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
