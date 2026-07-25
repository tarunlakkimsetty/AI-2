import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for AI Video Content Studio client
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to backend during local dev
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
