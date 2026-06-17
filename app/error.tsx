'use client'
// ── app/error.tsx ─────────────────────────────────────────────────────────────
// Route-level error boundary. Catches render/runtime errors in any page below the
// root layout and shows a recovery UI instead of a blank screen.

import { useEffect } from 'react'
import Link from 'next/link'

const serif = "'Instrument Serif', Georgia, serif"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface to logs/monitoring without leaking details to the user.
    console.error('[app error]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center',
      background: '#0B1D33', color: '#fff',
    }}>
      <div style={{ fontFamily: serif, fontSize: 64, color: '#C9A66B', lineHeight: 1, marginBottom: 8 }}>
        Something broke
      </div>
      <p style={{ fontSize: 16, color: '#A9B5C2', maxWidth: 440, lineHeight: 1.6, marginBottom: 28 }}>
        An unexpected error stopped this page from loading. Your data is safe. You can try again, or head back home.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            background: '#C9A66B', color: '#0B1D33', border: 'none', borderRadius: 9,
            padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
          Try again
        </button>
        <Link href="/" style={{
          background: 'rgba(255,255,255,.1)', color: '#fff', borderRadius: 9,
          padding: '12px 24px', fontSize: 14, fontWeight: 600, textDecoration: 'none',
          border: '1.5px solid rgba(255,255,255,.45)',
        }}>
          Go home
        </Link>
      </div>
    </div>
  )
}
