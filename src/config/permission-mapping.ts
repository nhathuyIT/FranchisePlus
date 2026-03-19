import type { Role } from "@/types/user.type";
import { Permission } from "./permission";

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    Permission.ACCESS_ADMIN_PORTAL,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_FRANCHISES,
    Permission.VIEW_FRANCHISES,
    Permission.MANAGE_PRODUCTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.MANAGE_USER_FRANCHISE_ROLES,
    Permission.VIEW_USER_FRANCHISE_ROLES,
    Permission.MANAGE_CART,
    Permission.VIEW_CART,
  ],

  MANAGER: [
    Permission.ACCESS_ADMIN_PORTAL,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_OWN_FRANCHISE,
    // Permission.MANAGE_PRODUCTS, - backend returns 403 for /api/franchises/search
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_CART,
    Permission.MANAGE_CART,
  ],

  STAFF: [
    Permission.ACCESS_ADMIN_PORTAL,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_CART,
    Permission.MANAGE_CART,
  ],

  CUSTOMER: [],
};

function normalizeRoleCode(rawRoleCode: unknown): string {
  if (typeof rawRoleCode !== "string") return "";

  const normalized = rawRoleCode
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_")
    .replace(/^ROLE_/, "");

  if (ROLE_PERMISSIONS[normalized]) return normalized;

  if (normalized.includes("ADMIN")) return "ADMIN";
  if (normalized.includes("MANAGER")) return "MANAGER";
  if (normalized.includes("STAFF") || normalized.includes("EMPLOYEE")) {
    return "STAFF";
  }
  if (normalized.includes("CUSTOMER") || normalized.includes("CLIENT")) {
    return "CUSTOMER";
  }

  return normalized;
}

export function getRolePermissions(role: Role): Permission[] {
  // Support both 'code' field (type definition) and 'role' field (API response)
  const roleCode =
    role.code ||
    (role as unknown as { role?: string; name?: string }).role ||
    role.name;

  const normalizedRoleCode = normalizeRoleCode(roleCode);
  if (!normalizedRoleCode) return [];

  return ROLE_PERMISSIONS[normalizedRoleCode] || [];
}

export function userCanAccess(
  requiredPermissions: Permission[],
  userPermissions: Permission[],
): boolean {
  if (requiredPermissions.length === 0) return true;

  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
}

export function hasAnyPermission(
  requiredPermissions: Permission[],
  userPermissions: Permission[],
): boolean {
  if (requiredPermissions.length === 0) return true;

  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
}
