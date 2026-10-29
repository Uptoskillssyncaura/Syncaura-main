import api from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to register user",
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
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to login",
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return rejectWithValue(
        err.response?.data?.message || "Session expired",
      );
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
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password",
      );
    }
  },
);

