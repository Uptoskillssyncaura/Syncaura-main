import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTaskReport,
  fetchProjectProgress,
  fetchDocumentSummary,
} from "../features/reportThunks";

const initialState = {
  taskReport: null,
  projectProgress: null,
  documentSummary: null,
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    resetReports: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Task Report
      .addCase(fetchTaskReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskReport.fulfilled, (state, action) => {
        state.loading = false;
        state.taskReport = action.payload;
      })
      .addCase(fetchTaskReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Project Progress
      .addCase(fetchProjectProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.projectProgress = action.payload;
      })
      .addCase(fetchProjectProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Document Summary
      .addCase(fetchDocumentSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.documentSummary = action.payload;
      })
      .addCase(fetchDocumentSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReports } = reportSlice.actions;
export default reportSlice.reducer;