// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yamazumi Chart: How to Balance Your Production Line — VeSiMy',
  description: 'A Yamazumi chart shows operator work content broken into value-add and waste time, compared to takt time. Learn how to build one, read it, and use it to balance your line and eliminate waste.',
  keywords: ['yamazumi chart', 'operator balance chart', 'line balancing lean', 'yamazumi manufacturing', 'takt time balance', 'value add non-value add'],
  openGraph: {
    title: 'Yamazumi Chart: How to Balance Your Production Line',
    description: 'The operator balance chart that makes line imbalance and waste immediately visible.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function YamazumiPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(29,209,161,0.15)', color: '#1DD1A1', fontFamily: 'monospace', letterSpacing: 1.5 }}>GUIDE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>7 min read · March 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            Yamazumi Chart: The Operator Balance Chart That Makes Waste Impossible to Ignore
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            A Yamazumi chart shows exactly how much of each operator's time is value-adding, necessary waste, or pure waste — compared to takt time. It is the most powerful tool for line balancing and operator-level improvement.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#B8B5D1', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What is a Yamazumi chart?</h2>
          <p style={{ marginBottom: 18 }}>
            Yamazumi (山積み) means "stacking" in Japanese. A Yamazumi chart is a stacked bar chart where each bar represents one operator or process step. The bar height is the total cycle time. The bar is divided into three sections: Value Add (VA) in green, Necessary Non-Value Add (NNVA) in amber, and Non-Value Add (NVA) in red.
          </p>
          <p style={{ marginBottom: 18 }}>
            A dashed horizontal line crosses all bars at the Takt Time level. Any bar rising above this line represents a bottleneck — that operator cannot keep pace with customer demand. The chart makes two things immediately visible: where the line is imbalanced, and where waste is hiding inside the work content.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The three categories of work</h2>
          {[
            { label: 'Value Add (VA)', color: '#1DD1A1', desc: 'Activities that physically transform the product in a way the customer recognises as valuable and would pay for. Machining, welding, assembly, painting. This is what you are selling. Every second of VA time is justified.' },
            { label: 'Necessary Non-Value Add (NNVA)', color: '#D4A208', desc: 'Activities required by the current process but that add no value from the customer\'s perspective. Setting up a machine, walking to the next station, inspecting output. Cannot be eliminated immediately but should be reduced over time through process redesign.' },
            { label: 'Non-Value Add (NVA)', color: '#FF6B6B', desc: 'Pure waste. Activities that consume time and resources but add nothing — waiting for a machine cycle to complete, searching for tools, correcting defects, walking to fetch materials that should be at point of use. Target for immediate elimination.' },
          ].map(({ label, color, desc }) => (
            <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: color, flexShrink: 0, marginTop: 3 }} />
              <div>
                <strong style={{ color, display: 'block', marginBottom: 4 }}>{label}</strong>
                <span style={{ fontSize: 14 }}>{desc}</span>
              </div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to build a Yamazumi chart</h2>
          {[
            ['Step 1: Set your takt time', 'Calculate Takt Time = Available Time ÷ Customer Demand. This becomes the horizontal reference line on your chart. Every operator\'s bar will be compared to this line.'],
            ['Step 2: Break each step into tasks', 'For each process step, list every individual task the operator performs. Include: loading material, operating the machine, unloading, walking to the next station, visual inspection, filling paperwork. Everything — even the 8-second walk counts.'],
            ['Step 3: Time each task', 'Use a stopwatch or video analysis. Time each task individually across 5–10 cycles. Use the average. Small tasks add up — a 15-second paperwork task every cycle is 2.5 minutes per hour.'],
            ['Step 4: Classify each task', 'Label each task VA, NNVA, or NVA. Be honest. Walking to a storage cabinet to fetch tools is NVA — the tools should be at point of use. Waiting for a machine cycle is NVA — the operator could be doing something productive.'],
            ['Step 5: Build the chart', 'Stack the tasks for each operator into a bar. VA at bottom (green), NNVA in the middle (amber), NVA at top (red). Draw the Takt Time line. The chart is complete.'],
          ].map(([title, body], i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(29,209,161,0.15)', color: '#1DD1A1', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                {i + 1}
              </div>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>{title}</strong>
                {body}
              </div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>How to read and act on the chart</h2>
          {[
            ['Bars above takt line', 'These operators are bottlenecks. They cannot complete their work in the time customer demand requires. First eliminate NVA from their work content. Then redistribute NNVA tasks to under-loaded operators if possible.'],
            ['Large red NVA sections', 'These are your first kaizen targets. NVA tasks can usually be eliminated directly: move tools to point of use (motion waste), fix upstream process to eliminate waiting, implement error-proofing to eliminate inspection.'],
            ['Large height variation between bars', 'If one operator\'s bar is at 180s and another is at 60s, you have severe line imbalance. Redistribute work elements from the overloaded operator to the underloaded one. The goal: all bars at takt, with maximum VA content.'],
            ['Ideal state', 'All bars at or just below takt time, with the maximum possible proportion in green (VA). No NVA sections. NNVA sections minimised. This is world-class line balance — achievable through methodical kaizen over 6–12 months.'],
          ].map(([title, body], i) => (
            <div key={i} style={{ background: 'rgba(29,209,161,0.04)', border: '1px solid rgba(29,209,161,0.15)', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: '#1DD1A1', marginBottom: 6 }}>→ {title}</div>
              <div style={{ fontSize: 13, color: '#B8B5D1', lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ marginTop: 48, padding: '32px 36px', background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              Build your Yamazumi chart free
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75 }}>
              VeSiMy generates Yamazumi charts automatically from your operator task data. Add tasks to any process step, classify them VA/NNVA/NVA, and the chart builds itself — with takt line, imbalance warnings, and kaizen targets. Free forever.
            </p>
            <Link href="/auth/signup" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#0FA876,#1DD1A1)', color: 'var(--bg)', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Build your Yamazumi chart free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
