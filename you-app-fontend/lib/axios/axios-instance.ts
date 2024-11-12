import { CombinedAxiosError } from "@/types";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: CombinedAxiosError) {
    if (
      error.response.status === 401 &&
      error.response.data.message ===
        "Unauthorized access. Please log in to continue."
    ) {
      localStorage.removeItem("access_token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);
