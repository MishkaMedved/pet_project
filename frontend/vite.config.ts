import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the API and uploaded files are served by Spring Boot on :8080.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080',
    },
  },
});
