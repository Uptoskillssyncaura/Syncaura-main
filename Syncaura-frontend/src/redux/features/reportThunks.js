import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axios";

// 1️⃣ Fetch task report
export const fetchTaskReport = createAsyncThunk(
  "reports/fetchTaskReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { projectId, status, priority } = params;
      const queryParams = new URLSearchParams();
      
      if (projectId) queryParams.append("projectId", projectId);
      if (status) queryParams.append("status", status);
      if (priority) queryParams.append("priority", priority);
      
      const queryString = queryParams.toString();
      const url = `/reports/tasks${queryString ? `?${queryString}` : ""}`;
      
      const res = await api.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch task report");
    }
  }
);

// 2️⃣ Fetch project progress
export const fetchProjectProgress = createAsyncThunk(
  "reports/fetchProjectProgress",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/reports/progress");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch project progress");
    }
  }
);

// 3️⃣ Fetch document summary
export const fetchDocumentSummary = createAsyncThunk(
  "reports/fetchDocumentSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/reports/documents");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch document summary");
    }
  }
);