import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `--mode pages` = build para GitHub Pages em subpasta (r0jasdari0.github.io/girassol-pizzaria/).
// Com domínio próprio, basta buildar sem esse modo (base "/").
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "pages" ? "/girassol-pizzaria/" : "/",
  server: { host: true },
}));
