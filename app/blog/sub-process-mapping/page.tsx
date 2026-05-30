// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sub-Process Mapping: How to Map Feeding Processes Without Losing the Main Flow, VeSiMy',
  description: 'Sub-processes are where the real constraint often lives. Here is how to map them without creating a map that nobody can read.',
  openGraph: { title: 'Sub-Process Mapping: How to Map Feeding Processes Without Losing the Main Flow', type: 'article' },
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
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'var(--font-mono)' }}>5 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Sub-Process Mapping: How to Map Feeding Processes Without Losing the Main Flow
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Sub-processes are where the real constraint often lives. Here is how to map them without creating a map that nobody can read.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why sub-processes matter</h2>
          <p style={{ marginBottom: 18 }}>The main flow of a VSM is the path your primary product or service takes from start to finish. But that path depends on other processes feeding it. A sub-process makes a component, prepares materials, generates information, or delivers inputs that the main flow needs.</p>
          <p style={{ marginBottom: 18 }}>The constraint in many operations is not on the main flow at all. It is in a sub-process that the main flow assumes will always deliver on time. When the sub-process is late, the main flow stalls. But because the stall appears on the main flow, the team keeps trying to fix the main flow and never addresses the actual cause.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The lane structure</h2>
          <p style={{ marginBottom: 18 }}>Sub-processes map as horizontal lanes above or below the main flow. The point where a sub-process feeds into the main flow is shown as a connection arrow at the relevant main flow step. Multiple sub-processes each get their own lane.</p>
          <p style={{ marginBottom: 18 }}>The same VSM notation applies to sub-process lanes: sticky notes, data strips, CT, wait time, WIP. The analysis metrics, PCE, lead time, takt comparison, also apply to each sub-process lane independently.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Scope rules for sub-processes</h2>
          <p style={{ marginBottom: 18 }}>Map a sub-process when it has its own dedicated resources, when its output is only used by the main flow at a specific point, and when its timing has historically caused main flow delays. Do not map a shared service function as a sub-process unless its capacity is genuinely constraining your value stream.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The common mistake</h2>
          <p style={{ marginBottom: 18 }}>The most common mistake is trying to map every sub-process in the first session. A first VSM with three or four sub-process lanes is usually too complex to complete in a single workshop. Map the main flow first. Then map the one or two sub-processes that are most likely to be constraining it. Add others in subsequent sessions once the main flow analysis is complete.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Nesting depth</h2>
          <p style={{ marginBottom: 18 }}>Sub-processes can themselves have sub-processes. In complex operations, three levels of nesting are not unusual. The practical rule: map to the depth where the data answers the question you are trying to answer. If the question is why the main flow has long lead time, map to the level that reveals the answer. Stop there for now.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free, no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
