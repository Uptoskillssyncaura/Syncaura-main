import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  changePassword,
  refreshAccessToken,
  fetchUserProfile,
  updateUserProfile,
} from "../features/authThunks";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storedToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  token: storedToken,
  isLoading: false,
  error: null,
  isAuthenticated: !!storedToken,
  authChecking: !!storedToken && !storedUser,
  profileLoading: false,
  localProfilePic: localStorage.getItem("syncaura_global_photo") || null, // 👈 Independent photo state
};

const getPhotoStorageKey = (user) => {
  return "syncaura_active_user_profile_photo";
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
      if (user) {
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch {}
      }
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("token", token);
      }
      const key = getPhotoStorageKey(user);
      if (key && state.user) {
        const savedPhoto = localStorage.getItem(key);
        if (savedPhoto) state.user.profilePic = savedPhoto;
      }
    },
    logout(state) {
      state.isLoading = true;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authChecking = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.isLoading = false;
    },
    updateFrontendProfilePhoto(state, action) {
      if (action.payload) {
        localStorage.setItem("syncaura_global_photo", action.payload);
        state.localProfilePic = action.payload;
        if (state.user) state.user.profilePic = action.payload;
      } else {
        localStorage.removeItem("syncaura_global_photo");
        state.localProfilePic = null;
        if (state.user) state.user.profilePic = null;
      }
    }
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
        const user = action.payload?.user;
        const token = action.payload?.token || action.payload?.tokens?.accessToken || action.payload?.accessToken;
        const refreshToken = action.payload?.refreshToken || action.payload?.tokens?.refreshToken;
        
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        
        if (user) {
          try {
            localStorage.setItem("user", JSON.stringify(user));
          } catch {}
        }
        if (token) localStorage.setItem("accessToken", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        const key = getPhotoStorageKey(user);
        if (key && state.user) {
          const savedPhoto = localStorage.getItem(key);
          if (savedPhoto) {
            state.user.profilePic = savedPhoto;
          }
        }
        if (state.user && state.localProfilePic) {
          state.user.profilePic = state.localProfilePic;
        }
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
        const user = action.payload?.user;
        const token = action.payload?.token || action.payload?.tokens?.accessToken || action.payload?.accessToken;
        const refreshToken = action.payload?.refreshToken || action.payload?.tokens?.refreshToken;
        
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;

        if (user) {
          try {
            localStorage.setItem("user", JSON.stringify(user));
          } catch {}
        }
        if (token) localStorage.setItem("accessToken", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        const key = getPhotoStorageKey(user);
        if (key && state.user) {
          const savedPhoto = localStorage.getItem(key);
          if (savedPhoto) {
            state.user.profilePic = savedPhoto;
          }
        }
        if (state.user && state.localProfilePic) {
          state.user.profilePic = state.localProfilePic;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Refresh Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.authChecking = !state.user;
        state.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        if (state.user && state.localProfilePic) {
          state.user.profilePic = state.localProfilePic;
        }
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.authChecking = false;
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
      })

      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        const profile = action.payload?.user || action.payload?.data || action.payload;
        state.user = profile;
        state.authChecking = false;  
        
        if (profile) {
          try {
            localStorage.setItem("user", JSON.stringify(profile));
          } catch {}
        }

        if (state.user) {
          const key = getPhotoStorageKey(profile);
          if (key) {
            const savedPhoto = localStorage.getItem(key);
            if (savedPhoto) state.user.profilePic = savedPhoto;
          }
        } 
        if (state.user && state.localProfilePic) {
          state.user.profilePic = state.localProfilePic;
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.profileLoading = false;
        state.authChecking = false;
      })

      // Update User Profile
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
        if (state.user) {
          try {
            localStorage.setItem("user", JSON.stringify(state.user));
          } catch {}
        }
        const key = getPhotoStorageKey(state.user);
        if (key && state.user) {
          const savedPhoto = localStorage.getItem(key);
          if (savedPhoto) state.user.profilePic = savedPhoto;
        }
        if (state.user && state.localProfilePic) {
          state.user.profilePic = state.localProfilePic;
        }
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
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user && state.localProfilePic) {
          state.user.profilePic = state.localProfilePic;
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, setCredentials, logout, updateFrontendProfilePhoto } = authSlice.actions;
export default authSlice.reducer;
