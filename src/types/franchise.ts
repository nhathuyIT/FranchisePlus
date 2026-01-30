import type { ID, Timestamp } from "./common";

/**
 * Franchise entity based on ERD
 * Represents a franchise location/branch
 */
export interface Franchise extends Timestamp {
  id: ID;
  code: string; // unique identifier code
  name: string;
  logo_url?: string;
  address: string;
  opened_at?: string; // ISO timestamp
  closed_at?: string; // ISO timestamp
  is_active: boolean; // true = active, false = inactive
  is_deleted: boolean; // soft delete flag
}
