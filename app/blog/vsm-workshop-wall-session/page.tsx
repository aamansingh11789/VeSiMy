// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Run a VSM Workshop: The Wall Session Method, VeSiMy',
  description: 'Step by step from empty wall to completed current state map. Everything you need to run your first value stream mapping workshop the right way.',
  keywords: ['VSM workshop', 'value stream mapping workshop', 'wall session lean', 'current state map how to'],
  openGraph: { title: 'How to Run a VSM Workshop: The Wall Session Method', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(1,118,211,0.15)', color: '#0176D3', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>METHODOLOGY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>8 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            How to Run a VSM Workshop: The Wall Session Method
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Step by step from empty wall to completed current state map. Everything you need to run your first value stream mapping workshop the right way.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <p style={{ marginBottom: 18 }}>Before any data is collected, before any stopwatch runs, before any analysis happens, there is the wall session. This is where the team gathers and builds the current state map together. It is the most important part of a VSM project and the one most teams get wrong.</p>
          <p style={{ marginBottom: 18 }}>Most practitioners skip straight to observation. They go to the floor with a clipboard or an app and start measuring. The problem is that without the wall session, each observer has a different mental model of what the process is.</p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What you need before you start</h2>
          <p style={{ marginBottom: 18 }}>A wall. Not a whiteboard. A real wall or a long stretch of butcher paper taped to the wall. The physical scale matters. A value stream needs space to breathe.</p>
          <p style={{ marginBottom: 18 }}>Sticky notes in at least three colors. Main process steps in one color, sub-processes in another, information flows in a third. Markers, medium point so writing is readable from six feet away.</p>
          <p style={{ marginBottom: 18 }}>The right people: someone from every part of the process. Five to eight people is the right size. A facilitator who can keep the group on the current state, not the ideal state.</p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Setting the scope first</h2>
          <p style={{ marginBottom: 18 }}>Define the trigger, the event that starts this process. Define completion, what done looks like. Write both on the wall before anyone touches a sticky note. Everything in between is fair game. Everything outside those boundaries is not on this map.</p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Running the wall session</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 1: Name the process steps.</strong> Ask: "What is the first thing that happens after the trigger?" Write the answer, place it on the wall, then ask: "What happens next?" Map the typical flow, the path that 80 percent of your volume takes.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 2: Add activities inside each step.</strong> For each step, ask what the individual tasks are. A step called "Incoming inspection" might have six distinct activities. These activities are where waste hides.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 3: Add sub-processes.</strong> Add a horizontal lane for each process that feeds the main flow. Do not ignore them. The constraint is often a sub-process starving a main step.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Step 4: Add information flows.</strong> How does each step know what to do? Draw electronic flows with a lightning bolt arrow, manual flows with a straight arrow.</p>
          <p style={{ marginBottom: 18 }}><strong style={{ color: 'var(--text)' }}>Step 5: Walk the wall.</strong> Narrate the map from left to right. This almost always surfaces gaps. Walk it until nobody adds anything.</p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The most common mistakes</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Mapping the ideal, not the real.</strong> The facilitator's job is to ask "is that what actually happens today?" Map today.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Stopping at step names.</strong> A map with only step names is a list, not a map.</p>
          <p style={{ marginBottom: 18 }}><strong style={{ color: 'var(--text)' }}>Confusing current state with future state.</strong> When someone says "we should automate that step," write it on a parking lot. The wall session maps what is, not what could be.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
