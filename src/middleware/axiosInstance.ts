import axios from "axios";
import { makeStore } from "../redux/store";
import { saveNewTokens } from "../redux/features/auth/authSlice";

const { store } = makeStore();

// Axios instance setup
const privateAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  withCredentials: true,
});

// publicAxios.interceptors.request.use(
//   (config) => {
//     config.headers["Content-Type"] = "application/json";
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Request interceptor for privateAxios
privateAxios.interceptors.request.use(
  (config) => {
    const state = store.getState();

    const accessToken = state.auth.accessToken;
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor for privateAxios
privateAxios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const state = store.getState();
    const oldRefreshToken = state.auth.refreshToken;

    if (error.response?.status === 401 && oldRefreshToken) {
      console.log("401 Unauthorized error occurred");
      try {
        const response = await getNewTokens(oldRefreshToken);
        console.log("New tokens response:", response);

        store.dispatch(
          saveNewTokens({
            accessToken: response.token,
            refreshToken: oldRefreshToken,
          })
        );
        error.config.headers["Authorization"] = `Bearer ${response.token}`;
        console.log("Retrying request with new token");
        return privateAxios(error.config);
      } catch (tokenError) {
        console.error("Token refresh failed:", tokenError);

        // window.location.href = "/signin";
        return Promise.reject(tokenError);
      }
    }

    console.error("Response error:", error);
    // Propagate any other error
    return Promise.reject(error);
  }
);

const getNewTokens = async (
  refreshToken: string
): Promise<{ token: string }> => {
  try {
    const response = await publicAxios.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: "Bearer " + refreshToken,
        },
      }
    );
    return response.data; // Assuming the API returns { token }
  } catch (error: any) {
    console.error("Error refreshing tokens:", error.response?.data || error);
    throw error; // Propagate the error to be handled in the calling function
  }
};

export { privateAxios, publicAxios };
