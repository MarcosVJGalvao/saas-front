import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export const viteConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@forms': path.resolve(__dirname, 'src/forms'),
      '@errors': path.resolve(__dirname, 'src/errors'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@theme': path.resolve(__dirname, 'src/theme'),
    },
  },
});

export default viteConfig;
