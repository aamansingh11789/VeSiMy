// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '5 Why Analysis: 6 Real Examples From the Shop Floor 2026 — VeSiMy',
  description: 'The 5 Why technique sounds simple but most teams stop too early. Here are 6 real manufacturing examples showing exactly how deep to dig — and how to write a corrective action that sticks.',
  keywords: ['5 why analysis examples', '5 why root cause analysis', 'five why manufacturing', '5 why template', 'root cause analysis examples', 'lean problem solving'],
  openGraph: {
    title: '5 Why Analysis: 6 Real Examples From the Shop Floor',
    description: '6 real manufacturing 5 Why examples showing exactly how deep to dig and how to write corrective actions that stick.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const examples = [
  {
    color: '#FF6B6B',
    problem: 'A customer received 24 defective parts in a shipment',
    whys: [
      'The parts passed final inspection but had a burr on the mating face',
      'The inspection checklist did not include a check for burrs on that face',
      'The checklist was written before the new tooling was installed 6 months ago',
      'There is no process to update inspection checklists when tooling changes',
      'Engineering change orders do not trigger a mandatory quality document review',
    ],
    rootCause: 'The engineering change order process has no requirement to update quality inspection documents.',
    action: 'Add a mandatory "Quality Document Review" step to all engineering change orders, with sign-off from the quality manager before changes go live.',
  },
  {
    color: '#D4A208',
    problem: 'Machine downtime on Line 3 increased 40% last month',
    whys: [
      'The hydraulic press on Line 3 is breaking down 3× more often than normal',
      'The hydraulic fluid is contaminated with metal particles',
      'The filter replacement schedule is 90 days but the filter is clogged at 45 days',
      'The filter interval was set 8 years ago for a different duty cycle',
      'There is no process to review PM intervals when production volumes change',
    ],
    rootCause: 'Preventive maintenance intervals are set once and never reviewed, even when machine duty cycles change significantly.',
    action: 'Conduct a full PM interval review for all critical equipment. Link PM schedules to production volume triggers so intervals adjust automatically when throughput changes by more than 20%.',
  },
  {
    color: '#1DD1A1',
    problem: 'Order picking errors are running at 3.2% — target is 0.5%',
    whys: [
      'Pickers are selecting the wrong SKU from the bin',
      'Bins for two similar SKUs (A4412 and A4421) are adjacent and look identical',
      'The bin labels are small and the part numbers differ by only 2 digits',
      'The warehouse was laid out alphabetically by SKU number, which places similar numbers next to each other',
      'There is no poka-yoke or zone separation for high-confusion SKU pairs',
    ],
    rootCause: 'The warehouse layout creates adjacency between visually similar, easily confused SKU pairs with no error-proofing.',
    action: 'Separate all high-confusion SKU pairs by at least 3 bin locations. Add large-format colour-coded labels and a barcode scan confirmation step before pick completion.',
  },
  {
    color: '#6CB9FC',
    problem: 'A weld failed in the field causing a product recall',
    whys: [
      'The weld did not achieve the required penetration depth',
      'The welder set the amperage 15% below specification',
      'The specification is written in a binder in the supervisor\'s office, not at the workstation',
      'Standard work sheets are printed annually and stored centrally to avoid "clutter"',
      'There is no policy requiring standard work to be visible at the point of use',
    ],
    rootCause: 'Standard work documents are not required to be visible at the point of use, so operators work from memory rather than specification.',
    action: 'Implement a visual management standard requiring all critical parameters to be posted at the workstation in laminated format. Audit compliance monthly.',
  },
  {
    color: '#8C44CC',
    problem: 'Lead time for a key product jumped from 4 days to 11 days',
    whys: [
      'A critical sub-assembly is sitting in a WIP queue for 6 days before final assembly',
      'Final assembly is running at 60% of normal capacity',
      'Two of four assembly operators are on extended leave simultaneously',
      'Leave was approved without checking production demand or cross-training coverage',
      'There is no system to flag when approved leave creates a capacity gap against the production schedule',
    ],
    rootCause: 'The leave approval process does not account for production capacity or cross-training gaps, so capacity shortfalls are only discovered after lead times deteriorate.',
    action: 'Integrate leave approval with the production scheduling system. Require supervisor sign-off confirming adequate cross-trained coverage before leave is approved during peak demand periods.',
  },
  {
    color: '#D4A208',
    problem: 'A new operator produced 200 scrap parts on their first solo shift',
    whys: [
      'The operator set the press tonnage incorrectly',
      'The operator was not confident about the correct setting and guessed',
      'Training was completed but the operator never set the tonnage during training',
      'The trainer skipped that step because the machine was already set up when training began',
      'The training checklist has no requirement to verify the operator can perform set-up from scratch, only that they observed the process',
    ],
    rootCause: 'The training checklist measures observation, not demonstrated competence. Operators can be signed off without ever performing the task independently.',
    action: 'Redesign training sign-off to require demonstrated competence: operator must perform each critical task from scratch, unassisted, while the trainer observes and verifies the result.',
  },
]

export default function FiveWhyPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(255,107,107,0.15)', color: '#FF6B6B', fontFamily: 'monospace', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>6 min read · March 12, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            5 Why Analysis: 6 Real Examples From the Shop Floor
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            The 5 Why technique sounds simple but most teams stop too early or ask the wrong questions. Here are 6 real manufacturing examples that show you exactly how deep to dig.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#B8B5D1', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why most 5 Why analysis fails</h2>
          <p style={{ marginBottom: 18 }}>
            The 5 Why technique was developed by Sakichi Toyoda and is the cornerstone of the Toyota Production System. It is deceptively simple: when a problem occurs, ask "why?" five times to get to the root cause instead of the symptom.
          </p>
          <p style={{ marginBottom: 18 }}>
            In practice, most teams stop at Why 2 or Why 3 — the point where the answer is uncomfortable, politically sensitive, or points to a systemic failure rather than a single person's mistake. The result is a corrective action that treats the symptom and the problem returns within weeks.
          </p>
          <p style={{ marginBottom: 18 }}>
            A properly completed 5 Why will almost always point to one of three systemic root causes: a missing standard, a standard that isn't followed, or a standard that isn't visible at the point of use.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>6 real examples</h2>

          {examples.map((ex, idx) => (
            <div key={idx} style={{ marginBottom: 48 }}>
              <div style={{ background: `${ex.color}0d`, border: `1px solid ${ex.color}33`, borderRadius: 14, padding: '20px 22px', marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 800, color: ex.color, letterSpacing: 1.5, marginBottom: 8 }}>EXAMPLE {idx + 1}</div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>Problem: {ex.problem}</div>
              </div>

              {ex.whys.map((why, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: `${ex.color}22`, border: `1px solid ${ex.color}44`,
                    color: ex.color, fontWeight: 800, fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontFamily: 'monospace',
                  }}>
                    W{i + 1}
                  </div>
                  <div style={{ paddingTop: 3, fontSize: 14 }}>
                    <span style={{ color: 'var(--text2)', fontSize: 12 }}>Why? → </span>
                    {why}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 16, background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#1DD1A1', letterSpacing: 1, marginBottom: 6, fontFamily: 'monospace' }}>ROOT CAUSE</div>
                <div style={{ fontSize: 14, color: '#B8B5D1' }}>{ex.rootCause}</div>
              </div>

              <div style={{ background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.2)', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#D4A208', letterSpacing: 1, marginBottom: 6, fontFamily: 'monospace' }}>CORRECTIVE ACTION</div>
                <div style={{ fontSize: 14, color: '#B8B5D1' }}>{ex.action}</div>
              </div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The pattern you'll notice</h2>
          <p style={{ marginBottom: 18 }}>
            Look back at all 6 examples. Every single root cause points to a <strong style={{ color: 'var(--text)' }}>system or process failure</strong> — not a person's failure. The operator who guessed the tonnage setting wasn't careless; the training system never required them to prove they could do it alone. The picker who selected the wrong SKU wasn't distracted; the warehouse layout made the error almost inevitable.
          </p>
          <p style={{ marginBottom: 18 }}>
            This is the point of 5 Why. When you reach the real root cause, the corrective action becomes obvious — and it changes the system, not just the person.
          </p>
          <p style={{ marginBottom: 18 }}>
            If your 5 Why analysis ends with "operator error" or "employee didn't follow procedure," you haven't gone deep enough. Keep asking why.
          </p>

          {/* CTA */}
          <div style={{ marginTop: 48, padding: '32px 36px', background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              Run 5 Why analysis on your next problem
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75 }}>
              VeSiMy's 5 Why tool guides your team through the full analysis, generates an ISO-compliant report, and links the corrective action directly to the process step in your value stream map.
            </p>
            <Link href="/auth/signup" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#C43030,#FF6B6B)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Run your first 5 Why free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
