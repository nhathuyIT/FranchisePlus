import { LOCAL_STORAGE } from "@/const/localstorage.const";
import type { ID } from "@/types/common";
import type { Role, User } from "@/types/user.type";

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
export function getCurrentUser(): User | null {
  return getItemInLocalStorage<User>(LOCAL_STORAGE.ACCOUNT_ADMIN);
}

export function getCurrentUserId(): ID | null {
  return getCurrentUser()?.id ?? null;
}

export function getCurrentUserRole(): Role | null {
  return getCurrentUser()?.role ?? null;
}
export function removeItemInLocalStorage(key: string): void {
  localStorage.removeItem(key);
}
