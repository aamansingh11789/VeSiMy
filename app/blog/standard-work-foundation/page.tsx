// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Standard Work: Why It Is the Foundation of All Lean Improvement, VeSiMy',
  description: 'Standard work is not a bureaucratic document. It is the current best method, written down, so that improvement starts from a stable baseline.',
  openGraph: { title: 'Standard Work: Why It Is the Foundation of All Lean Improvement', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#6CB9FC22', color: '#6CB9FC', fontFamily: 'monospace', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>6 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Standard Work: Why It Is the Foundation of All Lean Improvement
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Standard work is not a bureaucratic document. It is the current best method, written down, so that improvement starts from a stable baseline.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What standard work is not</h2>
          <p style={{ marginBottom: 18 }}>Standard work is not a procedure manual. It is not an ISO document written by someone in quality and filed in a binder nobody reads. It is not a job instruction created once and never updated. These things exist in most organisations. They are documentation. They are not standard work.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What standard work is</h2>
          <p style={{ marginBottom: 18 }}>Standard work is the current best-known method for performing a task. It defines three things: the sequence of operations, the standard time for each operation, and the standard amount of WIP required. It is written by the people doing the work, for the people doing the work, and it changes every time a better method is found.</p>
          <p style={{ marginBottom: 18 }}>The critical word is current. Standard work documents what is happening today, not what someone decided should happen two years ago. If the standard work and the actual work are different, you have either a training problem or an outdated standard.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why improvement cannot happen without it</h2>
          <p style={{ marginBottom: 18 }}>You cannot improve what you have not stabilised. If every operator runs the process differently, a process change might improve performance for one operator and make it worse for another. The variation in method is indistinguishable from the variation in improvement. You are measuring noise.</p>
          <p style={{ marginBottom: 18 }}>Toyota's principle: standardise, then improve, then standardise again. The improvement cycle always runs from a documented baseline. Kaizen events that do not update the standard work are not improvements, they are temporary changes that revert when the team turns over.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The combination sheet</h2>
          <p style={{ marginBottom: 18 }}>The standard work combination sheet is the most useful format. It shows operator movements, machine movements, and wait time on the same horizontal time axis. The takt time line runs vertically. Any operator time that crosses the takt line is immediately visible as a problem.</p>
          <p style={{ marginBottom: 18 }}>Building combination sheets for your bottleneck steps is one of the most revealing exercises in lean. It almost always surfaces significant wait time that was invisible in the VSM data because nobody had written down what the operator was actually doing during the cycle.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Updating standard work</h2>
          <p style={{ marginBottom: 18 }}>Every improvement produces a new standard. This is the Act step of PDCA. If the improvement is not written into the standard work, it is not an improvement, it is a temporary deviation that will revert. The discipline to update the standard after every improvement is what separates organisations that sustain gains from those that revert.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
