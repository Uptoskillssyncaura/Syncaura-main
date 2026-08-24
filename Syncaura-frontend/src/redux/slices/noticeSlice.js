import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotices,
  fetchNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../features/noticeThunks";

const initialState = {
  notices: [],
  notice: null,
  isLoading: false,
  error: null,
};

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    clearNotice(state) {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all notices
      .addCase(fetchNotices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload?.data || action.payload;
        state.notices = Array.isArray(data) ? data : [];
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch single notice
      .addCase(fetchNoticeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNoticeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notice = action.payload?.data || action.payload;
      })
      .addCase(fetchNoticeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create notice
      .addCase(createNotice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        const newNotice = action.payload?.data || action.payload;
        if (newNotice) {
          state.notices = Array.isArray(state.notices)
            ? [newNotice, ...state.notices]
            : [newNotice];
        }
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update notice
      .addCase(updateNotice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedNotice = action.payload?.data || action.payload;
        if (updatedNotice && Array.isArray(state.notices)) {
          state.notices = state.notices.map((n) =>
            n._id === updatedNotice._id ? updatedNotice : n
          );
        }
      })
      .addCase(updateNotice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete notice
      .addCase(deleteNotice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(state.notices)) {
          state.notices = state.notices.filter(
            (n) => n._id !== action.meta.arg
          );
        }
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotice } = noticeSlice.actions;
export default noticeSlice.reducer;