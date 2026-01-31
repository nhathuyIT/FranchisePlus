import type { ID, Timestamp } from "./common";

/**
 * Franchise entity - represents a franchise location/branch
 * Based on ERD with unique code constraint
 */
export interface Franchise extends Timestamp {
  id: ID;
  code: string; // Unique franchise code (e.g., CF-D1-001)
  name: string;
  logo_url?: string;
  address: string;
  opened_at?: string;
  closed_at?: string;
  is_active: boolean;
  is_deleted: boolean; // Soft delete flag
}
