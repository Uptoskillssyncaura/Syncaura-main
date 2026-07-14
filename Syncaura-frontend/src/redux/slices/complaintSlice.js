import { createSlice } from "@reduxjs/toolkit";
import {
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  addComment,
  deleteComplaint,
  getComplaintStats,
} from "../features/complaintThunks";

const initialState = {
  complaints: [],
  complaint: null,
  stats: null,
  isLoading: false,
  error: null,
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    clearComplaint(state) { state.complaint = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllComplaints.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(getAllComplaints.fulfilled, (state, action) => { state.isLoading = false; state.complaints = action.payload.data; })
      .addCase(getAllComplaints.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(getMyComplaints.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(getMyComplaints.fulfilled, (state, action) => { state.isLoading = false; state.complaints = action.payload.data; })
      .addCase(getMyComplaints.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(getComplaintById.pending, (state) => { state.isLoading = true; })
      .addCase(getComplaintById.fulfilled, (state, action) => { state.isLoading = false; state.complaint = action.payload.data; })
      .addCase(getComplaintById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createComplaint.pending, (state) => { state.isLoading = true; })
      .addCase(createComplaint.fulfilled, (state, action) => { state.isLoading = false; state.complaints.unshift(action.payload.data); })
      .addCase(createComplaint.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(updateComplaintStatus.pending, (state) => { state.isLoading = true; })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = state.complaints.map((c) => c._id === action.payload.data._id ? action.payload.data : c);
        if (state.complaint?._id === action.payload.data._id) state.complaint = action.payload.data;
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(addComment.pending, (state) => { state.isLoading = true; })
      .addCase(addComment.fulfilled, (state, action) => { state.isLoading = false; state.complaint = action.payload.data; })
      .addCase(addComment.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(deleteComplaint.pending, (state) => { state.isLoading = true; })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = state.complaints.filter((c) => c._id !== action.meta.arg);
        if (state.complaint?._id === action.meta.arg) state.complaint = null;
      })
      .addCase(deleteComplaint.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(getComplaintStats.pending, (state) => { state.isLoading = true; })
      .addCase(getComplaintStats.fulfilled, (state, action) => { state.isLoading = false; state.stats = action.payload.data; })
      .addCase(getComplaintStats.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearComplaint, clearError } = complaintSlice.actions;
export default complaintSlice.reducer;