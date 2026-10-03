import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    // Sans cette ligne, vitest.setup.ts n'est jamais charge et aucun matcher
    // jest-dom n'est enregistre : toBeInTheDocument remonte en
    // « Invalid Chai property ». C'est ce qui cassait 59 tests.
    setupFiles: ["./vitest.setup.ts"],
  },
});
