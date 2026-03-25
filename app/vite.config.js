import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: ["@anthropic-ai/sdk"],
    },
  },
  test: {
    globals: true,
    setupFiles: ["./src/test-setup.js"],
  },
});
