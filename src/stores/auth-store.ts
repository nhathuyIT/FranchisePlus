import { create } from "zustand";

import type { Role, User, UserFranchiseRole } from "@/types/user.type";
import { LOCAL_STORAGE } from "@/const/localstorage.const";
import {
  getItemInLocalStorage,
  removeItemInLocalStorage,
  setItemInLocalStorage,
} from "@/utils/localstorgae.utils";
import type { AvailableContext, Permission } from "@/config/permission";
import { getRolePermissions } from "@/config/permission-mapping";
import * as authApi from "@/api/auth.api";

interface AuthUser {
  user: User;
  roles: Role[];
  franchiseRoles: UserFranchiseRole[] | null;
  currentRoleId: number | null;
  currentFranchiseId: string | null; // MongoDB ObjectId string
}

interface AuthState {
  authUser: AuthUser | null;
  isLoggedIn: boolean;
  isInitialized: boolean;
  isSwitchingRole: boolean;

  login: (authUser: AuthUser) => void;
  setSwitchingRole: (value: boolean) => void;
  logout: (callApi?: boolean) => Promise<void>;
  hydrate: () => void;
  updateProfile: (
    data: Partial<Pick<User, "name" | "email" | "phone" | "avatarUrl">>,
  ) => void;

  getAvailableContexts: () => AvailableContext[];
  switchRole: (context: AvailableContext) => void;
  getCurrentPermissions: () => Permission[];
  getCurrentRole: () => Role | null;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isLoggedIn: false,
  isInitialized: false,
  isSwitchingRole: false,

  setSwitchingRole: (value) => set({ isSwitchingRole: value }),

  login: (authUser) => {
    setItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN, authUser);
    set({ authUser, isLoggedIn: true });
  },

  logout: async (callApi = true) => {
    if (callApi) {
      try {
        await authApi.logout();
      } catch (error) {
        console.error("[logout] API call failed:", error);
      }
    }

    // Clear local storage and state
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

  updateProfile: (data) => {
    const { authUser } = get();
    if (authUser) {
      const updatedAuthUser = {
        ...authUser,
        user: {
          ...authUser.user,
          ...data,
          updatedAt: new Date().toISOString(),
        },
      };
      set({ authUser: updatedAuthUser });
      setItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN, updatedAuthUser);
    }
  },

  getAvailableContexts: () => {
    const { authUser } = get();
    if (
      !authUser ||
      !authUser.franchiseRoles ||
      !authUser.franchiseRoles.length
    )
      return [];

    return authUser.franchiseRoles.map((fr) => {
      const role = authUser.roles.find((r) => r.id === fr.roleId);
      return {
        id: `${fr.roleId}-${fr.franchiseId || "global"}`,
        roleId: fr.roleId,
        roleName: role?.name || role?.code || "Unknown Role",
        roleCode: role?.code || "UNKNOWN",
        franchiseId: fr.franchiseId,
        franchiseName: fr.franchiseName || null,
        isGlobal: !fr.franchiseId,
      };
    });
  },

  switchRole: (context: AvailableContext) => {
    const { authUser } = get();
    if (!authUser) return;

    const updatedAuthUser = {
      ...authUser,
      currentRoleId: context.roleId,
      currentFranchiseId: context.franchiseId,
    };
    set({ authUser: updatedAuthUser });
    setItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN, updatedAuthUser);
  },

  getCurrentPermissions: () => {
    const { authUser } = get();
    if (!authUser) return [];

    // Try to find role by currentRoleId first
    if (authUser.currentRoleId) {
      const currentRole = authUser.roles.find(
        (role) => role.id === authUser.currentRoleId,
      );
      if (currentRole) {
        return getRolePermissions(currentRole);
      }
    }

    // Fallback: use first role (for ADMIN or when currentRoleId is null)
    if (authUser.roles.length > 0) {
      return getRolePermissions(authUser.roles[0]);
    }

    return [];
  },

  getCurrentRole: () => {
    const { authUser } = get();
    if (!authUser) return null;

    // Try to find role by currentRoleId first
    if (authUser.currentRoleId) {
      const role = authUser.roles.find(
        (role) => role.id === authUser.currentRoleId,
      );
      if (role) return role;
    }

    // Fallback: return first role (for ADMIN or when currentRoleId is null)
    return authUser.roles[0] || null;
  },

  isAdmin: () => {
    const currentRole = get().getCurrentRole();
    // Support both 'code' field (type definition) and 'role' field (API response)
    const roleCode =
      currentRole?.code || (currentRole as unknown as { role?: string })?.role;
    return roleCode === "ADMIN";
  },
}));
