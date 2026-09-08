import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Use the repository subpath on GitHub Pages, but root paths everywhere else (e.g. Vercel).
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig(() => ({
  base: isGitHubActions ? "/smart-bill-checker-main/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
