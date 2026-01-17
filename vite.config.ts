import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl()],
    build: {
        outDir: "docs"
    },
    server: {
        https: true,
    },
    // Use /Monopoly/ for GitHub Pages, / for Vercel
    base: process.env.VITE_BASE_PATH || "/",
});
