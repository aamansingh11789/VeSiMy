// TypeScript enabled
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lean in Brewing: Mapping the Bottling Line — VeSiMy',
  description: 'Craft brewing is a production operation with all the same waste types as any manufacturing process. Here is what a bottling line VSM reveals.',
  openGraph: { title: 'Lean in Brewing: Mapping the Bottling Line', type: 'article' },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function Post() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>← Back to Blog</Link>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: '#1DD1A122', color: '#1DD1A1', fontFamily: 'monospace', letterSpacing: 1.5 }}>INDUSTRY</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>6 min read · April 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Lean in Brewing: Mapping the Bottling Line
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            Craft brewing is a production operation with all the same waste types as any manufacturing process. Here is what a bottling line VSM reveals.
          </p>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.9 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Why craft breweries need lean more than they think</h2>
          <p style={{ marginBottom: 18 }}>A craft brewery producing 2,000 barrels per year is a small-batch manufacturer with all the complexity of large-scale food production: variable demand, regulatory compliance, capital-intensive equipment, perishable inputs, and margin pressure that leaves no room for waste.</p>
          <p style={{ marginBottom: 18 }}>The bottling line is where most of the operational waste concentrates. It is the constraint for most breweries under 10,000 barrels per year. It is also where most owners focus capital investment before they have mapped the process.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>A typical bottling line VSM</h2>
          <p style={{ marginBottom: 18 }}>The process from bright tank to packaged product: transfer to brite tank, conditioning period, carbonation check, can/bottle line setup (changeover), filling, seaming or capping, labelling, date coding, case packing, palletising, cold storage.</p>
          <p style={{ marginBottom: 18 }}>Mapping this reveals: changeover from one SKU to another takes 90 to 180 minutes at most craft operations. Carbonation checks cause 20 to 40 minute delays when the product is not at target. Line setup is inconsistent between operators — same changeover takes 90 minutes with one crew and 140 with another.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What the data shows</h2>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>OEE on the filler:</strong> Most craft filling lines run at 45 to 60 percent OEE. Minor stoppages — jams, misfeeds, foam overs — account for a large portion of performance loss. These rarely appear in production reports because each incident is under 5 minutes.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Changeover time:</strong> SMED analysis almost always finds 30 to 50 percent of changeover time is external setup being done as internal setup. Pre-staging labels, pre-assembling changeover parts, pre-programming date coders — all of this can happen before the line stops.</p>
          <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--text)' }}>Quality losses:</strong> Seam integrity checks done manually at intervals miss defects that statistical sampling would catch earlier. Moving to statistical process control on the seamer reduces end-of-line rejects.</p>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The improvement that pays back fastest</h2>
          <p style={{ marginBottom: 18 }}>At most craft breweries, the fastest return on lean investment is in changeover reduction. Halving changeover time from 120 minutes to 60 minutes adds the equivalent of several packaging runs per month. At 20 dollars per barrel in contribution margin, that is meaningful additional revenue from existing equipment.</p>

          <div style={{ background: 'rgba(1,118,211,0.06)', border: '1px solid rgba(1,118,211,0.18)', borderRadius: 12, padding: '20px 24px', marginTop: 32 }}>
            <p style={{ color: 'var(--text)', fontSize: 15, margin: '0 0 12px' }}>Ready to map your first process?</p>
            <Link href="/start" style={{ color: '#0176D3', fontWeight: 700, textDecoration: 'none' }}>Map a process free — no account needed →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
