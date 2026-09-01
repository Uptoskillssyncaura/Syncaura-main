import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axios";

export const fetchChannels = createAsyncThunk(
  "chat/fetchChannels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/channels");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages/${channelId}`);
      return { channelId, messages: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createPrivateChat = createAsyncThunk(
  "chat/createPrivateChat",
  async (otherUserId, { rejectWithValue }) => {
    try {
      const response = await api.post("/channels/private", { otherUserId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createGroupChat = createAsyncThunk(
  "chat/createGroupChat",
  async ({ name, userIds }, { rejectWithValue }) => {
    try {
      const response = await api.post("/channels/group", { name, userIds });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const sendMediaMessage = createAsyncThunk(
  "chat/sendMediaMessage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/messages/send-media", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateGroup = createAsyncThunk(
  "chat/updateGroup",
  async ({ channelId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/channels/${channelId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addMembersToGroup = createAsyncThunk(
  "chat/addMembersToGroup",
  async ({ channelId, userIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/channels/${channelId}/members`, { userIds });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeMemberFromGroup = createAsyncThunk(
  "chat/removeMemberFromGroup",
  async ({ channelId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/channels/${channelId}/members/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
