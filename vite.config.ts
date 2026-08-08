import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import path from "node:path";
import fs from "node:fs";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
    tsconfigPaths(),
    tailwindcss(),
    nitro({
      preset: process.env.NITRO_PRESET || "vercel",
      hooks: {
        compiled(nitroInstance) {
          try {
            const vercelIndex = path.resolve(nitroInstance.options.output.dir, "static/index.html");
            if (fs.existsSync(vercelIndex)) {
              fs.unlinkSync(vercelIndex);
            }
            const publicIndex = path.resolve(nitroInstance.options.output.publicDir, "index.html");
            if (fs.existsSync(publicIndex)) {
              fs.unlinkSync(publicIndex);
            }
          } catch (e) {
            console.warn("Failed to remove static index.html:", e);
          }
        },
      },
    }),
  ],
});
