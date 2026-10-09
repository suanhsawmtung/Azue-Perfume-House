import { baseApiUrl } from "@/config/env";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  setAuthTokens,
  useAuthStore,
} from "@/stores/auth.store";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { isAppleDevice } from "./device";
import { sleep } from "./utils";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const appleDevice = isAppleDevice();
    config.headers.set("is-apple-device", String(appleDevice));

    if (appleDevice && typeof window !== "undefined") {
      const accessToken = window.localStorage.getItem(
        ACCESS_TOKEN_STORAGE_KEY,
      );
      const refreshToken = window.localStorage.getItem(
        REFRESH_TOKEN_STORAGE_KEY,
      );

      if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`);
      if (refreshToken) config.headers.set("refresh-token", refreshToken);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const persistTokensFromResponse = (response: { data?: any; headers: any }) => {
  const accessToken =
    response.data?.accessToken || response.headers?.["x-access-token"];
  const refreshToken =
    response.data?.refreshToken || response.headers?.["x-refresh-token"];

  if (isAppleDevice() && (accessToken || refreshToken)) {
    setAuthTokens(accessToken, refreshToken);
  }
};

// Response interceptor
api.interceptors.response.use(
  (response) => {
    persistTokensFromResponse(response);
    return response;
  },

  async (error: AxiosError<any>) => {
    if (error.response) {
      persistTokensFromResponse(error.response);
    }

    const config = error.config as RetryConfig | undefined;

    if (!config || config._retry) {
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.error;

    // ✅ Only retry for this specific backend error
    if (errorCode === "Error_RetryAndLogout") {
      config._retry = true;

      // ⏳ Optional delay (e.g. 500ms)
      await sleep(1000);

      return api(config);
    }

    if (errorCode === "Error_AuthNotFound") {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  },
);

export default api;
