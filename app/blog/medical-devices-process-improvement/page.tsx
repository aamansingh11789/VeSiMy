// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Process Improvement in Medical Device Manufacturing — VeSiMy',
  description: "Medical device manufacturing demands CAPA traceability, FDA compliance, and first-time quality. Here\'s how structured CI tools support improvement in a regulated environment.",
  keywords: ['medical device process improvement', 'lean medical devices', 'CAPA medical device', 'FDA process improvement', 'ISO 13485 CI'],
  openGraph: {
    title: "Process Improvement in Medical Devices: FDA Doesn\'t Grade on a Curve",
    description: 'How VeSiMy supports structured root cause analysis, CAPA documentation, and process improvement in medical device manufacturing.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function MedicalDevicesBlog() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/industries" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Industries
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(255,107,107,0.15)', color: '#FF6B6B', fontFamily: 'monospace', letterSpacing: 1.5 }}>MEDICAL DEVICES</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>9 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            FDA Doesn't Grade on a Curve: CI in Medical Device Manufacturing
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Medical device manufacturers operate under the most demanding quality system requirements in manufacturing. ISO 13485, 21 CFR Part 820, MDR — the regulatory framework demands not just compliance, but demonstrable, continuous improvement. The challenge isn't meeting that expectation. It's making CI systematic rather than reactive.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#4E4B45', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why CAPA is a CI system — not just a compliance requirement</h2>
          <p style={{ marginBottom: 18 }}>
            Most medical device quality professionals understand CAPA as a regulatory obligation. But at its core, CAPA is a continuous improvement engine. It's a structured process for finding what went wrong, understanding why, and making the system better so it doesn't happen again.
          </p>
          <p style={{ marginBottom: 18 }}>
            The reason CAPA systems fail — and the reason over 60% of FDA 483 observations cite inadequate CAPA — isn't because companies don't have CAPA procedures. It's because the root cause analysis component is weak. Teams identify the symptom, write a corrective action to address the symptom, and close the record.
          </p>
          <p style={{ marginBottom: 18 }}>
            <strong style={{ color: 'var(--text)' }}>A symptom-level corrective action is a time-delayed recurrence, not a fix.</strong>
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The process challenges specific to medical device manufacturing</h2>
          {[
            ['Design-to-production translation', 'Medical devices are often engineered to tolerances that push the limits of production equipment. The Design History File describes what the product should be. The Device History Record captures what was actually produced. The gap between them is a CI opportunity that many teams never formally address.'],
            ['Cleanroom process discipline', 'In cleanroom environments, process discipline is everything. Operator movement patterns, gowning procedures, material transfers — each of these is a source of particle contamination risk. Informal process variation that gets tolerated in other environments can cause catastrophic yields loss in a cleanroom.'],
            ['Supplier non-conformances that propagate forward', 'Medical device supply chains are tightly controlled — but incoming material non-conformances still occur. How quickly those are detected, investigated, and dispositioned is a process problem that structured CI tools directly address.'],
            ['Validation burden for process changes', 'Every process change in a medical device environment requires change control, and significant changes require re-validation. This reality means that improvement initiatives face a high administrative hurdle — making it even more important to ensure the root cause analysis is complete before committing to a corrective action.'],
          ].map(([title, body]) => (
            <div key={title} style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>{body}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How VeSiMy supports medical device CI</h2>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>5 Why and Fishbone for CAPA root cause analysis</h3>
          <p style={{ marginBottom: 18 }}>
            The FDA's expectation for CAPA root cause analysis is that it be thorough, documented, and traceable. VeSiMy's 5 Why module walks a team through the iterative why-chain with prompts that discourage premature closure. The Fishbone tool structures the investigation across the standard cause categories — Method, Machine, Material, Measurement, Environment, People — ensuring no category is skipped.
          </p>
          <p style={{ marginBottom: 18 }}>
            The output is a structured, exportable record that can be attached to the CAPA file — not a reconstructed narrative written after the fact.
          </p>

          <div style={{ borderLeft: '3px solid #FF6B6B', paddingLeft: 20, marginBottom: 28 }}>
            <p style={{ fontFamily: serif, fontSize: 18, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>
              "The best root cause analysis is the one where the team asks 'why' until they reach a cause they can actually control — not a cause they can document."
            </p>
          </div>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Kaizen for process station improvement</h3>
          <p style={{ marginBottom: 18 }}>
            In a medical device context, a kaizen event is often triggered by a trend — a rising non-conformance rate at a particular station, an increasing complaint category, a recurring finding in internal audits. The kaizen event creates the structured space to observe the process, identify failure modes, and implement changes — with before/after measurement to demonstrate effectiveness.
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Kaizen module produces a documented event record that satisfies the effectiveness verification requirement in most CAPA procedures.
          </p>

          <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 12px' }}>Improvement Log for trending and audit readiness</h3>
          <p style={{ marginBottom: 18 }}>
            A VeSiMy Improvement project becomes a living record of all CI activity — structured improvement events, root cause analyses, kaizen outputs, and measured results. For an auditor reviewing your management review documentation or CAPA effectiveness, this is the evidence that your CI program is real, not aspirational.
          </p>

          <div style={{ background: 'rgba(44,44,92,0.05)', border: '1px solid rgba(44,44,92,0.12)', borderRadius: 14, padding: '20px 24px', marginTop: 40, marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Bottom line for medical device teams:</strong> FDA doesn't want to see that you have a CAPA procedure. They want to see that it works. VeSiMy makes the work visible, structured, and provable.
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
