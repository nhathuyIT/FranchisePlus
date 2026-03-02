import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * User entity - internal users (admin, manager, staff)
 */
export interface User extends BaseTimestamp, SoftDeletable, Activatable {
  id: string; // MongoDB ObjectId
  email: string; // unique
  passwordHash: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  address: string | null;
}

/**
 * Role entity - defines user roles
 */
export interface Role extends BaseTimestamp, SoftDeletable {
  id: ID;
  code: string; // unique
  name: string;
  description: string | null;
  scope: "GLOBAL" | "FRANCHISE";
}

/**
 * UserFranchiseRole - junction table for user-franchise-role assignment
 * UNIQUE (user_id, franchise_id, role_id)
 */
export interface UserFranchiseRole extends BaseTimestamp, SoftDeletable {
  id: ID;
  franchiseId: string | null; // MongoDB ObjectId string, null if role is GLOBAL
  roleId: ID;
  userId: string; // MongoDB ObjectId string
  franchiseName?: string | null; // optional franchise name from API
}
