self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests, let everything else pass through
  if (!event.request.url.startsWith(self.location.origin)) return

  // For navigation requests, always go to network
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request))
    return
  }

  // For other requests, try network first
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('', { status: 408 })
    })
  )
})