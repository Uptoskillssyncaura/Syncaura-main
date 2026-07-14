import axios from "axios";

const api = axios.create({
  // Use relative URL so Vite proxy forwards /api/* to backend (no CORS issues).
  // In production, set VITE_API_URL to your deployed backend URL.
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
  withCredentials: true,
});

// Request interceptor: attach accessToken to headers
api.interceptors.request.use(
  (config) => {
    // Read accessToken first (set by authSlice), fall back to legacy "token" key
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: handle token refresh automatically on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints or if request has already been retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register") &&
      !originalRequest.url.includes("/auth/refresh")
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
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        // Call token refresh using plain axios to avoid the main interceptor
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Refresh token failed -> clear auth data and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Dispatch custom event to notify Redux/App or trigger window redirect
        window.dispatchEvent(new Event("auth_session_expired"));
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
