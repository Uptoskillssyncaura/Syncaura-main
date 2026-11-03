import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;  