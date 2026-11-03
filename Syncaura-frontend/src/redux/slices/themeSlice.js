import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("isDark");
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    // Check system preference if no saved theme
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

const initialState = {
  isDark: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleThemeMethod: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem("isDark", JSON.stringify(state.isDark));
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
      localStorage.setItem("isDark", JSON.stringify(state.isDark));
    }
  }
});

export const { toggleThemeMethod, setTheme } = themeSlice.actions;
export default themeSlice.reducer;