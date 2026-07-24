import { defineConfig } from '@lovable.dev/vite-tanstack-config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
  },
  nitro: false,
})