import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://attendance-system-b9lx.onrender.com',
        changeOrigin: true,
      },
    }
  }
})
