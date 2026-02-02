export type ID = number;

export interface BaseTimestamp {
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface SoftDeletable {
  is_deleted: boolean; // false by default
}

export interface Activatable {
  is_active: boolean; // true by default
}
