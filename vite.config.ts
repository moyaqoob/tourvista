import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Import the SSR plugin (see references for install instructions)

export default defineConfig((config) => {
  return {
    plugins: [tailwindcss(), tsconfigPaths(), reactRouter()],
    ssr: {
      noExternal: [/@syncfusion/],
    },
    build: {
      outDir: "dist", 
    },
  };
});
