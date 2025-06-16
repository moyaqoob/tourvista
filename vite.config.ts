import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from "@react-router/dev/vite";

// Import the SSR plugin (see references for install instructions)

export default defineConfig(config => {
  return {
    plugins: [tailwindcss(), tsconfigPaths(), reactRouter()],
    ssr: {
      noExternal: [/@syncfusion/]
    }
  };
});