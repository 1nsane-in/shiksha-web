import axios from "axios";
import { API_URL, STORAGE_KEYS } from "./constants";
import { storage } from "./storage";

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

function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `token=${token}; path=/; max-age=${15 * 60}; SameSite=Lax`;
}

function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "token=; path=/; max-age=0";
}

type AuthStorage = {
  state: {
    user: unknown;
    token: string | null;
  };
};

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = storage.get<AuthStorage>(STORAGE_KEYS.AUTH_STORAGE);
    const token = auth?.state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;

        const current = storage.get<AuthStorage>(STORAGE_KEYS.AUTH_STORAGE);
        storage.set(STORAGE_KEYS.AUTH_STORAGE, {
          state: {
            ...current?.state,
            token: newToken,
          },
        });
        setTokenCookie(newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        storage.remove(STORAGE_KEYS.AUTH_STORAGE);
        clearTokenCookie();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
