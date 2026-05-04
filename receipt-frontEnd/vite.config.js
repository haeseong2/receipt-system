import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,

    allowedHosts: ["cattishly-tag-spongy.ngrok-free.dev"],

    cors: true,

    hmr: {
    clientPort: 443
    },

    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true
      },
      '/images': {
        target: 'http://backend:8080',
        changeOrigin: true
      }
    }
  }
})