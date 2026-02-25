export type ID = number;

export interface BaseTimestamp {
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface SoftDeletable {
  isDeleted: boolean; // false by default
}

export interface Activatable {
  isActive: boolean; // true by default
}
