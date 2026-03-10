import type { BaseTimestamp, SoftDeletable, Activatable } from "./common";

export interface Franchise extends BaseTimestamp, SoftDeletable, Activatable {
  id: string; // MongoDB ObjectId from API
  code: string; // Unique franchise code
  name: string;
  hotline: string;
  logoUrl: string | null;
  address: string;
  openedAt: string | null;
  closedAt: string | null;
  lat?: number; // Latitude for map
  lng?: number; // Longitude for map
  googleMapScript?: string;
}

export interface FranchiseList {
  id: string;
  code: string;
  name: string;
}

export interface FranchiseListResponse {
  success: boolean;
  data: FranchiseList[];
}
