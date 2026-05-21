/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'app-static-assets',
  }),
);

registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'app-font-assets',
  }),
);

registerRoute(
  ({ request }) => request.destination === 'image' || request.url.endsWith('/manifest.webmanifest'),
  new StaleWhileRevalidate({
    cacheName: 'app-visual-assets',
  }),
);

self.addEventListener('message', (event) => {
  const messageData: unknown = event.data;
  if (typeof messageData !== 'object' || messageData === null) {
    return;
  }

  if ('type' in messageData && messageData.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});

// Base preparada para push notifications futuras.
// Extensões previstas:
// - escutar `push`
// - tratar `notificationclick`
// - sincronizar preferências e assinaturas com o backend
