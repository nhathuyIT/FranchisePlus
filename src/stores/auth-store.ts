import { create } from "zustand";

import type { User } from "@/types/user.type";
import { LOCAL_STORAGE } from "@/const/localstorage.const";
import {
  getItemInLocalStorage,
  removeItemInLocalStorage,
  setItemInLocalStorage,
} from "@/utils/localstorgae.utils";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isInitialized: boolean;

  login: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitialized: false,

  login: (user) => {
    setItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN, user);
    set({ user, isLoggedIn: true });
  },

  logout: () => {
    removeItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    set({ user: null, isLoggedIn: false });
  },

  hydrate: () => {
    const user = getItemInLocalStorage<User>(LOCAL_STORAGE.ACCOUNT_ADMIN);
    if (user) {
      set({ user, isLoggedIn: true, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },
}));
