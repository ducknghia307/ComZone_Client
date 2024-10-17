import axios from "axios";

// Axios instance setup
const privateAxios = axios.create({
  baseURL: "http://localhost:3000/", // Change to your production base URL
  withCredentials: true,
});

const publicAxios = axios.create({
  baseURL: "http://localhost:3000/", // Change to your production base URL
  withCredentials: true,
});

// Check if the code is running in the browser
const isBrowser = typeof document !== "undefined";

// Function to save tokens as cookies
export const saveTokens = (accessToken, refreshToken) => {
  if (isBrowser) {
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`; // 1 week
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`; // 1 week
  }
};

// Function to set Authorization token
export const setAuthToken = (token) => {
  if (token) {
    privateAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete privateAxios.defaults.headers.common["Authorization"];
  }
};

// Function to retrieve token from cookies
const getTokenFromCookies = (tokenName) => {
  if (isBrowser) {
    const cookieArr = document.cookie.split(";");
    let token = null;
    cookieArr.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name === tokenName) {
        token = value;
      }
    });
    return token;
  }
  return null;
};

// Set the initial token if it exists
if (isBrowser) {
  setAuthToken(getTokenFromCookies("accessToken"));
}

// Request interceptor for publicAxios
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

    // Handle token refresh if 401 or 403 is received
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getTokenFromCookies("refreshToken");
        const response = await privateAxios.post(
          "/auth/refresh",
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const newAccessToken = response.data.accessToken;

        // Save the new access token in cookies
        if (isBrowser) {
          saveTokens(newAccessToken, refreshToken);
        }

        setAuthToken(newAccessToken); // Update the authorization header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return privateAxios(originalRequest); // Retry the original request
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

export { privateAxios, publicAxios };
