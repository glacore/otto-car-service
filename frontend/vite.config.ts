import { defineConfig } from "vite";

export default defineConfig({
  css: {
    postcss: "./postcss.config.cjs",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
