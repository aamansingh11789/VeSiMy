import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '8 Wastes of Lean Manufacturing: DOWNTIME Examples and How to Eliminate Them — VeSiMy',
  description: 'The 8 wastes of lean — DOWNTIME — with real manufacturing examples for each. How to identify waste on your floor and build an elimination backlog from your value stream.',
  keywords: ['8 wastes of lean', 'DOWNTIME lean manufacturing', '8 wastes manufacturing examples', 'lean waste identification', 'muda lean', 'types of waste manufacturing', 'waste walk lean', 'identify waste manufacturing'],
  openGraph: {
    title: '8 Wastes of Lean Manufacturing: Real Examples and How to Eliminate Them',
    description: 'DOWNTIME — the 8 wastes of lean — with real manufacturing examples and a structured approach to identification.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const WASTES = [
  {
    letter: 'D',
    name: 'Defects',
    icon: '',
    definition: 'Any output that does not meet specification and requires rework, scrap, or inspection.',
    examples: ['Weld porosity requiring rework at final QC', 'Dimensional non-conformances caught at first-piece inspection', 'Incorrect labels on finished goods requiring re-labelling', 'Software bugs discovered in UAT that require a code fix'],
    cost: 'Defects consume labour twice — once to produce and once to correct. Scrap consumes material with zero customer value. Rework delays shipment and erodes confidence in the process.',
    action: 'Use a Fishbone + 5 Why to find the root cause. Standard Work to prevent recurrence. Statistical process control to detect drift before it produces defects.',
  },
  {
    letter: 'O',
    name: 'Overproduction',
    icon: '',
    definition: 'Producing more than the customer requires, sooner than required, or faster than downstream can consume.',
    examples: ['Running a batch of 500 when the customer order is 200', 'Producing subassemblies 3 days before final assembly needs them', 'Printing reports that nobody reads', 'Processing transactions in bulk overnight when real-time would serve better'],
    cost: 'Overproduction is the worst waste because it creates all the others — it generates inventory, requires transportation, hides defects, and ties up capacity that should respond to actual demand.',
    action: 'Match production rate to takt time. Implement pull signals (kanban) between steps. Reduce batch sizes. Schedule to actual demand rather than forecast push.',
  },
  {
    letter: 'W',
    name: 'Waiting',
    icon: '',
    definition: 'Time when work — product, people, or information — is idle and not progressing through the process.',
    examples: ['Parts waiting in bins between machining and assembly', 'Operators waiting for a crane that serves multiple cells', 'Approval signatures holding a purchase order for 3 days', 'A machine idle while the operator locates a tool'],
    cost: 'Waiting is often invisible because the product is still in the building and the operator may appear busy with other tasks. But it is the primary driver of long lead time and low PCE.',
    action: 'Map wait times explicitly in the VSM. Balance capacity between steps to takt. Relocate tools and materials to point of use. Reduce approval chains.',
  },
  {
    letter: 'N',
    name: 'Non-Utilisation of Talent',
    icon: '',
    definition: 'Failing to use the knowledge, skills, creativity, and experience of the people doing the work.',
    examples: ['Operators who see a better method but are never asked', 'Engineers solving problems in the office that operators already solved on the floor', 'Skilled technicians spending time on administrative tasks', 'Suggestions that are never implemented or responded to'],
    cost: 'Often called the 8th waste because it was added to the original 7 after Toyota codified the others. The knowledge gap between what workers know and what management acts on is enormous in most organisations.',
    action: 'Structured kaizen events that include operators. Suggestion systems with a commitment to respond within a defined window. Standard Work built with the people who do the work, not just for them.',
  },
  {
    letter: 'T',
    name: 'Transportation',
    icon: '',
    definition: 'Moving product, material, or information that does not add value to the transformation.',
    examples: ['Parts moved to a central inspection area and back to the line', 'Raw material stored in a warehouse far from point of use', 'A document emailed, printed, signed, scanned, and emailed again', 'A subassembly that crosses the building floor four times before final assembly'],
    cost: 'Every move is an opportunity for damage, loss, delay, and labelling error. Transport also obscures the sequence of operations — when parts travel, the process is harder to see and manage.',
    action: 'Reorganise layout to create flow cells where sequential steps are adjacent. Reduce centralised storage in favour of point-of-use supermarkets. Digitalise document flows.',
  },
  {
    letter: 'I',
    name: 'Inventory',
    icon: '',
    definition: 'More material, WIP, or finished goods than is needed to support current demand.',
    examples: ['Three pallets of raw material when one shift\'s worth is sufficient', 'WIP triangles on the VSM showing 4-day queues between steps', 'Finished goods stock that hasn\'t moved in 90 days', 'A spare parts cage with components for machines no longer in service'],
    cost: 'Inventory ties up cash, occupies space, and hides problems. When a quality issue is discovered in 500 units of WIP, the cost is exponentially higher than discovering it in 5. Inventory is the buffer that makes all other wastes tolerable — and therefore invisible.',
    action: 'Use the VSM to make WIP visible. Set target WIP levels based on cycle time and lead time. Implement kanban pull to control WIP between steps. Conduct regular inventory reviews.',
  },
  {
    letter: 'M',
    name: 'Motion',
    icon: '',
    definition: 'Unnecessary movement of people that does not add value to the product.',
    examples: ['An operator walking to a shared tool cabinet 12 times per shift', 'Reaching, bending, or stretching to access materials not at ergonomic height', 'Walking between disconnected workstations to check status', 'Searching for information across multiple systems or physical locations'],
    cost: 'Motion waste is the most visible waste on a properly run time study — and the most ignored. It accumulates in seconds per cycle, but at 480 cycles per shift, minutes per hour become hours per week.',
    action: 'Time study to identify motion waste per step. Reorganise the workstation with everything at point of use. 5S to eliminate search. Standard Work to lock in the optimised sequence.',
  },
  {
    letter: 'E',
    name: 'Extra Processing',
    icon: '',
    definition: 'Doing more to a product than the customer requires, or using a more complex process than the task demands.',
    examples: ['Polishing a surface the customer will never see', 'Running a tolerance tighter than the specification requires', 'Multiple sign-off levels for low-risk decisions', 'Re-entering data from one system into another', 'Inspecting at every step when process capability is proven'],
    cost: 'Extra processing consumes capacity without producing value. It often originates in well-intentioned process additions that were never revisited — the inspection step added after a quality escape ten years ago, still running on every part.',
    action: 'Audit process steps against customer requirements. Ask "what would happen if we stopped doing this?" Standard Work to define what is actually necessary.',
  },
]

export default function EightWastesPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(192,64,42,0.12)', color: '#C0402A', fontFamily: 'monospace', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'monospace' }}>10 min read · March 19, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            The 8 Wastes of Lean Manufacturing: DOWNTIME With Real Examples
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            The 8 wastes — Defects, Overproduction, Waiting, Non-utilisation of talent, Transportation, Inventory, Motion, and Extra Processing — are the categories that structure waste identification in lean. Most teams can name them. Fewer can identify them specifically on their own floor and build an actionable elimination backlog from what they find.
          </p>
        </div>

        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why the 8 wastes matter</h2>
          <p style={{ marginBottom: 18 }}>
            The original seven wastes were identified by Taiichi Ohno at Toyota in the development of the Toyota Production System. The eighth — non-utilisation of talent — was added later as lean thinking spread beyond manufacturing to knowledge work environments. Together they form a complete taxonomy of non-value-adding activity that applies across industries and processes.
          </p>
          <p style={{ marginBottom: 18 }}>
            The purpose is not to categorise waste for its own sake. The purpose is to give teams a structured lens for seeing waste that would otherwise be invisible — because waste that has existed long enough becomes the background, the way things are.
          </p>

          {WASTES.map((w, idx) => (
            <div key={w.letter} style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(1,118,211,0.1)', border: '1.5px solid rgba(1,118,211,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800, fontSize: 22, color: '#0176D3', flexShrink: 0 }}>{w.letter}</div>
                <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{w.name} {w.icon}</h2>
              </div>
              <p style={{ marginBottom: 14, fontStyle: 'italic', color: 'var(--text)', fontSize: 15 }}>{w.definition}</p>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>Examples on the floor</div>
                {w.examples.map(ex => (
                  <div key={ex} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 14 }}>
                    <span style={{ color: '#C0402A', flexShrink: 0, marginTop: 2 }}>✗</span>
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(248,247,245,0.5)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 6 }}>Why it matters</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{w.cost}</p>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                <span style={{ fontWeight: 700, color: '#1DD1A1' }}>What to do: </span>{w.action}
              </div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Building a waste elimination backlog</h2>
          <p style={{ marginBottom: 18 }}>
            Identifying waste is only the first step. The output of a waste identification exercise should be a prioritised backlog of specific observations — not "we have inventory waste" but "there are 4.2 days of WIP between Station 3 and Station 4 due to the batch size mismatch, and reducing it to 0.5 days would save 14 hours of lead time."
          </p>
          <p style={{ marginBottom: 18 }}>
            VeSiMy's Waste ID tool walks through all 8 wastes per process step. For each waste you identify, you add a specific observation note. These roll up automatically into the project report as a prioritised waste register — so the output of the waste walk is a Kaizen backlog, not just a list.
          </p>

          <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Identify waste on your floor — free</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.7 }}>VeSiMy's Waste ID tool covers all 8 wastes per step and builds your improvement backlog automatically.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0176D3', color: '#0D0C0A', padding: '10px 22px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Start free →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
