// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What Is Value Stream Mapping? The Complete Guide for 2026 — VeSiMy',
  description: 'Value stream mapping (VSM) visualizes every step your product takes from raw material to customer. Learn what VSM is, how to read one, and how to build your first map free.',
  keywords: ['value stream mapping', 'VSM guide', 'lean manufacturing', 'what is value stream mapping', 'free VSM tool'],
  openGraph: {
    title: 'What Is Value Stream Mapping? The Complete Guide for 2026',
    description: 'Learn what VSM is, how to read one, and how to build your first map in under an hour — for free.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function VSMPost() {
  return (
    <div style={{ minHeight: '100vh', color: '#EAE8F4' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: '#8B88B3', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(212,162,8,0.15)', color: '#D4A208', fontFamily: 'monospace', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>8 min read · March 12, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#F3F1FB', lineHeight: 1.15, marginBottom: 20 }}>
            What Is Value Stream Mapping? The Complete Guide for 2026
          </h1>
          <p style={{ fontSize: 17, color: '#8B88B3', lineHeight: 1.8 }}>
            Value stream mapping is the most powerful lean tool most teams use wrong — or don't use at all. Here's everything you need to know, including how to build your first map today for free.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#B8B5D1', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: '#F3F1FB', margin: '40px 0 14px' }}>What is a value stream map?</h2>
          <p style={{ marginBottom: 18 }}>
            A value stream map (VSM) is a visual diagram that shows every step, every delay, and every handoff your product goes through — from the moment raw materials arrive to the moment a customer receives it.
          </p>
          <p style={{ marginBottom: 18 }}>
            The key insight of VSM is this: most of the time a product spends in your facility is <em style={{ color: '#F3F1FB' }}>waiting</em>, not moving. Studies consistently show that 80–95% of total lead time in manufacturing is pure waste — queues, transport, storage, rework.
          </p>
          <p style={{ marginBottom: 18 }}>
            A VSM makes all of that waste <strong style={{ color: '#F3F1FB' }}>visible</strong>. You can't improve what you can't see.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: '#F3F1FB', margin: '40px 0 14px' }}>The two maps: current state vs future state</h2>
          <p style={{ marginBottom: 18 }}>
            Every VSM project starts with a <strong style={{ color: '#D4A208' }}>current state map</strong> — an honest picture of exactly how your process works today. Not how it's supposed to work. How it actually works.
          </p>
          <p style={{ marginBottom: 18 }}>
            From there, you build a <strong style={{ color: '#D4A208' }}>future state map</strong> — what the process should look like after you've eliminated the waste you found. The gap between current and future state is your kaizen roadmap.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: '#F3F1FB', margin: '40px 0 14px' }}>The 5 key numbers every VSM must show</h2>
          {[
            ['Cycle Time (CT)', 'How long it actually takes to complete one unit at each step'],
            ['Changeover Time (CO)', 'How long it takes to switch from one product to another'],
            ['Uptime (%)', 'What percentage of the time is the process actually running vs down'],
            ['Inventory', 'How many units are waiting between each step (the triangles on the map)'],
            ['Lead Time', 'Total time from customer order to delivery — the number that matters most'],
          ].map(([term, def]) => (
            <div key={term} style={{ background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.15)', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
              <span style={{ color: '#D4A208', fontWeight: 700 }}>{term}:</span> {def}
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: '#F3F1FB', margin: '40px 0 14px' }}>The 8 wastes VSM reveals (DOWNTIME)</h2>
          <p style={{ marginBottom: 16 }}>Once you can see your process, you'll find these wastes hiding in it:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10, marginBottom: 24 }}>
            {[
              ['D — Defects', 'Rework, scrap, customer returns'],
              ['O — Overproduction', 'Making more than the customer ordered'],
              ['W — Waiting', 'People or machines idle between steps'],
              ['N — Non-utilized talent', 'Skills and ideas your people have that nobody asks for'],
              ['T — Transportation', 'Moving materials unnecessarily'],
              ['I — Inventory', 'Work in progress piling up between steps'],
              ['M — Motion', 'Unnecessary movement of people'],
              ['E — Extra processing', 'Steps that add cost but not customer value'],
            ].map(([waste, desc]) => (
              <div key={waste} style={{ background: 'rgba(8,8,24,0.78)', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, color: '#F3F1FB', fontSize: 13, marginBottom: 4 }}>{waste}</div>
                <div style={{ fontSize: 12, color: '#8B88B3' }}>{desc}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: '#F3F1FB', margin: '40px 0 14px' }}>How to build your first VSM in under an hour</h2>
          {[
            ['Step 1: Pick one product family', 'Don\'t try to map your entire facility. Pick one product family — ideally the one with the most customer demand or the biggest quality issues.'],
            ['Step 2: Walk the floor', 'Starting from shipping and working backwards to receiving, follow the actual path your product takes. Sketch it on paper as you go. Time each step with a stopwatch.'],
            ['Step 3: Collect the data', 'At each step, record: cycle time, changeover time, uptime, number of operators, and inventory count (count the actual units sitting there).'],
            ['Step 4: Draw the current state', 'Using standard VSM symbols, draw the flow of material (bottom of the map) and information (top of the map). Add your data boxes under each step.'],
            ['Step 5: Calculate total lead time', 'Add up all the inventory triangles and all the cycle times. That\'s your current lead time. Most teams are shocked how high it is.'],
            ['Step 6: Identify the biggest waste', 'Where is the most inventory piling up? Which step has the lowest uptime? That\'s where you start.'],
          ].map(([title, body], i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(212,162,8,0.15)', color: '#D4A208', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                {i + 1}
              </div>
              <div>
                <strong style={{ color: '#F3F1FB', display: 'block', marginBottom: 6 }}>{title}</strong>
                {body}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ marginTop: 48, padding: '32px 36px', background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: '#F3F1FB', marginBottom: 10 }}>
              Ready to build your first VSM?
            </h3>
            <p style={{ fontSize: 14, color: '#8B88B3', marginBottom: 24, lineHeight: 1.75 }}>
              VeSiMy's VSM tool is free, browser-based, and works on any device. No download, no setup, no Visio license required.
            </p>
            <Link href="/auth/signup" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#C49510,#D4A208)', color: '#03030D', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Build your VSM free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
