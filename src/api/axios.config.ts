import { ENV } from "@/config/env.config";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { HttpError, type ApiErrorResponse } from "./http.type";
import {
  isPlainObject,
  mapKeys,
  mapValues,
  snakeCase,
  camelCase,
} from "lodash";

// ── Helpers chuyển đổi cấu trúc dữ liệu ───────────────────────────────────────

/**
 * Kiểm tra xem object có nên được transform hay không
 * Loại trừ các browser native objects và special types
 */
const shouldTransform = (obj: unknown): boolean => {
  if (obj === null || typeof obj !== "object") return false;
  if (!isPlainObject(obj)) return false;

  // Không transform các browser native objects và special types
  return !(
    obj instanceof Date ||
    obj instanceof File ||
    obj instanceof Blob ||
    obj instanceof FormData ||
    obj instanceof URLSearchParams ||
    obj instanceof ArrayBuffer ||
    obj instanceof RegExp
  );
};

/**
 * Chuyển đổi object/array từ snake_case sang camelCase (BE → FE)
 */
const toCamel = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamel(item)) as unknown as T;
  }

  if (shouldTransform(obj)) {
    const result = mapKeys(
      mapValues(obj as Record<string, unknown>, (v) => toCamel(v)),
      (_, k) => camelCase(k),
    );
    return result as unknown as T;
  }

  return obj;
};

/**
 * Chuyển đổi object/array từ camelCase sang snake_case (FE → BE)
 */
const toSnake = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnake(item)) as unknown as T;
  }

  if (shouldTransform(obj)) {
    const result = mapKeys(
      mapValues(obj as Record<string, unknown>, (v) => toSnake(v)),
      (_, k) => snakeCase(k),
    );
    return result as unknown as T;
  }

  return obj;
};
// ────────────────────────────────────────────────────────────────────────────

const ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED";

let isRefreshing = false;
let refreshQueue: { resolve: () => void; reject: (err: unknown) => void }[] =
  [];

const flushQueue = (error: unknown = null) => {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(),
  );
  refreshQueue = [];
};

export const axiosClient = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 30000, // 30s (đã giảm từ 300s)
  // Không set Content-Type mặc định, để axios tự detect
  // Điều này quan trọng cho FormData, multipart/form-data
});

export const setupApi = () => {
  requestInterceptor();
  responseInterceptor();
};

export const requestInterceptor = () => {
  axiosClient.interceptors.request.use(
    (config) => {
      // TỰ ĐỘNG CONVERT: FE (camelCase) -> BE (snake_case)
      // shouldTransform() sẽ tự động skip FormData, File, Blob, etc.
      if (config.data) {
        config.data = toSnake(config.data);
      }

      // Transform query params
      if (config.params) {
        config.params = toSnake(config.params);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

export const responseInterceptor = () => {
  axiosClient.interceptors.response.use(
    (response) => {
      // TỰ ĐỘNG CONVERT: BE (snake_case) -> FE (camelCase)
      if (response.data) {
        response.data = toCamel(response.data);
      }
      return response;
    },
    async (error) => {
      // ═══════════════════════════════════════════════════════════════
      // 1. XỬ LÝ NETWORK ERRORS (Không có response từ server)
      // ═══════════════════════════════════════════════════════════════
      if (!error.response) {
        const message =
          error.code === "ECONNABORTED"
            ? "Yêu cầu quá thời gian chờ. Vui lòng thử lại."
            : error.code === "ERR_NETWORK"
              ? "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
              : "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.";

        throw new HttpError({
          status: 0,
          message,
          code: error.code || "NETWORK_ERROR",
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // 2. CONVERT ERROR RESPONSE DATA
      // ═══════════════════════════════════════════════════════════════
      if (error.response.data) {
        error.response.data = toCamel(error.response.data);
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const status = error.response.status;
      const data = error.response.data as ApiErrorResponse | undefined;
      const errorCode = data?.errorCode ?? null;

      // ═══════════════════════════════════════════════════════════════
      // 3. XỬ LÝ REFRESH TOKEN (401 - Access Token Expired)
      // ═══════════════════════════════════════════════════════════════
      if (
        status === 401 &&
        errorCode === ACCESS_TOKEN_EXPIRED &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/api/auth/refresh-token")
      ) {
        originalRequest._retry = true;

        // Nếu đang refresh, đưa request vào queue
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          }).then(() => axiosClient(originalRequest));
        }

        isRefreshing = true;

        try {
          // Dùng fetch native để tránh vòng lặp interceptor
          const refreshRes = await fetch(
            `${ENV.API_URL}/api/auth/refresh-token`,
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            },
          );

          if (!refreshRes.ok) {
            throw new Error(`Refresh failed: ${refreshRes.status}`);
          }

          // Delay nhỏ để đảm bảo cookie được set
          await new Promise((r) => setTimeout(r, 50));

          // Retry tất cả requests trong queue
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

      // ═══════════════════════════════════════════════════════════════
      // 4. XỬ LÝ CÁC LỖI KHÁC
      // ═══════════════════════════════════════════════════════════════
      const message =
        data?.message ??
        data?.errors?.[0]?.message ??
        error.message ??
        "Đã xảy ra lỗi. Vui lòng thử lại.";

      throw new HttpError({
        status,
        message,
        code: errorCode ?? undefined,
        errors: data?.errors ?? undefined,
      });
    },
  );
};

const forceLogout = () => {
  import("@/stores/auth-store").then(({ useAuthStore }) => {
    useAuthStore.getState().logout(false);
  });

  const isAdminPath = window.location.pathname.startsWith("/admin");
  const loginPath = isAdminPath ? "/admin/login" : "/client/login";
  if (window.location.pathname !== loginPath) {
    window.location.replace(loginPath);
  }
};
