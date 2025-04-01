import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiUrl = env.VITE_API_URL ?? "http://localhost:3000/ganjafarm/";
  const backendUrl = env.VITE_BACKEND_URL ?? "http://localhost:3000/v1/";

  console.log(apiUrl, backendUrl);

  return {
    plugins: [react()],
    base: "/ganja-farm-vibe-jam/",
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/backend": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend/, ""),
        },
      },
    },
  };
});
