const CACHE_NAME = 'crypto-analyzer-v3';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/index-J6IEHsP5.css',
  '/assets/index-C-qCwbF9.js',
  '/assets/logo-C1yZkwJw.png',
  '/icons/logo.png',
  '/icons/web-app-manifest-192x192.png',
  '/icons/web-app-manifest-512x512.png'
];

// URLs that should always be fetched from network (no caching)
const NETWORK_ONLY_URLS = [
  '/api/',
  'https://fapi.binance.com/',
  'https://xcuubslgdlitnnkgbnza.supabase.co/',
  'https://platform.deepseek.com/'
];

// Install event - cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests with no caching for dynamic data
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Check if this URL should be network-only (no caching)
  const isNetworkOnly = NETWORK_ONLY_URLS.some(networkUrl =>
    url.href.includes(networkUrl) || url.pathname.startsWith('/api/')
  );

  if (isNetworkOnly) {
    // For dynamic data, always fetch from network
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, return a fallback response
          if (event.request.headers.get('accept')?.includes('application/json')) {
            return new Response(JSON.stringify({ error: 'Network error', offline: true }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response('Network error - please check your connection', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise, fetch from network
        return fetch(event.request).then(
          response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache the fetched response for future
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // If both cache and network fail, return offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          return new Response('Resource not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Handle background sync for when user comes back online
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Notify all clients about the connection status
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CONNECTION_STATUS',
            online: navigator.onLine
          });
        });
      })
    );
  }
});

// Handle push notifications (if needed in the future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/logo.png',
      badge: '/icons/web-app-manifest-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
