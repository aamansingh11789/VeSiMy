// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Takt Time: What It Means, How to Calculate It, and What to Do When CT Exceeds It — VeSiMy',
  description: 'Takt time is the heartbeat of a lean process. If you do not know yours, you cannot know whether your process is capable of meeting demand.',
  openGraph: { title: 'Takt Time: What It Means, How to Calculate It, and What to Do When CT Exceeds It', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#1DD1A122', color: '#1DD1A1', fontFamily: 'monospace', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>7 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Takt Time: What It Means, How to Calculate It, and What to Do When CT Exceeds It
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Takt time is the heartbeat of a lean process. If you do not know yours, you cannot know whether your process is capable of meeting demand.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What takt time is</h2>
          <p style={{ marginBottom: 18 }}>Takt is German for pulse or beat. Takt time is the rate at which you need to complete one unit of work to satisfy customer demand within your available time. It is not the rate you want to work. It is the rate the customer is pulling from you.</p>
          <p style={{ marginBottom: 18 }}>The formula: Takt Time = Available Production Time / Customer Demand</p>
          <p style={{ marginBottom: 18 }}>If you have 480 minutes of available time per shift and customers demand 60 units per shift, your takt time is 8 minutes. One unit every 8 minutes. Every step in the process must be capable of completing its work in 8 minutes or less.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What available time actually means</h2>
          <p style={{ marginBottom: 18 }}>Available time is not the length of the shift. It is the shift length minus scheduled breaks, planned maintenance, and changeover time. If your shift is 480 minutes but you have two 10-minute breaks and a 20-minute changeover, your available time is 440 minutes. Use the real number. Takt calculated on inflated available time is fiction.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Reading a takt comparison on your VSM</h2>
          <p style={{ marginBottom: 18 }}>Draw a horizontal line across your VSM at takt time. Every step whose cycle time bar rises above the takt line is a problem. That step cannot keep up with demand. Every step well below the takt line has excess capacity. The question is whether that excess capacity matters or whether it is just buffering for the constrained step.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>When cycle time exceeds takt</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Option 1 — Reduce CT at the constrained step.</strong> Eliminate NVA activities, improve setup, reduce wait within the step.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Option 2 — Add parallel capacity.</strong> Split the work across two operators or two machines. This doubles throughput at that step without reducing CT.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Option 3 — Accept demand you cannot meet and communicate it.</strong> Sometimes the honest answer is that takt time reveals a capacity gap that cannot be closed with current resources. That is important information. Better to know now than to promise delivery lead times the process cannot support.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>When cycle time is significantly below takt</h2>
          <p style={{ marginBottom: 18 }}>A step that runs at 30 percent of takt time is not a win. It is either overbuilt, a symptom of earlier problems, or covering for a bottleneck elsewhere. Look at the steps around it. The excess capacity is almost always there because the team knew something upstream or downstream was unreliable.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free — no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
