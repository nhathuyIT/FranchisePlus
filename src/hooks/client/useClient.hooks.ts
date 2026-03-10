import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as customerApi from "@/api/customer/customer.api";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTER_URL } from "@/router/route.const";
import type {
  RegisterRequest,
  ResendTokenRequest,
  VerifyTokenRequest,
  LoginRequest,
  ChangePasswordRequest,
} from "@/types/auth.type";
import type { ProfileRequest } from "@/types/customer";

/**
 * Hook to logout customer
 */
export const useLogoutCustomer = () => {
  const navigate = useNavigate();
  const { logout: clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => customerApi.logoutClient(),
    onSuccess: () => {
      clearAuth(false);
      toast.success("Logged out successfully");
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
    },
    onError: () => {
      // Still logout locally even if API fails
      clearAuth(false);
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
    },
  });
};

/**
 * Hook to register a new customer
 */
export const useRegisterCustomer = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => customerApi.register(data),
    onSuccess: () => {
      toast.success(
        "Registration successful! Please check your email to verify your account.",
        {
          duration: 5000,
        },
      );
      // Optionally navigate to a success page or login
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: error.message || "Please try again.",
      });
    },
  });
};

/**
 * Hook to resend customer verification email
 */
export const useResendClientToken = () => {
  return useMutation({
    mutationFn: (data: ResendTokenRequest) =>
      customerApi.resendClientToken(data),
    onSuccess: () => {
      toast.success("Email xác thực đã được gửi lại!", {
        description: "Vui lòng kiểm tra hộp thư của bạn.",
      });
    },
    onError: (error) => {
      toast.error("Gửi lại thất bại", {
        description: error.message || "Vui lòng thử lại sau.",
      });
    },
  });
};

/**
 * Hook to verify customer email token
 */
export const useVerifyClientToken = () => {
  return useMutation({
    mutationFn: (data: VerifyTokenRequest) =>
      customerApi.verifyClientToken(data),
    onSuccess: () => {
      toast.success("Email verified successfully! You can now login.", {
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error("Verification failed", {
        description: error.message || "The link may be invalid or expired.",
      });
    },
  });
};

/**
 * Hook to login customer
 */
export const useClientLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      await customerApi.loginClient(data);
      const profile = await customerApi.getClientProfile();
      return profile;
    },
    onSuccess: (customerData) => {
      if (!customerData) {
        toast.error("Login failed", {
          description: "Could not retrieve profile data",
        });
        return;
      }

      const authUser = {
        user: {
          id: customerData.id,
          email: customerData.email,
          passwordHash: "",
          name: customerData.name,
          phone: customerData.phone || null,
          avatarUrl: customerData.avatarUrl || null,
          address: customerData.address || null,
          isActive: customerData.isActive,
          isDeleted: customerData.isDeleted,
          createdAt: customerData.createdAt,
          updatedAt: customerData.updatedAt,
        },
        roles: [],
        franchiseRoles: [],
        currentRoleId: null,
        currentFranchiseId: null,
      };

      setAuth(authUser);
      toast.success("Welcome back!", {
        description: "Logged in successfully",
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: error.message || "Invalid credentials",
      });
    },
  });
};

/**
 * Hook to update customer profile
 */
export const useUpdateClientProfile = () => {
  const { authUser, updateProfile } = useAuthStore();

  return useMutation({
    mutationFn: (data: ProfileRequest) => {
      if (!authUser?.user?.id) {
        throw new Error("User ID not found");
      }
      return customerApi.updateClientProfile(authUser.user.id, data);
    },
    onSuccess: (response) => {
      // Response is already camelCase from axios interceptor
      const updatedUser = {
        id: response.id,
        email: response.email,
        passwordHash: "",
        name: response.name,
        phone: response.phone || null,
        avatarUrl: response.avatarUrl || null,
        address: response.address || null,
        isActive: response.isActive,
        isDeleted: response.isDeleted,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };

      updateProfile(updatedUser);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Update failed", {
        description: error.message || "Could not update profile",
      });
    },
  });
};

/**
 * Hook to change customer password
 */
export const useClientChangePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      customerApi.changePasswordClient(data),
    onSuccess: () => {
      toast.success("Password changed successfully", {
        description: "You can now login with your new password",
      });
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
    },
  });
};
