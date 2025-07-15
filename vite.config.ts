import { defineConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app")
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      }
    }
  }
});