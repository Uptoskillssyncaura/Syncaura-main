
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axios"; 

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications/unread/count");
      return res.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.patch("/notifications/mark-all-read");
      return res.data.modifiedCount;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  "notifications/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.delete("/notifications");
      return res.data.deletedCount;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
