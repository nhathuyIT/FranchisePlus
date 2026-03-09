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
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _rawData?: unknown;
    _rawParams?: unknown;
  }
}
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
      if (config.data && !config._retry) {
        config._rawData = config.data;
      }
      if (config.params && !config._retry) {
        config._rawParams = config.params;
      }

      // TỰ ĐỘNG CONVERT: FE (camelCase) -> BE (snake_case)
      if (config.data) {
        config.data = toSnake(config.data);
      }
      if (config.params) {
        config.params = toSnake(config.params);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

/**
 * Tạo config mới từ originalRequest để retry sau khi refresh.
 * QUAN TRỌNG: KHÔNG reuse originalRequest trực tiếp — Axios đã serialize
 * headers cũ (bao gồm stale cookies) vào object đó. Tạo config mới giúp
 * Axios build lại headers từ đầu và browser sẽ attach cookie mới
 * (access_token vừa được refresh) vào retry request.
 */
const buildRetryConfig = (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
) => ({
  method: originalRequest.method,
  url: originalRequest.url,
  // ✅ Dùng raw data gốc (camelCase) → request interceptor sẽ toSnake() đúng 1 lần
  data: originalRequest._rawData ?? originalRequest.data,
  params: originalRequest._rawParams ?? originalRequest.params,
  withCredentials: true,
  _retry: true,
  // Không copy _rawData/_rawParams → retry request không lưu lại nữa
});

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
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // ═══════════════════════════════════════════════════════════════
      // 1. VALIDATE CONFIG
      // ═══════════════════════════════════════════════════════════════
      if (!originalRequest) {
        throw new HttpError({
          status: 0,
          message: "Invalid request configuration",
          code: "INVALID_REQUEST",
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // 2. XỬ LÝ REQUEST BỊ HUỶ (AbortController / component unmount)
      // ═══════════════════════════════════════════════════════════════
      if (axios.isCancel(error)) {
        return Promise.reject(null);
      }

      // ═══════════════════════════════════════════════════════════════
      // 3. XỬ LÝ NETWORK ERRORS (Không có response từ server)
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
      // 4. CONVERT ERROR RESPONSE DATA
      // ═══════════════════════════════════════════════════════════════
      if (error.response.data) {
        error.response.data = toCamel(error.response.data);
      }

      const status = error.response.status;
      const data = error.response.data as
        | (ApiErrorResponse & { data?: unknown })
        | undefined;

      // errorCode value comes from the backend as SCREAMING_SNAKE_CASE.
      // toCamel only transforms object *keys*, not string *values*, so the value is unchanged.
      // - Admin:    { success: false, message: "ACCESS_TOKEN_EXPIRED", error: [] }  → data.message
      // - Customer: { success: true,  data: "CUSTOMER_ACCESS_TOKEN_EXPIRED" }       → data.data
      const rawCode =
        data?.errorCode ??
        (typeof data?.data === "string" ? data.data : null) ??
        data?.message ??
        null;
      const errorCode = rawCode ?? null;

      // ═══════════════════════════════════════════════════════════════
      // 5. XỬ LÝ REFRESH TOKEN (401 - Access Token Expired)
      // ═══════════════════════════════════════════════════════════════
      const INVALID_TOKEN_MESSAGES = ["Invalid token"];
      const isTokenExpired =
        typeof errorCode === "string" &&
        (errorCode.endsWith(ACCESS_TOKEN_EXPIRED) ||
          INVALID_TOKEN_MESSAGES.some((msg) => errorCode === msg));

      if (
        status === 401 &&
        isTokenExpired &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("refresh-token")
      ) {
        originalRequest._retry = true;

        // Xác định endpoint refresh phù hợp dựa theo context
        const isAdminContext = window.location.pathname.startsWith("/admin");
        const refreshPath = isAdminContext
          ? "/api/auth/refresh-token"
          : "/api/customer-auth/refresh-token";

        // Build full URL, xử lý trailing slash từ ENV.API_URL
        const baseUrl = ENV.API_URL.replace(/\/+$/, "");

        // Nếu đang refresh, đưa request vào queue chờ
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          }).then(() => axiosClient(buildRetryConfig(originalRequest)));
        }

        isRefreshing = true;

        try {
          // Dùng fetch native để tránh vòng lặp interceptor
          // cache: 'no-store' BẮT BUỘC — tránh 304 (cached), 304 không xử lý Set-Cookie
          const refreshRes = await fetch(`${baseUrl}${refreshPath}`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          });

          if (!refreshRes.ok) {
            throw new Error(`Refresh failed: ${refreshRes.status}`);
          }

          // Chờ browser xử lý Set-Cookie từ response
          await new Promise((r) => setTimeout(r, 100));

          // Retry tất cả requests trong queue
          flushQueue();
          return axiosClient(buildRetryConfig(originalRequest));
        } catch (refreshError) {
          flushQueue(refreshError);
          await forceLogout();
          throw new HttpError({
            status: 401,
            message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
            code: "REFRESH_TOKEN_FAILED",
          });
        } finally {
          isRefreshing = false;
          refreshQueue = [];
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // 6. XỬ LÝ CÁC LỖI KHÁC
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

const forceLogout = async () => {
  // Dùng dynamic import để tránh circular dependency:
  // axios.config → auth-store → auth.api → httpClient → axios.config
  try {
    const { useAuthStore } = await import("@/stores/auth-store");
    await useAuthStore.getState().logout(false);
  } catch {
    // Bỏ qua lỗi logout — ưu tiên redirect
  }

  const isAdminPath = window.location.pathname.startsWith("/admin");
  const loginPath = isAdminPath ? "/admin/login" : "/client/login";
  if (window.location.pathname !== loginPath) {
    window.location.replace(loginPath);
  }
};
