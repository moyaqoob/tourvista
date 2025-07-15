import { defineConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import react from "@vitejs/plugin-react"
import {reactRouter} from "@react-router/dev/vite"

export default defineConfig({
  plugins:[react(),reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app")
    }
  },
});