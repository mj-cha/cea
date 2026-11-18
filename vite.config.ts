import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import studio from "./studio/vite-plugin.mjs"; /* 검수 스튜디오: 개발·미리보기 서버에서만 /__studio/ */

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), studio()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
