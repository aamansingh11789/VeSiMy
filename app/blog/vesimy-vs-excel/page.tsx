import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VeSiMy vs Excel for Value Stream Mapping: Why Spreadsheets Break CI, VeSiMy',
  description: 'Excel is the most common CI tool in manufacturing, and the most expensive one nobody talks about. Here is what it costs you, and what a connected CI platform does differently.',
  keywords: ['VSM excel alternative', 'value stream mapping software vs excel', 'lean manufacturing software', 'CI tools manufacturing', 'replace excel lean', 'process improvement software', 'VSM tool comparison'],
  openGraph: {
    title: 'VeSiMy vs Excel for Value Stream Mapping',
    description: 'The hidden cost of running your CI process in spreadsheets, and what a connected platform does differently.',
    type: 'article',
  },
}

const serif = "'Sora','Inter',sans-serif"

export default function VeSiMyVsExcelPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(108,185,252,0.12)', color: '#6CB9FC', fontFamily: 'var(--font-mono)', letterSpacing: 1.5 }}>COMPARISON</span>
            <span style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'var(--font-mono)' }}>6 min read · March 19, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            VeSiMy vs Excel for Value Stream Mapping: What Spreadsheets Actually Cost You
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Nobody chose Excel for lean. It became the default because it was already there. But there's a real cost to running a CI programme in a tool that has no idea what a value stream is, and most teams are paying it without ever adding it up.
          </p>
        </div>

        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How CI actually lives in Excel</h2>
          <p style={{ marginBottom: 18 }}>
            Ask a lean coordinator to show you their CI system and most will open four or five files. A VSM drawn in Visio or on a whiteboard, photographed and saved as a PNG. Cycle times in a separate Excel workbook, with a tab for each process step. Root cause analysis notes in a Word doc or a Teams thread. A kaizen log nobody has updated in two weeks. An improvement tracker with RAG status that lives in someone's OneDrive.
          </p>
          <p style={{ marginBottom: 18 }}>
            Each file is technically functional. Together, they form a system where nothing is connected. When the cycle time at Station 4 changes, the VSM doesn't update. When a kaizen event closes, the improvement register doesn't automatically reflect it. When a 5 Why finds a root cause, there's no link back to the step where the problem lives.
          </p>
          <p style={{ marginBottom: 18 }}>
            This is not an Excel problem specifically. It's a fragmentation problem. Excel is just the most common tool in that fragmented system.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The real costs</h2>

          {[
            {
              title: 'Reconciliation time',
              body: 'Every time you want a current-state picture, for a monthly review, a kaizen readout, a manager asking for an update, someone spends 30 to 90 minutes pulling numbers from multiple sources, checking that the VSM matches the time study, checking that the time study matches the current standard. This is not improvement work. It is maintenance work caused by fragmentation.',
            },
            {
              title: 'Data that is already stale',
              body: 'By the time you have reconciled your data and produced the report, the process has moved on. The cycle time you measured two weeks ago reflects the line before last Thursday\'s changeover. The kaizen status you reported was correct as of Monday. Improvement decisions made on stale data produce stale improvement.',
            },
            {
              title: 'Knowledge that leaves with people',
              body: 'When a lean engineer leaves, their improvement history goes with them. The context for why Station 4 runs at 142 seconds instead of 120 is in their notes. The reason the Fishbone analysis in 2024 pointed to fixture wear is in a file named "5why_station4_v3_FINAL_revised.xlsx" that may or may not be findable. CI programmes that live in spreadsheets are structurally dependent on the people who maintain them.',
            },
            {
              title: 'No connection between cause and effect',
              body: 'A root cause analysis that lives in a separate document from the VSM step where the problem was found produces no automatic link between the finding and the countermeasure and the measurable result. You cannot close the loop without manual effort. Most of the time, the loop doesn\'t get closed at all.',
            },
          ].map(item => (
            <div key={item.title} style={{ borderLeft: '3px solid rgba(192,64,42,0.4)', paddingLeft: 18, marginBottom: 24 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6, fontSize: 16 }}>{item.title}</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75 }}>{item.body}</p>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What a connected CI platform does differently</h2>
          <p style={{ marginBottom: 18 }}>
            The difference is not features. The difference is a single data model. When your time study, your root cause analysis, your kaizen log, and your value stream map all live in the same system and reference the same process steps, several things happen automatically that currently require manual work:
          </p>

          {[
            ['Cycle time updates', 'When you complete a time study, the validated mean feeds directly to the VSM step. The map reflects the current reality without anyone copying a number.'],
            ['Kaizen visibility', 'When you open a kaizen event, it appears as a marker on the VSM. When you close it, the marker changes. You can see which steps have open improvement actions at a glance.'],
            ['Root cause traceability', 'A 5 Why or Fishbone analysis is attached to the specific step where the problem was found. The root cause, countermeasure, owner, and due date all travel with the step.'],
            ['Report generation', 'An A3 or process improvement report is assembled from the existing data, not built from scratch. The cycle times, waste findings, kaizen status, and PCE calculation are already there.'],
          ].map(([title, body]) => (
            <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(29,209,161,0.12)', border: '1.5px solid rgba(29,209,161,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ color: '#1DD1A1', fontSize: 11, fontWeight: 800 }}>✓</span>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>{title}: </span>
                <span style={{ fontSize: 14 }}>{body}</span>
              </div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>When Excel is still the right answer</h2>
          <p style={{ marginBottom: 18 }}>
            Excel is the right answer for one-off analysis that doesn't need to connect to anything else. An ad hoc capacity calculation. A quick cost comparison. A pivot table on export data. For tasks like these, Excel is fast and flexible and there is no reason to use anything else.
          </p>
          <p style={{ marginBottom: 18 }}>
            The problem is using Excel for the parts of CI that should connect, the VSM, the time studies, the root cause work, the improvement tracking. Those parts need a system, not a file.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to make the switch without disrupting your team</h2>
          <p style={{ marginBottom: 18 }}>
            The biggest barrier to switching tools in manufacturing is not capability, it's inertia. The team knows the spreadsheet. The spreadsheet exists. Starting over feels like admitting the old way was wrong.
          </p>
          <p style={{ marginBottom: 18 }}>
            The practical approach is to run one project in the new system and leave everything else alone. Pick a process that has an upcoming improvement event, a known bottleneck, a quality issue with a root cause you haven't fully addressed, a changeover that keeps slipping. Map it in VeSiMy, run the time study there, do the kaizen tracking there. At the end of the event, generate the A3 from the tool.
          </p>
          <p style={{ marginBottom: 18 }}>
            If the report takes ten minutes instead of a day, and the data is current instead of two weeks old, the case for the rest of your projects makes itself.
          </p>

          <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Map your first process in VeSiMy, free</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.7 }}>14-day free trial, 3 projects, all CI tools, no credit card. See what a connected CI system actually feels like on a real process.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0B1D33', color: '#0D0C0A', padding: '10px 22px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Start free →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
