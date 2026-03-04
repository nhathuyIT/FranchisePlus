import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as authApi from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTER_URL } from "@/router/route.const";
import type {
  LoginRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  VerifyTokenRequest,
  ResendTokenRequest,
  RegisterRequest,
  ApiRoleItem,
  ActiveContext,
  SwitchContextRequest,
} from "@/types/auth.type";
import type { Role, UserFranchiseRole } from "@/types/user.type";

/**
 * Parse the backend roles array ({role, scope, franchiseId, franchiseName})
 * into normalised Role[] and UserFranchiseRole[] used internally.
 */
const parseProfileRoles = (
  apiRoles: ApiRoleItem[],
  userId: string,
): { roles: Role[]; franchiseRoles: UserFranchiseRole[] } => {
  const roles: Role[] = [];
  const franchiseRoles: UserFranchiseRole[] = [];

  apiRoles.forEach((r, index) => {
    const roleId = index + 1;
    roles.push({
      id: roleId,
      code: r.role,
      name: r.role,
      description: null,
      scope: r.scope as "GLOBAL" | "FRANCHISE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    });
    franchiseRoles.push({
      id: roleId,
      franchiseId: r.franchiseId || null,
      franchiseName: r.franchiseName || null,
      roleId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    });
  });

  return { roles, franchiseRoles };
};

/**
 * Resolve currentRoleId + currentFranchiseId from activeContext.
 * Matches by role code + franchiseId against the parsed franchiseRoles.
 */
const resolveContext = (
  activeContext: ActiveContext | null | undefined,
  roles: Role[],
  franchiseRoles: UserFranchiseRole[],
): { currentRoleId: number | null; currentFranchiseId: string | null } => {
  if (!activeContext) {
    return {
      currentRoleId: franchiseRoles[0]?.roleId ?? roles[0]?.id ?? null,
      currentFranchiseId: franchiseRoles[0]?.franchiseId ?? null,
    };
  }

  // Find the role whose code matches activeContext.role
  const matchedRole = roles.find((r) => r.code === activeContext.role);
  // Find the franchiseRole whose franchiseId matches
  const matchedFR = franchiseRoles.find(
    (fr) =>
      fr.roleId === matchedRole?.id &&
      (fr.franchiseId === activeContext.franchiseId ||
        (!fr.franchiseId && !activeContext.franchiseId)),
  );

  return {
    currentRoleId: matchedFR?.roleId ?? matchedRole?.id ?? null,
    currentFranchiseId:
      matchedFR?.franchiseId ?? activeContext.franchiseId ?? null,
  };
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      await authApi.login(data);

      const profile = await authApi.getProfile();
      return profile;
    },
    onSuccess: async (data) => {
      if (!data) {
        toast.error("Login failed", {
          description: "Invalid response from server",
        });
        return;
      }

      const { roles, franchiseRoles } = parseProfileRoles(
        data.roles as unknown as ApiRoleItem[],
        data.user.id,
      );

      // If user has more than one role/franchise, show the role selector
      if (franchiseRoles.length > 1) {
        navigate(
          ROUTER_URL.ADMIN + "/" + ROUTER_URL.ADMIN_ROUTER.ROLE_SELECTOR,
          {
            state: {
              user: data.user,
              roles,
              franchiseRoles,
            },
          },
        );
        return;
      }

      // Single role — still need to call switchContext to set backend context
      const singleFR = franchiseRoles[0];
      const singleRole = roles[0];

      if (singleFR && singleRole) {
        try {
          // Call switchContext to ensure backend knows the active role/franchise
          await authApi.switchContext({
            franchiseId: singleFR.franchiseId ?? null,
            role_id: singleFR.roleId,
          });
        } catch (err) {
          console.warn("[useLogin] switchContext failed for single role:", err);
          // Continue anyway - activeContext from profile might still work
        }
      }

      const { currentRoleId, currentFranchiseId } = resolveContext(
        data.activeContext,
        roles,
        franchiseRoles,
      );

      const authUser = {
        user: data.user,
        roles,
        franchiseRoles,
        currentRoleId,
        currentFranchiseId,
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

      const { roles, franchiseRoles } = parseProfileRoles(
        data.roles as unknown as ApiRoleItem[],
        data.user.id,
      );
      const { currentRoleId, currentFranchiseId } = resolveContext(
        data.activeContext,
        roles,
        franchiseRoles,
      );

      const authUser = {
        user: data.user,
        roles,
        franchiseRoles,
        currentRoleId,
        currentFranchiseId,
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
 * Flow: switchContext API → getProfile (get confirmed activeContext) → update store
 * Preserves all roles & franchiseRoles so user can switch again later.
 */
export const useSwitchContext = () => {
  const { authUser, login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: SwitchContextRequest) => {
      await authApi.switchContext(data);
      // getProfile returns the confirmed activeContext after the switch
      const freshProfile = await authApi.getProfile();
      return freshProfile;
    },
    onSuccess: (freshProfile) => {
      if (!freshProfile || !authUser) return;

      const { roles, franchiseRoles } = parseProfileRoles(
        freshProfile.roles as unknown as ApiRoleItem[],
        authUser.user.id,
      );

      const { currentRoleId, currentFranchiseId } = resolveContext(
        freshProfile.activeContext,
        roles,
        franchiseRoles,
      );

      const updatedAuthUser = {
        ...authUser,
        user: freshProfile.user,
        // PRESERVE original roles/franchiseRoles so user can switch again
        roles: authUser.roles,
        franchiseRoles: authUser.franchiseRoles,
        currentRoleId,
        currentFranchiseId,
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