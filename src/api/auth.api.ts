import { httpClient } from "./httpClient.api";
import type {
  LoginRequest,
  LoginResponse,
  SwitchContextRequest,
  SwitchContextResponse,
  GetProfileResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  VerifyTokenRequest,
  VerifyTokenResponse,
  ResendTokenRequest,
  RegisterAdminRequest,
  RegisterResponse,
} from "@/types/auth.type";

interface RuntimeSwitchContextRequest extends SwitchContextRequest {
  role_id?: number;
}

interface RuntimeSwitchContextResponse extends SwitchContextResponse {
  currentRoleId?: number;
  currentFranchiseId?: string | null;
}

interface RuntimeGetProfileResponse extends GetProfileResponse {
  currentRoleId?: number;
  currentFranchiseId?: string | null;
}

export const login = async (data: LoginRequest): Promise<void> => {
  await httpClient.post<LoginResponse, LoginRequest>({
    url: "/api/auth",
    data,
  });
  // Login success if no error thrown - cookies are set by backend
};

export const switchContext = async (
  data: RuntimeSwitchContextRequest,
): Promise<RuntimeSwitchContextResponse> => {
  const response = await httpClient.post<
    RuntimeSwitchContextResponse,
    RuntimeSwitchContextRequest
  >({
    url: "/api/auth/switch-context",
    data,
  });
  return response!;
};

export const getProfile = async (): Promise<RuntimeGetProfileResponse> => {
  const response = await httpClient.get<RuntimeGetProfileResponse, never>({
    url: "/api/auth",
  });

  if (!response) {
    throw new Error("Failed to get profile: No data returned from server");
  }

  return response;
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await httpClient.get<RefreshTokenResponse, never>({
    url: "/api/auth/refresh-token",
  });
  return response!;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<void> => {
  await httpClient.put<void, ForgotPasswordRequest>({
    url: "/api/auth/for got-password",
    data,
  });
};

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<void> => {
  await httpClient.put<void, ChangePasswordRequest>({
    url: "/api/auth/change-password",
    data,
  });
};

export const logout = async (): Promise<void> => {
  await httpClient.post<void, never>({
    url: "/api/auth/logout",
  });
};

export const verifyToken = async (
  data: VerifyTokenRequest,
): Promise<VerifyTokenResponse> => {
  const response = await httpClient.post<
    VerifyTokenResponse,
    VerifyTokenRequest
  >({
    url: "/api/auth/verify-token",
    data,
  });
  return response!;
};

export const resendToken = async (data: ResendTokenRequest): Promise<void> => {
  await httpClient.post<void, ResendTokenRequest>({
    url: "/api/auth/resend-token",
    data,
  });
};
export const register = async (
  data: RegisterAdminRequest,
): Promise<RegisterResponse> => {
  const response = await httpClient.post<
    RegisterResponse,
    RegisterAdminRequest
  >({
    url: "/api/auth",
    data,
  });
  return response!;
};
