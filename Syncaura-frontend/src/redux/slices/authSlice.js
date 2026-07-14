import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  changePassword,
  refreshAccessToken,
  fetchUserProfile,
  updateUserProfile,
} from "../features/authThunks";

const storedToken = localStorage.getItem("accessToken") || localStorage.getItem("token");

const initialState = {
  user: null,
  token: storedToken,
  isLoading: false,
  error: null,
  isAuthenticated: !!storedToken,
  authChecking: true,
  profileLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("token", token);
      }
    },
    logout(state) {
      state.isLoading = true;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authChecking = false;
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, tokens } = action.payload;
        state.user = user;
        state.token = tokens.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, tokens } = action.payload;
        state.user = user;
        state.token = tokens.accessToken;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.authChecking = true;
        state.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        const { user, accessToken } = action.payload;
        state.user = user;
        state.token = accessToken;
        state.isAuthenticated = true;
        state.authChecking=false
        localStorage.setItem("accessToken", accessToken);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.authChecking = false;
        state.isLoading=false
        state.isAuthenticated=false
        state.user=null
      })

      // User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        const profile = action.payload?.user || action.payload?.data || action.payload;
        state.user = profile;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        const profile = action.payload?.user || action.payload?.data || action.payload;
        state.user = {
          ...state.user,
          ...profile,
        };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })

     
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        // Password changed successfully, no need to update user data
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
