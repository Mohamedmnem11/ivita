import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api-stage.ivitasa.com', // الـ backend الحقيقي
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // يحذف /api من أول الرابط
      },
    },
  },
});
