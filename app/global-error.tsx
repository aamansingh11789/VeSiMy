'use client'
// ── app/global-error.tsx ──────────────────────────────────────────────────────
// Catches errors in the root layout itself (where the normal error boundary can't
// render). Must include its own <html>/<body>.

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[global error]', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{
        margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center',
        background: '#0B1D33', color: '#fff',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 56, color: '#C9A66B', marginBottom: 10 }}>
          Something broke
        </div>
        <p style={{ fontSize: 15, color: '#A9B5C2', maxWidth: 420, lineHeight: 1.6, marginBottom: 26 }}>
          The app hit an unexpected error. Your data is safe. Please reload to continue.
        </p>
        <button
          onClick={reset}
          style={{
            background: '#C9A66B', color: '#0B1D33', border: 'none', borderRadius: 9,
            padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
          Reload
        </button>
      </body>
    </html>
  )
}
