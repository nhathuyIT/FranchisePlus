import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from "@/types/auth.type";
import type {
  CustomerLoginResponse,
  ProfileRequest,
  CustomerListResponse,
  CustomerProfile,
} from "@/types/customer";

// Search request parameters
export interface SearchCustomerRequest {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}
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

// CUSTOMER-02: Create customer (SYSTEM & FRANCHISE permission)
export const createCustomer = async (
  data: RegisterRequest,
): Promise<CustomerProfile> => {
  const response = await httpClient.post<CustomerProfile, RegisterRequest>({
    url: "/api/customers",
    data,
  });
  return response!;
};

// CUSTOMER-03: Search customers by conditions (SYSTEM & FRANCHISE permission)
export const searchCustomers = async (
  params?: SearchCustomerRequest,
): Promise<CustomerListResponse> => {
  const response = await httpClient.post<CustomerListResponse, SearchCustomerRequest>({
    url: "/api/customers/search",
    data: params || {},
  });
  return response!;
};

export const getClientProfileById = async (
  id: string,
): Promise<CustomerProfile> => {
  const response = await httpClient.get<CustomerProfile>({
    url: `/api/customers/${id}`,
  });
  return response!;
};

export const deleteClientProfileById = async (id: string): Promise<void> => {
  await httpClient.delete<void, never>({
    url: `/api/customers/${id}`,
  });
};
