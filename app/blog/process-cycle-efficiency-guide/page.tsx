// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Cycle Efficiency: What PCE Means and Why Most Operations Are Between 10 and 30 Percent, VeSiMy',
  description: 'Process cycle efficiency is the most revealing single number in a VSM analysis. Here is what it measures, how to calculate it, and what to do with it.',
  openGraph: { title: 'Process Cycle Efficiency: What PCE Means and Why Most Operations Are Between 10 and 30 Percent', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#1DD1A122', color: '#1DD1A1', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>6 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Process Cycle Efficiency: What PCE Means and Why Most Operations Are Between 10 and 30 Percent
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Process cycle efficiency is the most revealing single number in a VSM analysis. Here is what it measures, how to calculate it, and what to do with it.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The formula</h2>
          <p style={{ marginBottom: 18 }}>PCE = Value-Added Time / Total Lead Time. Total lead time is the sum of all cycle times and all wait times across the value stream. Value-added time is the sum of cycle times for only the steps classified as value-added.</p>
          <p style={{ marginBottom: 18 }}>If your process has 45 minutes of VA work and a total lead time of 420 minutes, your PCE is 10.7 percent. The remaining 89.3 percent is waste, either necessary non-value-added (NNVA) or pure waste (NVA).</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why 10 to 30 percent is typical</h2>
          <p style={{ marginBottom: 18 }}>Most processes have been designed around the exceptions, not the flow. The inspection step exists because defects escape. The approval step exists because someone made a costly decision without enough information. The re-entry step exists because two systems do not talk to each other.</p>
          <p style={{ marginBottom: 18 }}>Each of these steps added wait time to the process. The original step still takes the same amount of time. The wait time compounds. A process with 12 steps and an average of 30 minutes of wait time between each step has 360 minutes of wait time built in before a single second of value-added work is counted.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What PCE tells you</h2>
          <p style={{ marginBottom: 18 }}>A low PCE is not a failure. It is a measure of improvement opportunity. A process with 10 percent PCE has 90 percent of its lead time available for reduction. That is not a bad process, that is a process with a large gap between current and future state.</p>
          <p style={{ marginBottom: 18 }}>A high PCE (above 70 percent) in a process with quality problems means the problem is in the value-added steps themselves, not in waiting or overhead. The improvement strategy changes completely depending on where the waste lives.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Industry benchmarks</h2>
          <p style={{ marginBottom: 18 }}>Lean manufacturing targets above 80 percent PCE. Service operations typically operate at 5 to 20 percent. Healthcare processes often measure below 10 percent. Software development processes, when measured honestly, often come in at 15 to 25 percent when wait time in queues is included.</p>
          <p style={{ marginBottom: 18 }}>The benchmark matters less than the trend. A process improving from 8 percent to 18 percent PCE over two improvement cycles is a process in good health regardless of industry average.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Using PCE to set improvement targets</h2>
          <p style={{ marginBottom: 18 }}>A PCE target gives the team a single number to rally around. "We are at 12 percent. Our target is 25 percent in two improvement cycles." That translates directly into lead time reduction: if current lead time is 5 days and VA time is 0.6 days, reaching 25 percent PCE means target lead time of 2.4 days. The improvement story writes itself.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
