import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #02040D 0%, #060C1A 50%, #0A1228 100%)',
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
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: 'linear-gradient(180deg, #3B7CFF, #A78BFA)', display: 'flex' }} />

        {/* Top-right accent */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: 320, height: 6, background: 'linear-gradient(90deg, transparent, #3B7CFF)', display: 'flex' }} />

        {/* Industry badge */}
        <div style={{
          background: 'rgba(1,118,211,0.12)',
          border: '1px solid rgba(1,118,211,0.35)',
          borderRadius: '999px',
          padding: '8px 24px',
          color: '#90BAFF',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '3px',
          marginBottom: '28px',
          display: 'flex',
        }}>
          TARGET-DRIVEN CI PLATFORM
        </div>

        {/* Main title */}
        <div style={{ fontSize: '86px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.0, marginBottom: '8px', display: 'flex' }}>
          VeSiMy
        </div>

        {/* New tagline */}
        <div style={{ fontSize: '26px', color: '#3B7CFF', fontWeight: 700, marginBottom: '28px', letterSpacing: '0.5px', display: 'flex' }}>
          Map the current state. Find the waste. Hit the target.
        </div>

        {/* Description */}
        <div style={{ fontSize: '19px', color: '#8888AA', maxWidth: '780px', lineHeight: 1.65, display: 'flex' }}>
          VSM · Kaizen · PDCA · root cause tools · reports — connected with AI guidance for real improvement work.
        </div>

        {/* Bottom stats */}
        <div style={{ position: 'absolute', bottom: '52px', left: '88px', display: 'flex', gap: '48px' }}>
          {[
            ['12+', 'CI Tools'],
            ['14-Day', 'Free Trial'],
            ['VSM', 'Methodology'],
            ['Supe AI', 'Guidance'],
          ].map(([val, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#3B7CFF', display: 'flex' }}>{val}</div>
              <div style={{ fontSize: '11px', color: '#52507A', letterSpacing: '2px', display: 'flex' }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: '52px', right: '88px', fontSize: '17px', color: '#52507A', fontFamily: 'monospace', display: 'flex' }}>
          vesimy.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
