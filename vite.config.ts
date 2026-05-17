import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export const viteConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@theme': path.resolve(__dirname, 'src/app/theme'),
    },
  },
});

export default viteConfig;
