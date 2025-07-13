import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      '5173-i92upbiljug5mkncce2z8-a0734a7b.manusvm.computer',
      '5173-iayf1n02jnqsfrdcji87h-a0734a7b.manusvm.computer'
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
