import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #04040F 0%, var(--bg3) 50%, #04040F 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 88px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Left accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: '#00B4A6', display: 'flex' }} />

        {/* Gold top-right accent */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: 200, height: 8, background: '#0176D3', display: 'flex' }} />

        {/* Tagline badge */}
        <div style={{
          background: 'rgba(1,118,211,0.12)',
          border: '1px solid rgba(1,118,211,0.3)',
          borderRadius: '999px',
          padding: '8px 22px',
          color: '#0176D3',
          fontSize: '16px',
          fontWeight: 800,
          letterSpacing: '3px',
          marginBottom: '28px',
          display: 'flex',
        }}>
          AI OPERATIONS INTELLIGENCE PLATFORM
        </div>

        {/* Main title */}
        <div style={{ fontSize: '80px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.0, marginBottom: '16px', display: 'flex' }}>
          VeSiMy
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '28px', color: '#00B4A6', fontWeight: 600, marginBottom: '32px', display: 'flex' }}>
          Monitor · Record · Analyze · Suggest
        </div>

        {/* Description */}
        <div style={{ fontSize: '20px', color: 'var(--text2)', maxWidth: '760px', lineHeight: 1.6, display: 'flex' }}>
          The AI platform that watches your manufacturing processes, detects inefficiencies, and tells your team exactly what to fix.
        </div>

        {/* Bottom stats */}
        <div style={{ position: 'absolute', bottom: '56px', left: '88px', display: 'flex', gap: '40px' }}>
          {[['8', 'CI Tools'], ['14-Day', 'Free Trial'], ['24/7', 'AI Monitoring']].map(([val, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#0176D3', display: 'flex' }}>{val}</div>
              <div style={{ fontSize: '13px', color: '#52507A', letterSpacing: '2px', display: 'flex' }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: '56px', right: '88px', fontSize: '18px', color: '#52507A', display: 'flex' }}>
          vesimy.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
