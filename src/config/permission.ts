import type { Franchise } from "@/types/franchise";
import type { Role, UserFranchiseRole } from "@/types/user.type";

export interface RoleContext {
  role: Role;
  franchise: Franchise | null;
  franchiseRole: UserFranchiseRole | null;
}

export interface AvailableContext {
  id: string; // unique identifier: `${roleId}-${franchiseId || 'global'}`
  roleId: number;
  roleName: string;
  roleCode: string;
  franchiseId: string | null; // MongoDB ObjectId string
  franchiseName: string | null;
  isGlobal: boolean;
}

export const Permission = {
  ACCESS_ADMIN_PORTAL: "ACCESS_ADMIN_PORTAL",

  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_ANALYTICS: "VIEW_ANALYTICS",

  MANAGE_USERS: "MANAGE_USERS",
  VIEW_USERS: "VIEW_USERS",

  MANAGE_FRANCHISES: "MANAGE_FRANCHISES",
  VIEW_FRANCHISES: "VIEW_FRANCHISES",
  MANAGE_OWN_FRANCHISE: "MANAGE_OWN_FRANCHISE",

  MANAGE_PRODUCTS: "MANAGE_PRODUCTS",
  VIEW_PRODUCTS: "VIEW_PRODUCTS",

  MANAGE_ORDERS: "MANAGE_ORDERS",
  VIEW_ORDERS: "VIEW_ORDERS",

  MANAGE_INVENTORY: "MANAGE_INVENTORY",
  VIEW_INVENTORY: "VIEW_INVENTORY",

  MANAGE_CUSTOMERS: "MANAGE_CUSTOMERS",
  VIEW_CUSTOMERS: "VIEW_CUSTOMERS",

  VIEW_REPORTS: "VIEW_REPORTS",
  EXPORT_REPORTS: "EXPORT_REPORTS",

  MANAGE_USER_FRANCHISE_ROLES: "MANAGE_USER_FRANCHISE_ROLES",
  VIEW_USER_FRANCHISE_ROLES: "VIEW_USER_FRANCHISE_ROLES",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];
