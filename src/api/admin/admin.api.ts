import { httpClient } from "../httpClient.api";
import type { GetProfileResponse, ActiveContext } from "@/types/auth.type";
import type { ApiRoleItem } from "@/types/auth.type";

interface AdminProfileResponse extends GetProfileResponse {
  user: GetProfileResponse["user"];
  roles: ApiRoleItem[];
  activeContext: ActiveContext | null;
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
