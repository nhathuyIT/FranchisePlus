import { httpClient } from "../httpClient.api";
import type { Franchise } from "@/types/franchise";

const BASE_URL = "/api/clients/franchises";

export const getAllClientFranchises = async (): Promise<Franchise[]> => {
  const response = await httpClient.get<Franchise[], never>({
    url: BASE_URL,
  });
  return response || [];
};

export const getClientFranchiseById = async (
  franchiseId: string,
): Promise<Franchise | null> => {
  const response = await httpClient.get<Franchise, never>({
    url: `${BASE_URL}/${encodeURIComponent(franchiseId)}`,
  });
  return response;
};
