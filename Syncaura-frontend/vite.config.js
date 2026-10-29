import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/auth/google": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/health": {                 // 👈 Add this
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});