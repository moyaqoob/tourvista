import { reactRouter } from "@react-router/dev/vite";

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app")
    }
  },
  build: {
    outDir: "build/client",
    sourcemap: true
  }
});
