import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

// Precache all build assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'mila-images',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            return response;
          }
          return null;
        },
      },
    ],
  })
);

// Cache API calls with NetworkFirst strategy (for offline support)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'mila-api',
    networkTimeoutSeconds: 10,
  })
);

// Cache CSS/JS with StaleWhileRevalidate
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'mila-static-resources',
  })
);

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Optional: Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-field-data') {
    event.waitUntil(syncFieldData());
  }
});

async function syncFieldData() {
  // Sync any pending field data when connection is restored
  console.log('Syncing field data in background...');
}
