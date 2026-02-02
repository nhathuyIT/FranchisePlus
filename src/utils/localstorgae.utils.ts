import { LOCAL_STORAGE } from "@/const/localstorage.const";
import type { ID } from "@/types/common";
import type { Role, User, UserFranchiseRole } from "@/types/user.type";

export interface AuthUser {
  user: User;
  roles: Role[];
  franchiseRoles: UserFranchiseRole[];
  currentFranchiseId: number | null;
}

export function setItemInLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItemInLocalStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error("LocalStorage error:", error);
    return null;
  }
}

export function getCurrentAuthUser(): AuthUser | null {
  return getItemInLocalStorage<AuthUser>(LOCAL_STORAGE.ACCOUNT_ADMIN);
}

export function getCurrentUser(): User | null {
  return getCurrentAuthUser()?.user ?? null;
}

export function getCurrentUserId(): ID | null {
  return getCurrentUser()?.id ?? null;
}

export function getCurrentUserRoles(): Role[] {
  return getCurrentAuthUser()?.roles ?? [];
}

export function getCurrentFranchiseId(): number | null {
  return getCurrentAuthUser()?.currentFranchiseId ?? null;
}

export function removeItemInLocalStorage(key: string): void {
  localStorage.removeItem(key);
}
