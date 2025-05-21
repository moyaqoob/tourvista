import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    watch: {
      usePolling: true, // Forces Vite to check for changes using polling
      interval: 100,    // Adjust polling interval for better responsiveness
    },
    host: true,          // Ensures the server is accessible from other devices
    open: true,          // Automatically opens the browser on server start
  },
});
