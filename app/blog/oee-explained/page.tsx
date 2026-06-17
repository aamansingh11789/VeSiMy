// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OEE Explained: Availability, Performance, Quality, and the Six Big Losses, VeSiMy',
  description: 'Overall equipment effectiveness is the most comprehensive single metric for machine-intensive operations. Here is how to calculate it and what it reveals.',
  openGraph: { title: 'OEE Explained: Availability, Performance, Quality, and the Six Big Losses', type: 'article' },
}

const serif = "'Sora','Inter',sans-serif"

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#6CB9FC22', color: '#6CB9FC', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>7 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            OEE Explained: Availability, Performance, Quality, and the Six Big Losses
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Overall equipment effectiveness is the most comprehensive single metric for machine-intensive operations. Here is how to calculate it and what it reveals.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What OEE measures</h2>
          <p style={{ marginBottom: 18 }}>OEE is the product of three factors: Availability × Performance × Quality. Each factor is a percentage. A perfect OEE score is 100 percent. World-class manufacturing typically runs between 75 and 85 percent. Most equipment runs between 40 and 60 percent, which means more than half of its potential is lost.</p>
          <p style={{ marginBottom: 18 }}>The formula: OEE = Availability × Performance × Quality. If a machine is available 90 percent of the time, runs at 95 percent of its ideal speed when available, and produces 99 percent good parts, its OEE is 0.90 × 0.95 × 0.99 = 84.6 percent.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The three factors</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Availability.</strong> Planned production time minus unplanned downtime, divided by planned production time. Unplanned downtime includes breakdowns, material shortages, and any other event that stops planned production. Note: planned downtime such as scheduled maintenance is excluded from planned production time.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Performance.</strong> Actual output divided by theoretical maximum output during available time. Performance losses include slow cycles, minor stoppages, and idling. If a machine has an ideal cycle time of 2 seconds but is averaging 2.4 seconds, performance is 83 percent.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Quality.</strong> Good units produced divided by total units produced. First pass yield. Rework counts as defective for OEE purposes because it consumed machine time.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The six big losses</h2>
          <p style={{ marginBottom: 18 }}>OEE was designed around six categories of loss that map directly to the three factors. Equipment failure maps to availability. Setup and adjustment maps to availability. Idling and minor stoppages map to performance. Reduced speed maps to performance. Process defects map to quality. Reduced yield during startup maps to quality.</p>
          <p style={{ marginBottom: 18 }}>The six big losses give you a language for improvement. Instead of saying "our OEE is bad," you can say "we are losing 12 points in availability to equipment failure and 8 points in performance to minor stoppages. These two categories account for 80 percent of our OEE gap." That is an improvement roadmap.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>OEE and VSM together</h2>
          <p style={{ marginBottom: 18 }}>OEE feeds directly into VSM analysis. A machine with 65 percent OEE does not have 100 percent of its capacity available for your lead time calculation. Effective machine rate, adjusted for OEE, gives you a realistic picture of what the process can actually produce. VeSiMy uses uptime percentage from the step data strip as a proxy for availability when full OEE data is not available.</p>

          <div style={{ background: 'rgba(11,29,51,0.06)', border: '1px solid rgba(11,29,51,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0B1D33', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
