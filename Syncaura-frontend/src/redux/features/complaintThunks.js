import api from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllComplaints = createAsyncThunk(
  "complaint/getAllComplaints",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/complaints", { params: filters });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch complaints");
    }
  }
);

export const getMyComplaints = createAsyncThunk(
  "complaint/getMyComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/complaints/my-complaints");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your complaints");
    }
  }
);

export const getComplaintById = createAsyncThunk(
  "complaint/getComplaintById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/complaints/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch complaint");
    }
  }
);

export const createComplaint = createAsyncThunk(
  "complaint/createComplaint",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/complaints", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create complaint");
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  "complaint/updateComplaintStatus",
  async ({ id, status, resolution }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/complaints/${id}/status`, { status, resolution });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

export const addComment = createAsyncThunk(
  "complaint/addComment",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/complaints/${id}/comments`, { text });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add comment");
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaint/deleteComplaint",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/complaints/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete complaint");
    }
  }
);

export const getComplaintStats = createAsyncThunk(
  "complaint/getComplaintStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/complaints/stats");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
);