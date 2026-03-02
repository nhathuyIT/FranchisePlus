import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from "@/types/auth.type";
import type { CustomerLoginResponse, ProfileRequest } from "@/types/customer";
import { httpClient } from "../httpClient.api";

export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await httpClient.post<RegisterResponse, RegisterRequest>({
    url: "/api/customers/register",
    data,
  });
  return response!;
};
export const verifyClientToken = async (
  data: VerifyTokenRequest,
): Promise<VerifyTokenResponse> => {
  const response = await httpClient.post<
    VerifyTokenResponse,
    VerifyTokenRequest
  >({
    url: "/api/customer-auth/verify-token",
    data,
  });
  return response!;
};

export const loginClient = async (data: LoginRequest): Promise<void> => {
  await httpClient.post<void, LoginRequest>({
    url: "/api/customer-auth",
    data,
  });
};

export const getClientProfile = async (): Promise<CustomerLoginResponse> => {
  const response = await httpClient.get<CustomerLoginResponse>({
    url: "/api/customer-auth",
  });
  return response!;
};
export const logoutClient = async (): Promise<void> => {
  await httpClient.post<void, never>({
    url: "/api/customer-auth/logout",
  });
};

export const updateClientProfile = async (
  id: string,
  data: ProfileRequest,
): Promise<CustomerLoginResponse> => {
  const response = await httpClient.put<CustomerLoginResponse>({
    url: `/api/customers/${id}`,
    data,
  });
  return response!;
};
