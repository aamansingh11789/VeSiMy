// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SMED: How to Cut Changeover Time in Half Before You Buy Any New Equipment, VeSiMy',
  description: 'Single-Minute Exchange of Die explained with practical steps. Most changeover time is fixable with observation and organisation, not capital.',
  openGraph: { title: 'SMED: How to Cut Changeover Time in Half Before You Buy Any New Equipment', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#0176D322', color: '#0176D3', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>7 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            SMED: How to Cut Changeover Time in Half Before You Buy Any New Equipment
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Single-Minute Exchange of Die explained with practical steps. Most changeover time is fixable with observation and organisation, not capital.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What SMED is</h2>
          <p style={{ marginBottom: 18 }}>Single-Minute Exchange of Die (SMED) is a lean methodology for reducing changeover time, the time from the last good unit of product A to the first good unit of product B. Shigeo Shingo developed it at Toyota in the 1950s and 1960s. The name refers to achieving changeovers in single-digit minutes.</p>
          <p style={{ marginBottom: 18 }}>SMED matters because long changeovers force large batch sizes. Large batches create large WIP. Large WIP creates long lead times. Long lead times reduce flexibility to respond to changes in demand. The whole cascade starts with changeover time.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Internal vs external setup</h2>
          <p style={{ marginBottom: 18 }}>The first and most important SMED concept: internal setup is work that can only be done when the machine is stopped. External setup is work that can be done while the machine is still running the previous job.</p>
          <p style={{ marginBottom: 18 }}>Most changeover times can be reduced by 30 to 50 percent simply by converting internal activities to external ones. Pre-staging tools, pre-heating dies, pre-positioning fixtures, pre-assembling components, all of this can happen before the machine stops.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The four SMED steps</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 1, Film the changeover.</strong> Before changing anything, record the entire changeover from start to finish. The team watches it together. Every activity is identified. Most teams are surprised at what they see, and surprised at what they have normalized.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 2, Separate internal from external.</strong> Every activity gets tagged: can this be done while the machine is running? If yes, it is external. Move it outside the stoppage window.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 3, Convert remaining internal activities.</strong> For each activity that genuinely requires the machine to be stopped, ask: can this be redesigned so it does not require the machine to stop? Standardized tooling, quick-release fasteners, pre-set height gauges, engineering changes that reduce internal time.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 4, Streamline all activities.</strong> Time each remaining activity. Eliminate or simplify the longest ones. Parallel activities, two operators working simultaneously on different parts of the changeover, are often available and unused.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What a typical reduction looks like</h2>
          <p style={{ marginBottom: 18 }}>A two-hour changeover is almost always reduceable to under 45 minutes without capital expenditure. The first pass typically finds 30 to 40 minutes of walking, searching for tools, waiting for settings approvals, and other pure waste that no capital can fix.</p>
          <p style={{ marginBottom: 18 }}>The second pass, converting internal to external, typically finds another 20 to 30 minutes. By the time the team gets to engineering changes, they often find the changeover is already within target.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
