import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Electronics Manufacturing — VeSiMy',
  description: "Electronics manufacturing demands precision at micro-scale with margins that make rework economically catastrophic. Here\'s how CI tools address SMT yield, OEE, and defect reduction.",
  keywords: ['electronics process improvement', 'SMT process improvement', 'PCB manufacturing CI', 'electronics lean manufacturing', 'electronics yield improvement'],
  openGraph: {
    title: 'Process Improvement in Electronics: Yield Loss Is a Process Problem',
    description: 'How VeSiMy supports structured CI in SMT lines, PCB assembly, and electronics test operations.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function ElectronicsBlog() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/industries" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Industries
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(140,68,204,0.15)', color: '#8C44CC', fontFamily: 'monospace', letterSpacing: 1.5 }}>ELECTRONICS</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>8 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Yield Loss Isn't in the Component. It's in the Process.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Electronics manufacturing is defined by a relentless tension: increasingly complex products, increasingly tight tolerances, and margins that leave almost no room for process error. A solder defect on a 0402 component might cost a fraction of a cent to fix if caught at AOI — and hundreds of dollars if it reaches a customer return. Process improvement in electronics isn't abstract. It has a direct price tag on every board.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#4E4B45', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The economics of electronics process failure</h2>
          <p style={{ marginBottom: 18 }}>
            In electronics manufacturing, the cost of a defect isn't fixed — it scales dramatically with where in the process it's found. An AOI catch at the end of the SMT line costs minutes of rework time. The same defect found after functional test costs hours and often involves desoldering and replacing components that may not survive the operation. Found at a customer site, it costs the board plus logistics, plus customer relationship capital.
          </p>
          <p style={{ marginBottom: 18 }}>
            <strong style={{ color: 'var(--text)' }}>This 1:10:100 ratio — prevent vs. detect vs. fail — is why electronics CI pays faster than almost any other industry.</strong>
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Where process variation hides in electronics manufacturing</h2>
          {[
            ['Solder paste printing', 'Stencil aperture consistency, squeegee pressure, print speed, and paste viscosity management — each variable contributes to the solder paste volume on each pad. Variation here propagates to solder bridges, opens, and tombstoning. A process that looks controlled by SPI average can hide critical spread.'],
            ['Reflow profile management', 'Reflow oven profile drift is one of the most common contributors to solder joint reliability problems. Profiles get set up once and rarely re-validated. Thermocouple placements shift. Oven zones drift. The board profile you\'re running today may not match the profile in your work instruction.'],
            ['Component placement offsets', 'Placement accuracy degrades over time with feeder wear, vision system drift, and nozzle wear. CPK data that looked fine at equipment qualification may have drifted significantly without triggering an alert.'],
            ['ESD discipline variation', 'ESD damage is invisible and cumulative. Process variation in ionization equipment maintenance, wrist strap testing compliance, and handling procedures creates a background rate of latent failures that doesn\'t show up in first-pass yield but contributes to field failure rates.'],
            ['Test coverage gaps', 'ICT and functional test programs written at product launch rarely get updated as board revisions occur. Coverage gaps accumulate silently until a field failure reveals a test escape.'],
          ].map(([title, body]) => (
            <div key={title} style={{ background: 'rgba(140,68,204,0.06)', border: '1px solid rgba(140,68,204,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{body}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How VeSiMy supports electronics CI</h2>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Fishbone and 5 Why for defect investigation</h3>
          <p style={{ marginBottom: 18 }}>
            When a solder defect type rises above baseline — say, bridging on a particular package type increases from 0.3% to 1.8% — the instinct is to tweak the process parameter that seems most likely to blame. Increase squeegee pressure. Adjust paste viscosity. Change solder paste lot.
          </p>
          <p style={{ marginBottom: 18 }}>
            The problem with this instinct is that electronics defects are rarely single-cause. A Fishbone investigation that examines the full causal landscape — material, method, machine, measurement, environment — is far more likely to identify the true driver and the true corrective action.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Fishbone and 5 Why tools structure this investigation and document the outcome — creating a traceable record that informs future events and prevents the same investigation from being re-run when the issue recurs.
          </p>

          <div style={{ borderLeft: '3px solid #8C44CC', paddingLeft: 20, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: 18, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>
              "The process change that fixes this batch might not fix the next one. The root cause analysis that understands why the defect occurred is the one that prevents both."
            </p>
          </div>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Time Study for SMT line OEE analysis</h3>
          <p style={{ marginBottom: 18 }}>
            OEE in an SMT operation is typically tracked at the equipment level. But the process losses that drag OEE down often live in the human-machine interface — changeovers, feeder setup, first-article verification, and the informal "warm-up" time that operators give equipment at the start of a run.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Time Study tool captures these human-process elements that equipment monitoring systems don't track — giving the CI team a complete picture of where productive time is going.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Waste ID for rework analysis</h3>
          <p style={{ marginBottom: 18 }}>
            In electronics, rework is a normalized waste that most operations accept as a cost of doing business. A structured waste identification walk of a rework area often reveals that the majority of rework events trace to a small number of process steps — and that addressing those steps upstream would eliminate the majority of rework volume.
          </p>

          <div style={{ background: 'rgba(44,44,92,0.05)', border: '1px solid rgba(44,44,92,0.12)', borderRadius: 14, padding: '20px 24px', marginTop: 40, marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Bottom line for electronics teams:</strong> Every rework event is a process telling you something. VeSiMy helps you listen — systematically.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-block', background: '#0176D3', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
              Start a free project
            </Link>
            <Link href="/industries" style={{ display: 'inline-block', border: '1px solid rgba(44,44,92,0.3)', color: 'var(--text)', fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none' }}>
              ← All Industries
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
