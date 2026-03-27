import BASE_URL from "@/config/base-url";
import { store } from "@/store/store";
import { logout } from "@/store/auth/authSlice";
import axios from "axios";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const isLoginRequest = config.url?.includes("web-login");
    const state = store.getState();
    const token = state.auth?.token;

    if (token && !isLoginRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isLoginRequest = error.config?.url?.includes("web-login");

    if (status === 401 && !isLoginRequest && window.location.pathname !== "/") {
      localStorage.clear();
      store.dispatch(logout());
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
