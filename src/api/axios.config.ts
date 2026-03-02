import { ENV } from "@/config/env.config";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { HttpError, type ApiErrorResponse } from "./http.type";

// Error code returned by backend to distinguish token expiry from other 401s
const ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED";

// ── Refresh queue state ──────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: { resolve: () => void; reject: (err: unknown) => void }[] =
  [];

const flushQueue = (error: unknown = null) => {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(),
  );
  refreshQueue = [];
};
// ────────────────────────────────────────────────────────────────────────────

export const axiosClient = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupApi = () => {
  requestInterceptor();
  responseInterceptor();
};

export const requestInterceptor = () => {
  axiosClient.interceptors.request.use(
    (config) => {
      // HttpOnly cookie authentication - no need to add Authorization header
      // Cookies are automatically sent with withCredentials: true
      return config;
    },
    (error) => Promise.reject(error),
  );
};

export const responseInterceptor = () => {
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const status = error.response?.status ?? 0;
      const data = error.response?.data as ApiErrorResponse | undefined;
      const errorCode = data?.errorCode ?? null;

      // ── 401 ACCESS_TOKEN_EXPIRED → auto refresh ──────────────────────────
      if (
        status === 401 &&
        errorCode === ACCESS_TOKEN_EXPIRED &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/api/auth/refresh-token")
      ) {
        originalRequest._retry = true;

        // If another request is already refreshing, queue this one
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          }).then(() => axiosClient(originalRequest));
        }

        isRefreshing = true;

        try {
          // Use native fetch to bypass this interceptor (avoid infinite loop)
          // cache: 'no-store' is mandatory — without it browser may return 304
          // and a 304 does NOT process Set-Cookie, so the new access_token is never set
          const refreshRes = await fetch(
            `${ENV.API_URL}/api/auth/refresh-token`,
            { method: "GET", credentials: "include", cache: "no-store" },
          );

          if (!refreshRes.ok) {
            throw new Error(`Refresh failed: ${refreshRes.status}`);
          }

          // Give the browser a tick to apply the new Set-Cookie header
          await new Promise((r) => setTimeout(r, 50));

          flushQueue();
          return axiosClient(originalRequest);
        } catch (refreshError) {
          flushQueue(refreshError);
          forceLogout();

          throw new HttpError({
            status: 401,
            message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
            code: "REFRESH_TOKEN_FAILED",
          });
        } finally {
          isRefreshing = false;
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      const message =
        data?.message ??
        data?.errors?.[0]?.message ??
        error.message ??
        "Request failed";

      throw new HttpError({
        status,
        message,
        code: errorCode ?? undefined,
        errors: data?.errors ?? undefined,
      });
    },
  );
};

// ── Force logout: clear store + redirect to the correct login page ───────────
const forceLogout = () => {
  // Dynamic import to avoid circular dependency (store → api → store)
  import("@/stores/auth-store").then(({ useAuthStore }) => {
    useAuthStore.getState().logout(false);
  });

  const isAdminPath = window.location.pathname.startsWith("/admin");
  const loginPath = isAdminPath ? "/admin/login" : "/client/login";
  if (window.location.pathname !== loginPath) {
    window.location.replace(loginPath);
  }
};
