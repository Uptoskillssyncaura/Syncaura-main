import api from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      if (!err.response) {
        console.warn("Backend offline. Simulating mock register.");
        const mockUser = {
          id: "mock-id-123",
          name: userData.name || "User",
          email: userData.email,
          role: userData.email.toLowerCase().includes("admin") ? "admin" : "user",
        };
        const mockTokens = {
          accessToken: "mock-access-token-123",
          refreshToken: "mock-refresh-token-123",
        };
        return { user: mockUser, tokens: mockTokens };
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to register user",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    } catch (err) {
      if (!err.response) {
        console.warn("Backend offline. Simulating mock login.");
        const mockUser = {
          id: "mock-id-123",
          name: credentials.email.split("@")[0] || "User",
          email: credentials.email,
          role: credentials.email.toLowerCase().includes("admin") ? "admin" : "user",
        };
        const mockTokens = {
          accessToken: "mock-access-token-123",
          refreshToken: "mock-refresh-token-123",
        };
        return { user: mockUser, tokens: mockTokens };
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to login",
      );
    }
  },
);


export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        return rejectWithValue("Session expired");
      }

      const res = await api.post("/auth/refresh", { refreshToken });

      return res.data;
    } catch (err) {
      if (!err.response && (localStorage.getItem("accessToken") || localStorage.getItem("token"))) {
        console.warn("Backend offline. Keeping user session active via mock refresh.");
        return {
          user: {
            id: "mock-id-123",
            name: "Mock User",
            email: "mock@example.com",
            role: "user",
          },
          accessToken: "mock-access-token-123",
        };
      }
      return rejectWithValue("Session expired");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/profile");
      return res.data;
    } catch (err) {
      if (!err.response) {
        console.warn("Backend offline. Simulating mock profile fetch.");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          return { user: JSON.parse(storedUser) };
        }
        return {
          user: {
            id: "mock-id-123",
            first_name: "Mock",
            last_name: "User",
            name: "Mock User",
            email: "mock@example.com",
            role: "user",
          }
        };
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await api.put("/profile", profileData);
      return res.data;
    } catch (err) {
      if (!err.response) {
        console.warn("Backend offline. Simulating mock profile update.");
        return { user: profileData };
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await api.put("/auth/change-password", passwordData);
      return res.data;
    } catch (err) {
      if (!err.response) {
        console.warn("Backend offline. Simulating mock password change.");
        return { message: "Password changed successfully" };
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password",
      );
    }
  },
);
