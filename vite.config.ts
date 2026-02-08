import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api/gpt4all': {
        target: 'http://localhost:4891',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gpt4all/, '')
      }
    }
  },
  plugins: [
    react(),
  ],
});
