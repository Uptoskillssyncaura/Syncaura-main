
import { createSlice } from "@reduxjs/toolkit";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeetingById,
  deleteMeetingById,
  syncCalendarEvents,
} from "../features/meetingThunks.js";

const initialState = {
  meetings: [],
  meeting: null,
  isLoading: false,
  isSyncing: false,
  error: null,
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    clearMeeting(state) {
      state.meeting = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeeting.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        const newMeeting = action.payload.meeting || action.payload;
        state.meetings.unshift({
          ...newMeeting,
          _id: newMeeting.id || newMeeting._id || Date.now(),
        });
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

     
      .addCase(getMeetings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMeetings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetings = action.payload || [];
      })
      .addCase(getMeetings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(getMeetingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMeetingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meeting = action.payload;
      })
      .addCase(getMeetingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateMeetingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMeetingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meeting = action.payload;

        // update list also
        state.meetings = state.meetings.map((m) =>
          (m._id || m.id) === (action.payload._id || action.payload.id) ? action.payload : m
        );
      })
      .addCase(updateMeetingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteMeetingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMeetingById.fulfilled, (state, action) => {
        state.isLoading = false;

        state.meetings = state.meetings.filter(
          (m) => (m._id || m.id) !== action.payload
        );

        if ((state.meeting?._id || state.meeting?.id) === action.payload) {
          state.meeting = null;
        }
      })
      .addCase(deleteMeetingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(syncCalendarEvents.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncCalendarEvents.fulfilled, (state, action) => {
        state.isSyncing = false;
        if (action.payload?.meetings) {
          state.meetings = action.payload.meetings;
        }
      })
      .addCase(syncCalendarEvents.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
