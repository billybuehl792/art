import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
    ],
    server: {
      host: "127.0.0.1",
      port: 5174,
      strictPort: true,
      proxy: {
        "/api": { target: env.VITE_API_URL, changeOrigin: true },
        "/uploads": { target: env.VITE_API_URL, changeOrigin: true },
      },
    },
    build: {
      sourcemap: true, // Source map generation must be turned on for Sentry
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules") && !id.includes("sentry"))
              return id.split("node_modules/")[1].split("/")[0];
          },
        },
      },
    },
    resolve: {
      alias: { "@": path.resolve(import.meta.dirname, "src") },
    },
  };
});
