import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDocuments,
  createDocument,
  deleteDocument,
  updateDocument,
  fetchDocumentVersions,
} from "../features/documentThunks";

const initialState = {
  documents: [],
  documentVersions: {},
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    resetDocuments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : action.payload?.message || "Failed to fetch documents";
      })

      // Create
      .addCase(createDocument.pending, (state) => {
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        const newDoc = action.payload?.document || action.payload;
        if (newDoc && typeof newDoc === "object") {
          state.documents.unshift(newDoc);
        }
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.error = typeof action.payload === "string" ? action.payload : action.payload?.message || "Failed to create document";
      })

      // Update
      .addCase(updateDocument.fulfilled, (state, action) => {
        const updated = action.payload?.document || action.payload;
        if (updated) {
          const uId = updated.id || updated._id;
          state.documents = state.documents.map((d) => ((d.id || d._id) === uId ? updated : d));
        }
      })

      // Delete
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => (doc.id || doc._id) !== action.payload
        );
      })

      // Versions
      .addCase(fetchDocumentVersions.fulfilled, (state, action) => {
        const { id, versions } = action.payload;
        state.documentVersions[id] = versions;
      });
  },
});

export const { resetDocuments } = documentSlice.actions;
export default documentSlice.reducer;
