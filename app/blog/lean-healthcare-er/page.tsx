// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Lean Applies in Healthcare: The ER Bed Example, VeSiMy',
  description: 'Lean is not a manufacturing concept. The ER bed flow problem is one of the clearest illustrations of VSM thinking outside the factory.',
  openGraph: { title: 'How Lean Applies in Healthcare: The ER Bed Example', type: 'article' },
}

const serif = "'Sora','Inter',sans-serif"

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#F8717122', color: '#F87171', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>INDUSTRY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>7 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            How Lean Applies in Healthcare: The ER Bed Example
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Lean is not a manufacturing concept. The ER bed flow problem is one of the clearest illustrations of VSM thinking outside the factory.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The problem nobody talks about</h2>
          <p style={{ marginBottom: 18 }}>A patient arrives in the emergency department. The clinical team is ready. The bed is available. But the patient waits in the corridor for 90 minutes. Why? Because the housekeeping team has not cleaned the previous patient's bed yet. And they cannot clean the bed until the portering team removes the previous patient. And the portering team is occupied elsewhere.</p>
          <p style={{ marginBottom: 18 }}>This is a flow problem. Not a staffing problem. Not a funding problem. The process has a constraint, a handoff bottleneck that delays every subsequent step. The bed is available. The patient needs the bed. Three separate departments own three separate steps in one process that nobody has mapped end to end.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What a VSM reveals in an ER bed flow</h2>
          <p style={{ marginBottom: 18 }}>Map the process from patient presentation at triage to patient in a clean bed with a clinician attending. Every step. Every handoff. Every wait time. Most hospital teams have never done this because the steps cross departmental boundaries and no single manager owns the whole flow.</p>
          <p style={{ marginBottom: 18 }}>When the VSM is complete, a typical finding: total cycle time (actual work being done on behalf of the patient) is 18 minutes. Total lead time (time from triage to bed) is 140 minutes. Process cycle efficiency: 13 percent. Eighty-seven percent of the patient's time is waste from the patient's perspective.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Where the waste typically lives</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Waiting for information.</strong> The bed coordinator does not know the bed is empty until someone calls. Information flow is manual and intermittent.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Sequential when parallel is possible.</strong> Cleaning, porting, and equipment setup happen sequentially. Many activities can happen in parallel with small process changes.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Batching.</strong> Portering teams move patients in batches when their schedule allows, not in response to actual demand signals.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What the future state looks like</h2>
          <p style={{ marginBottom: 18 }}>An electronic real-time bed board. Automatic notification to portering when discharge is confirmed. Concurrent housekeeping notification. Standard work for each handoff with time targets. A visual management system that shows every bed's status to every relevant party at all times.</p>
          <p style={{ marginBottom: 18 }}>None of these require capital equipment. They require process redesign, standard work, and cross-departmental cooperation, which is exactly what lean is for.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The lesson for non-manufacturing teams</h2>
          <p style={{ marginBottom: 18 }}>The tools are identical. VSM, takt time, WIP analysis, pull vs push, standard work. The waste types are identical: waiting, overprocessing, unnecessary motion, defects. The methodology does not care what industry it is applied to. It cares about flow.</p>

          <div style={{ background: 'rgba(11,29,51,0.06)', border: '1px solid rgba(11,29,51,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0B1D33', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
