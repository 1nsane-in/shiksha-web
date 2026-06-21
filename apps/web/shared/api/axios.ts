import axios from "axios";
import { API_URL } from "./constants";
import { useAuthStore } from "@/stores/auth-store";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'object' && 'ok' in response.data) {
    if (response.data.ok === true) {
      const { ok: _, ...rest } = response.data;
      // If the payload has a nested `data` key AND nothing else meaningful, unwrap it.
      // Otherwise keep the full body (e.g. paginated { data: [], meta: {} }).
      const keys = Object.keys(rest);
      response.data = keys.length === 1 && keys[0] === 'data' ? rest.data : rest;
    }
  }
  return response;
});

api.interceptors.request.use((config) => {
  config.headers["X-Api-Version"] = "1";
  const token = useAuthStore.getState().access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data: refreshData } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const body = refreshData?.ok === true ? refreshData.data : refreshData;
        const newToken = body?.accessToken;

        // Update zustand store -> this also updates the `token` cookie for middleware
        useAuthStore.getState().setTokens(newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
