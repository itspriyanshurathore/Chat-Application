import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://chat-application-01rr.onrender.com/api/users", // 👈 MUST match backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
