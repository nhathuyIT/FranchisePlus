import { httpClient } from "../httpClient.api";
import type { GetProfileResponse, ActiveContext } from "@/types/auth.type";
import type { ApiRoleItem } from "@/types/auth.type";

interface AdminProfileResponse extends GetProfileResponse {
  user: GetProfileResponse["user"];
  roles: ApiRoleItem[];
  activeContext: ActiveContext | null;
}

/** Payload accepted by updateAdminProfile */
export interface UpdateAdminProfileRequest {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

/**
 * GET /api/auth
 * Fetches the current authenticated admin's profile.
 */
export const getAdminProfile = async (): Promise<AdminProfileResponse> => {
  const response = await httpClient.get<AdminProfileResponse, never>({
    url: "/api/auth",
  });

  if (!response) {
    throw new Error("Failed to get admin profile: No data returned from server");
  }

  return response;
};

/**
 * PUT /api/users/:id
 * Updates the current admin's profile (name, phone, avatar).
 */
export const updateAdminProfile = async (
  userId: string,
  data: UpdateAdminProfileRequest,
): Promise<void> => {
  await httpClient.put<unknown, UpdateAdminProfileRequest>({
    url: `/api/users/${encodeURIComponent(userId)}`,
    data,
  });
};
