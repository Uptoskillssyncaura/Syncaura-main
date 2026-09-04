import { createSlice } from "@reduxjs/toolkit";

const initialState = {
theme: localStorage.getItem("app_theme") || "light",
font: localStorage.getItem("app_font") || "Arial",
fontSize: localStorage.getItem("app_fontSize") || "medium",
zoom: Number(localStorage.getItem("app_zoom")) || 100,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("app_theme", action.payload);
    },
    setFont: (state, action) => {
      state.font = action.payload;
      localStorage.setItem("app_font", action.payload);
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      localStorage.setItem("app_fontSize", action.payload);
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
      localStorage.setItem("app_zoom", action.payload);
    },
  },
});

export const { setTheme, setFont, setFontSize, setZoom } = uiSlice.actions;
export default uiSlice.reducer;