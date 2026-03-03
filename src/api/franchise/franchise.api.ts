import { httpClient } from "../httpClient.api";
import { axiosClient } from "../axios.config";
import type {
  ApiFranchise,
  ApiFranchiseCreateRequest,
  ApiFranchiseSearchRequest,
  ApiFranchiseStatusRequest,
  ApiFranchiseUpdateRequest,
  FranchiseCreateRequest,
  FranchiseSearchCondition,
  FranchiseSearchRequest,
  FranchiseSearchResponse,
  FranchiseSelectResponse,
  FranchiseStatusRequest,
  FranchiseUpdateRequest,
  FranchiseListResponse,
} from "./franchise.type";
import type { Franchise } from "@/types/franchise";

const BASE_URL = "/api/franchises";

const encodeId = (id: string) => encodeURIComponent(id);

const toFranchise = (raw: ApiFranchise): Franchise => ({
  id: raw.id,
  code: raw.code,
  name: raw.name,
  hotline: raw.hotline ?? "",
  logoUrl: raw.logo_url,
  address: raw.address,
  openedAt: raw.opened_at,
  closedAt: raw.closed_at,
  lat: raw.lat,
  lng: raw.lng,
  isActive: raw.is_active,
  isDeleted: raw.is_deleted,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

const toApiSearchCondition = (
  condition: FranchiseSearchCondition
): ApiFranchiseSearchRequest["searchCondition"] => ({
  keyword: condition.keyword,
  opened_at: condition.openedAt,
  closed_at: condition.closedAt,
  is_active: condition.isActive,
  is_deleted: condition.isDeleted,
});

const toApiCreateRequest = (
  payload: FranchiseCreateRequest
): ApiFranchiseCreateRequest => ({
  code: payload.code,
  name: payload.name,
  hotline: payload.hotline,
  logo_url: payload.logoUrl,
  address: payload.address,
  opened_at: payload.openedAt,
  closed_at: payload.closedAt,
  lat: payload.lat,
  lng: payload.lng,
});

const toApiUpdateRequest = (
  payload: FranchiseUpdateRequest
): ApiFranchiseUpdateRequest => {
  const data: ApiFranchiseUpdateRequest = {};

  if (payload.code !== undefined) data.code = payload.code;
  if (payload.name !== undefined) data.name = payload.name;
  if (payload.hotline !== undefined) data.hotline = payload.hotline;
  if (payload.logoUrl !== undefined) data.logo_url = payload.logoUrl;
  if (payload.address !== undefined) data.address = payload.address;
  if (payload.openedAt !== undefined) data.opened_at = payload.openedAt;
  if (payload.closedAt !== undefined) data.closed_at = payload.closedAt;
  if (payload.lat !== undefined) data.lat = payload.lat;
  if (payload.lng !== undefined) data.lng = payload.lng;

  return data;
};

const toApiStatusRequest = (
  payload: FranchiseStatusRequest
): ApiFranchiseStatusRequest => ({
  is_active: payload.isActive,
});

/**
 * Get franchise list for dropdown/select
 */
export const getSelect = async (): Promise<FranchiseSelectResponse> => {
  const response = await httpClient.get<FranchiseSelectResponse, never>({
    url: `${BASE_URL}/select`,
  });
  return response || [];
};

/**
 * Get all franchises
 */
export const getAll = async (): Promise<FranchiseListResponse> => {
  const response = await httpClient.get<ApiFranchise[], never>({
    url: BASE_URL,
  });

  return (response || []).map(toFranchise);
};

/**
 * Search franchises with pagination
 */
export const search = async (
  data: FranchiseSearchRequest
): Promise<FranchiseSearchResponse> => {
  const apiPayload: ApiFranchiseSearchRequest = {
    searchCondition: toApiSearchCondition(data.searchCondition),
    pageInfo: data.pageInfo,
  };

  const res = await axiosClient.post(`${BASE_URL}/search`, apiPayload);
  const response = res.data;

  if (!response?.success) {
    throw new Error("Failed to search franchises");
  }

  return {
    pageData: (response.data || []).map(toFranchise),
    pageInfo: response.pageInfo || {
      pageNum: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
  };
};

/**
 * Get franchise by ID
 */
export const getById = async (id: string): Promise<Franchise | null> => {
  const response = await httpClient.get<ApiFranchise, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });

  return response ? toFranchise(response) : null;
};

/**
 * Create new franchise
 */
export const create = async (
  data: FranchiseCreateRequest
): Promise<Franchise | null> => {
  const response = await httpClient.post<ApiFranchise, ApiFranchiseCreateRequest>({
    url: BASE_URL,
    data: toApiCreateRequest(data),
  });

  return response ? toFranchise(response) : null;
};

/**
 * Update franchise
 */
export const update = async (
  id: string,
  data: FranchiseUpdateRequest
): Promise<Franchise | null> => {
  const response = await httpClient.put<ApiFranchise, ApiFranchiseUpdateRequest>({
    url: `${BASE_URL}/${encodeId(id)}`,
    data: toApiUpdateRequest(data),
  });

  return response ? toFranchise(response) : null;
};

/**
 * Soft delete franchise
 */
export const remove = async (id: string): Promise<void> => {
  await httpClient.delete<null, never>({
    url: `${BASE_URL}/${encodeId(id)}`,
  });
};

/**
 * Restore deleted franchise
 */
export const restore = async (id: string): Promise<void> => {
  await httpClient.patch<null, never>({
    url: `${BASE_URL}/${encodeId(id)}/restore`,
  });
};

/**
 * Update franchise status (active/inactive)
 */
export const updateStatus = async (
  id: string,
  data: FranchiseStatusRequest
): Promise<void> => {
  await httpClient.patch<null, ApiFranchiseStatusRequest>({
    url: `${BASE_URL}/${encodeId(id)}/status`,
    data: toApiStatusRequest(data),
  });
};
