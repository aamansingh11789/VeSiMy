// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found, VeSiMy',
}

export default function NotFound() {
  const serif = "'Sora','Inter',sans-serif"

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(160deg, #F0EDE6 0%, #080620 50%, #F0EDE6 100%)',
        color: 'var(--text)',
      }}
    >
      <div style={{ fontSize: 80, fontFamily: serif, fontWeight: 800, color: '#0B1D33', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: 'var(--text)', margin: '16px 0 12px' }}>
        This process step doesn't exist.
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 420, lineHeight: 1.75, marginBottom: 36 }}>
        The page you're looking for has been moved, removed, or never existed.
        Let's get you back on the improvement path.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg,#0a5eaa,#0B1D33)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 10,
            textDecoration: 'none',
          }}
        >
          Back to VeSiMy →
        </Link>
        <Link
          href="/dashboard"
          style={{
            padding: '12px 28px',
            border: '1px solid rgba(11,29,51,0.3)',
            color: '#0B1D33',
            fontWeight: 600,
            fontSize: 14,
            borderRadius: 10,
            textDecoration: 'none',
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
