import { ENV } from "@/config/env.config";
import axios from "axios";
import { HttpError, type ApiErrorResponse } from "./http.type";
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
    (error) => {
      const status = error.response?.status ?? 0;
      const data = error.response?.data as ApiErrorResponse | undefined;

      const message =
        data?.message ??
        data?.errors?.[0]?.message ??
        error.message ??
        "Request failed";

      throw new HttpError({
        status,
        message,
        errors: data?.errors ?? undefined,
      });
    },
  );
};
