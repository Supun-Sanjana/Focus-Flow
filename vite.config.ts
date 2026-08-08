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
            const vercelDir = nitroInstance.options.output.dir;
            const serverFuncDir = path.resolve(vercelDir, "functions/__server.func");
            if (fs.existsSync(serverFuncDir)) {
              const vcConfigPath = path.resolve(serverFuncDir, ".vc-config.json");
              const vcConfig = {
                runtime: "nodejs20.x",
                handler: "index.mjs",
                launcherType: "Nodejs",
              };
              fs.writeFileSync(vcConfigPath, JSON.stringify(vcConfig, null, 2));
            }

            const vercelIndex = path.resolve(vercelDir, "static/index.html");
            if (fs.existsSync(vercelIndex)) {
              fs.unlinkSync(vercelIndex);
            }
            const publicIndex = path.resolve(nitroInstance.options.output.publicDir, "index.html");
            if (fs.existsSync(publicIndex)) {
              fs.unlinkSync(publicIndex);
            }
          } catch (e) {
            console.warn("Failed to configure Vercel output:", e);
          }
        },
      },
    }),
  ],
});
