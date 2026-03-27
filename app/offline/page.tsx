// ── app/offline/page.tsx ─────────────────────────────────────────────────────
export const dynamic = 'force-static'

export default function OfflinePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#0176D3', marginBottom: 8 }}>VeSiMy</div>
        <div style={{ fontSize: 11, color: 'var(--sl-400)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 48 }}>Continuous Improvement</div>
        <div style={{ fontSize:11, fontWeight:800, fontFamily:"monospace", letterSpacing:2, color:"var(--text3)", marginBottom:24, opacity:0.6 }}>OFFLINE</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>You are offline</h1>
        <p style={{ fontSize: 15, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 32 }}>
          No internet connection detected. Your saved data is still available.
          Reconnect to sync and save changes.
        </p>
        <a href="/dashboard" style={{ display: 'inline-block', background: '#0176D3', color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 8, textDecoration: 'none' }}>
          Try again
        </a>
      </div>
    </div>
  )
}
