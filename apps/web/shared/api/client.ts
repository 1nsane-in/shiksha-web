import type { AxiosRequestConfig } from "axios";
import { api as axiosInstance } from "./axios";

export const client = {
  get<T>(endpoint: string, config?: AxiosRequestConfig) {
    return axiosInstance.get<T>(endpoint, config).then((r) => r.data);
  },
  post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.post<T>(endpoint, data, config).then((r) => r.data);
  },
  put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.put<T>(endpoint, data, config).then((r) => r.data);
  },
  patch<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.patch<T>(endpoint, data, config).then((r) => r.data);
  },
  delete<T>(endpoint: string, config?: AxiosRequestConfig) {
    return axiosInstance.delete<T>(endpoint, config).then((r) => r.data);
  },
};
