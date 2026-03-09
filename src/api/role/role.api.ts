import { httpClient } from "../httpClient.api";
import type { RoleSelectItem } from "./role.type";

const BASE_URL = "/api/roles";

/**
 * Get all roles for dropdowns (uses /select endpoint)
 */
export const getAll = async (): Promise<RoleSelectItem[]> => {
  const response = await httpClient.get<RoleSelectItem[], never>({
    url: `${BASE_URL}/select`,
  });
  return response || [];
};
