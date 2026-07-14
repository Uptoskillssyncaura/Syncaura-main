import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axios";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/tasks");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks", taskData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete task");
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status });
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

export const addSubtask = createAsyncThunk(
  "tasks/addSubtask",
  async ({ taskId, title }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/tasks/${taskId}/subtasks`, { title });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add subtask");
    }
  }
);
