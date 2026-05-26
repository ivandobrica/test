const CACHE_NAME = 'reel-bookmarks-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', (event) => {
  // Let all requests pass through to the network
  // We mainly need the SW for PWA installability and share target
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
})
