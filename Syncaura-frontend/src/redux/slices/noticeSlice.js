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
      .addCase(fetchNotices.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchNotices.fulfilled, (state, action) => { state.isLoading = false; state.notices = action.payload.data; })
      .addCase(fetchNotices.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchNoticeById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchNoticeById.fulfilled, (state, action) => { state.isLoading = false; state.notice = action.payload.data; })
      .addCase(fetchNoticeById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createNotice.pending, (state) => { state.isLoading = true; })
      .addCase(createNotice.fulfilled, (state, action) => { state.isLoading = false; state.notices.unshift(action.payload.data); })
      .addCase(createNotice.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(updateNotice.pending, (state) => { state.isLoading = true; })
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notices = state.notices.map((n) => n._id === action.payload.data._id ? action.payload.data : n);
      })
      .addCase(updateNotice.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(deleteNotice.pending, (state) => { state.isLoading = true; })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notices = state.notices.filter((n) => n._id !== action.meta.arg);
      })
      .addCase(deleteNotice.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearNotice } = noticeSlice.actions;
export default noticeSlice.reducer;