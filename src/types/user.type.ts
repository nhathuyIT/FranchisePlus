import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * User entity - internal users (admin, manager, staff)
 */
export interface User extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  email: string; // unique
  password_hash: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
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
  franchise_id: ID | null; // null if role is GLOBAL
  role_id: ID;
  user_id: ID;
}
