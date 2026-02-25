import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export interface Franchise extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  code: string; // Unique franchise code
  name: string;
  logoUrl: string | null;
  address: string;
<<<<<<< HEAD
  opened_at: string | null;
  closed_at: string | null;
=======
  openedAt: string | null;
  closedAt: string | null;
>>>>>>> dev
  lat?: number; // Latitude for map
  lng?: number; // Longitude for map
}
