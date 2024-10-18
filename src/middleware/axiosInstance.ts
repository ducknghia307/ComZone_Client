import axios from "axios";
import { makeStore } from "../redux/store";

const { store } = makeStore();

// Axios instance setup
const privateAxios = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

const publicAxios = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

publicAxios.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for privateAxios
privateAxios.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for privateAxios
privateAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();
    const oldRefreshToken = state.auth.refreshToken;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { token } = await getNewTokens(oldRefreshToken);
        if (token) {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;

          return privateAxios(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        // Handle refresh token failure, redirect to login or show error
        console.error("Error refreshing token:", refreshError);
        window.location.href = "/signin"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // Propagate any other error
  }
);

const getNewTokens = async (accessToken: string) => {
  return await privateAxios.post("/auth/refresh", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};
export { privateAxios, publicAxios };
