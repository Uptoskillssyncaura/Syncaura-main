import  api  from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createMeeting = createAsyncThunk(
  "meeting/createMeeting",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/meetings/",data);
      const meeting = res.data.meeting;

      return {
        ...res.data,
        meeting: {
          ...meeting,
          startTime: meeting.start_time,
          endTime: meeting.end_time,
          googleEventId: meeting.google_event_id,
          googleMeetLink: meeting.google_meet_link,
        },
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to create meeting",
      );
    }
  },
);

// export const getMeetings = createAsyncThunk(
//   "meeting/getMeetings",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/meetings/");
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || " failed to fetch all meetings",
//       );
//     }
//   },
// );

export const getMeetings = createAsyncThunk(
  "meeting/getMeetings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/meetings/");

      return res.data.map((meeting) => ({
        ...meeting,
        startTime: meeting.start_time,
        endTime: meeting.end_time,
        googleEventId: meeting.google_event_id,
        googleMeetLink: meeting.google_meet_link,
      }));
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch all meetings",
      );
    }
  },
);

export const getMeetingById = createAsyncThunk(
  "meeting/getMeetingById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/meetings/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to fetch meeting by id",
      );
    }
  },
);


export const updateMeetingById = createAsyncThunk(
  "meeting/updateMeetingById",
  async ({id, data}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/meetings/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to update meeting by id",
      );
    }
  },
);


export const deleteMeetingById = createAsyncThunk(
  "meeting/deleteMeetingById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/meetings/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || " failed to delete meeting by id",
      );
    }
  },
);

export const syncCalendarEvents = createAsyncThunk(
  "meeting/syncCalendarEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/meetings/sync-calendar");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to sync calendar",
      );
    }
  },
);


