import type { BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * Franchise entity.
 *
 * The client endpoint GET /api/clients/franchises only returns {id, code, name}.
 * The admin endpoint GET /api/franchises returns all fields.
 * Fields beyond id/code/name are marked optional to reflect this.
 */
export interface Franchise extends Partial<BaseTimestamp>, Partial<SoftDeletable>, Partial<Activatable> {
  id: string;
  code: string;
  name: string;
  hotline?: string;
  logoUrl?: string | null;
  address?: string;
  openedAt?: string | null;
  closedAt?: string | null;
  lat?: number;
  lng?: number;
  google_map_script?: string;
}
