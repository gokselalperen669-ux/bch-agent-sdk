import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:4000',
      '/agents': 'http://localhost:4000',
      '/wallets': 'http://localhost:4000',
      '/public': 'http://localhost:4000',
      '/health': 'http://localhost:4000',
    }
  }
})
