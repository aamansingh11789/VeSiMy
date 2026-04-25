// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Run a 5 Whys That Actually Finds the Root Cause — VeSiMy',
  description: '5 Whys is the most misused tool in lean. Here is how to use it correctly so you fix the system, not the symptom.',
  openGraph: { title: 'How to Run a 5 Whys That Actually Finds the Root Cause', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#F8717122', color: '#F87171', fontFamily: 'monospace', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>6 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            How to Run a 5 Whys That Actually Finds the Root Cause
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            5 Whys is the most misused tool in lean. Here is how to use it correctly so you fix the system, not the symptom.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why 5 Whys fails most of the time</h2>
          <p style={{ marginBottom: 18 }}>The most common failure mode: the team stops at a symptom and calls it a root cause. The machine broke down. Why? Because it wasn't maintained. Why wasn't it maintained? Because the maintenance team was busy. Why were they busy? Because there are too many breakdowns. That last answer is circular. It is not a root cause.</p>
          <p style={{ marginBottom: 18 }}>A root cause is a system-level condition that, if changed, would prevent the problem from recurring. If your fifth why is still a behaviour, a person, or a surface condition, you have not found the root cause yet.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The validation test for each why</h2>
          <p style={{ marginBottom: 18 }}>At each level, test the logic: "If we fix this why, does it prevent the problem above it?" Work backwards from the bottom up. If you fix the root cause and the problem above it is not prevented, you have a wrong why. The chain must hold in both directions.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The most common traps</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Stopping at human error.</strong> "The operator made a mistake" is never a root cause. Why did the system allow the mistake? Why was there no error-proofing? Why was the standard work unclear? The operator is not the cause. The system that allowed the error is.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Branching without discipline.</strong> Real problems often have multiple causes. If two different whys are both true at the same level, document both branches. Do not arbitrarily pick one.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Running it alone.</strong> 5 Whys is a team exercise. A facilitator asks the questions. Subject matter experts answer them. The person closest to the problem is not the same as the person who understands the system.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The Sakichi Toyoda rule</h2>
          <p style={{ marginBottom: 18 }}>Toyota's founder said: "By repeating why five times, the nature of the problem as well as its solution becomes clear." The number five is not the point. The point is to keep asking until the answer is something the system can actually change. Sometimes that takes three whys. Sometimes it takes seven.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What a good 5 Whys output looks like</h2>
          <p style={{ marginBottom: 18 }}>The output is a chain of whys that is logically defensible at every link, ends at a system-level condition that can be changed, and produces a specific countermeasure that addresses the root cause rather than the symptom. If the countermeasure only addresses the most recent why, you stopped too early.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free — no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
