import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api ki saari requests Spring Boot (8080) ko forward hongi -> CORS ka tension nahi
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": "http://localhost:8080" } },
});
