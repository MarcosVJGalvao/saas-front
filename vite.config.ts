import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';

const NGROK_SKIP_BROWSER_WARNING_HEADER = 'ngrok-skip-browser-warning';
const NGROK_SKIP_BROWSER_WARNING_VALUE = 'true';

const normalizeApiUrl = (apiUrl: string | undefined): string | undefined => {
  if (apiUrl === undefined) {
    return undefined;
  }
  const normalizedApiUrl = apiUrl.trim().replace(/\/+$/, '');
  return normalizedApiUrl.length > 0 ? normalizedApiUrl : undefined;
};

const isNgrokUrl = (apiUrl: string): boolean => /(^https?:\/\/)?([^.]+\.)*ngrok(-free)?\./i.test(apiUrl);

const createProxyEntry = (apiUrl: string) => {
  const proxyHeaders = isNgrokUrl(apiUrl)
    ? { [NGROK_SKIP_BROWSER_WARNING_HEADER]: NGROK_SKIP_BROWSER_WARNING_VALUE }
    : undefined;

  return {
    target: apiUrl,
    changeOrigin: true,
    ...(proxyHeaders === undefined ? {} : { headers: proxyHeaders }),
  };
};

const manualChunks = (id: string): string | undefined => {
  if (!id.includes('node_modules')) {
    return undefined;
  }

  if (id.includes('@mui/x-date-pickers') || id.includes('date-fns')) {
    return 'mui-date';
  }

  if (
    id.includes('@mui/material') ||
    id.includes('@mui/icons-material') ||
    id.includes('@emotion')
  ) {
    return 'mui-core';
  }

  if (id.includes('react-router-dom')) {
    return 'router';
  }

  if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
    return 'forms';
  }

  if (id.includes('axios')) {
    return 'network';
  }

  if (id.includes('react') || id.includes('react-dom')) {
    return 'react-core';
  }

  return 'vendor';
};

const apiUrl = normalizeApiUrl(process.env.API_URL ?? process.env.VERCEL_API_URL);
const proxy =
  apiUrl === undefined
    ? undefined
    : {
        '/api': createProxyEntry(apiUrl),
        '/socket.io': {
          ...createProxyEntry(apiUrl),
          ws: true,
        },
      };

export const viteConfig = defineConfig({
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src/app/pwa',
      filename: 'service-worker.ts',
      strategies: 'injectManifest',
      manifest: false,
      registerType: 'prompt',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@theme': path.resolve(__dirname, 'src/app/theme'),
    },
  },
  define: {
    'import.meta.env.API_URL': JSON.stringify(apiUrl ?? ''),
  },
  ...(proxy === undefined ? {} : { server: { proxy } }),
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
});

export default viteConfig;
