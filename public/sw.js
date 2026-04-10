// ── public/sw.js ─────────────────────────────────────────────────────────────
// Vesimy Service Worker
// Handles: offline caching, background sync, push notifications (future)
// Strategy: Cache-first for static assets, Network-first for API calls

const CACHE_NAME    = 'vesimy-v3'
const OFFLINE_URL   = '/offline'

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// ── Install: pre-cache critical assets ───────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // If precache fails (e.g. offline during install), continue anyway
        return Promise.resolve()
      })
    }).then(() => self.skipWaiting())
  )
})

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// ── Fetch: smart caching strategy ────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Never intercept: auth, API calls, Supabase, Stripe, non-GET
  // Also never cache auth-dependent pages — they must always hit the network
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/project') ||
    url.pathname.startsWith('/onboarding') ||
    url.pathname.startsWith('/settings') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('stripe.com') ||
    url.hostname.includes('googleapis.com')
  ) {
    return // Let the browser handle it normally
  }

  // Next.js static chunks: Cache-first (they have content hashes, safe to cache long)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // App pages: Network-first with offline fallback
  // Try network, fall back to cache, fall back to offline page
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful page responses
        if (response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(request).then((cached) => {
          if (cached) return cached
          // Nothing in cache — show offline page
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match(OFFLINE_URL)
          }
          return new Response('Offline', { status: 503 })
        })
      })
  )
})

// ── Background Sync: queue failed saves when offline ─────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-saves') {
    event.waitUntil(syncPendingSaves())
  }
})

async function syncPendingSaves() {
  // Read from IndexedDB queue and retry failed API calls
  // This fires automatically when the device comes back online
  try {
    const db = await openOfflineDB()
    const pending = await getAllPending(db)
    for (const item of pending) {
      try {
        const response = await fetch(item.url, {
          method:  item.method,
          headers: item.headers,
          body:    item.body,
        })
        if (response.ok) await deletePending(db, item.id)
      } catch {
        // Still offline — leave in queue, will retry next sync
      }
    }
  } catch {
    // IndexedDB not available
  }
}

// ── Minimal IndexedDB helpers for offline queue ───────────────────────────────
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('vesimy-offline', 1)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess  = (e) => resolve(e.target.result)
    req.onerror    = ()  => reject(req.error)
  })
}

function getAllPending(db) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('pending', 'readonly')
    const req = tx.objectStore('pending').getAll()
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror   = ()  => reject(req.error)
  })
}

function deletePending(db, id) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction('pending', 'readwrite')
    const req = tx.objectStore('pending').delete(id)
    req.onsuccess = () => resolve()
    req.onerror   = ()  => reject(req.error)
  })
}

// ── Push notifications (ready for future use) ─────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'Vesimy', {
      body:    data.body    || 'You have a new notification',
      icon:    '/icons/icon-192x192.png',
      badge:   '/icons/icon-72x72.png',
      tag:     data.tag     || 'vesimy',
      data:    data.url     || '/dashboard',
      actions: data.actions || [],
      vibrate: [100, 50, 100],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data || '/dashboard'
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
