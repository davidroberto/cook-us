import path from "node:path";
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@src": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true,
    },
    hmr: {
      host: process.env.SERVER_NAME || 'localhost',
      protocol: 'ws',
    },
    allowedHosts: [process.env.SERVER_NAME || 'localhost'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
