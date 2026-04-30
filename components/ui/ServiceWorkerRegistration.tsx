// TypeScript enabled
'use client'
// ── components/ui/ServiceWorkerRegistration.tsx ───────────────────────────────
// Registers the service worker. Must be a client component.
// Runs once on app load, silently — no UI.

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',  // always check for updates
        })

        // Check for updates every 60 minutes while app is open
        setInterval(() => registration.update(), 60 * 60 * 1000)

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available — could show a toast here in future
            }
          })
        })

        // SW registered successfully — no logging in production
      } catch (err) {
        // SW registration failed — app still works, just no offline support
      }
    }

    // Register after page load to not block initial render
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null  // No UI — this component is invisible
}
