import { create } from "zustand";

import type { Role, User, UserFranchiseRole } from "@/types/user.type";
import { LOCAL_STORAGE } from "@/const/localstorage.const";
import {
  getItemInLocalStorage,
  removeItemInLocalStorage,
  setItemInLocalStorage,
} from "@/utils/localstorgae.utils";

interface AuthUser {
  user: User;
  roles: Role[];
  franchiseRoles: UserFranchiseRole[];
  currentFranchiseId: number | null;
}

interface AuthState {
  authUser: AuthUser | null;
  isLoggedIn: boolean;
  isInitialized: boolean;

  login: (authUser: AuthUser) => void;
  logout: () => void;
  hydrate: () => void;
  setCurrentFranchise: (franchiseId: number | null) => void;

  hasGlobalRole: (roleCode: string) => boolean;
  hasFranchiseRole: (roleCode: string, franchiseId?: number) => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isLoggedIn: false,
  isInitialized: false,

  login: (authUser) => {
    setItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN, authUser);
    set({ authUser, isLoggedIn: true });
  },

  logout: () => {
    removeItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    set({ authUser: null, isLoggedIn: false });
  },

  hydrate: () => {
    const authUser = getItemInLocalStorage<AuthUser>(
      LOCAL_STORAGE.ACCOUNT_ADMIN,
    );
    if (authUser) {
      set({ authUser, isLoggedIn: true, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  setCurrentFranchise: (franchiseId) => {
    const { authUser } = get();
    if (authUser) {
      const updatedAuthUser = {
        ...authUser,
        currentFranchiseId: franchiseId,
      };
      set({ authUser: updatedAuthUser });
      setItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN, updatedAuthUser);
    }
  },

  hasGlobalRole: (roleCode: string) => {
    const { authUser } = get();
    if (!authUser) return false;

    return authUser.roles.some(
      (role) => role.code === roleCode && role.scope === "GLOBAL",
    );
  },

  hasFranchiseRole: (roleCode: string, franchiseId?: number) => {
    const { authUser } = get();
    if (!authUser) return false;

    const targetFranchiseId = franchiseId ?? authUser.currentFranchiseId;
    if (!targetFranchiseId) return false;

    return authUser.franchiseRoles.some((fr) => {
      const role = authUser.roles.find((r) => r.id === fr.role_id);
      return role?.code === roleCode && fr.franchise_id === targetFranchiseId;
    });
  },

  isAdmin: () => {
    return get().hasGlobalRole("ADMIN");
  },
}));
