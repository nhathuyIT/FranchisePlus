import { Permission } from "@/config/permission";
import type { Role } from "@/types/user.type";

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
    Permission.VIEW_CART,
    Permission.MANAGE_CART,
  ],

  MANAGER: [
    Permission.ACCESS_ADMIN_PORTAL,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
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

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role.code] || [];
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
