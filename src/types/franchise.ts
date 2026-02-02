import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export interface Franchise extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  code: string; // Unique franchise code
  name: string;
  logo_url: string | null;
  address: string;
  opened_at: string | null;
  closed_at: string | null;
}
