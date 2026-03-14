// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Run a Kaizen Event: Template, Checklist & Examples 2026 — VeSiMy',
  description: 'A kaizen event is a focused 3–5 day improvement sprint. This guide gives you the exact template, pre-event checklist, and daily agenda used by lean teams to deliver measurable results in days.',
  keywords: ['kaizen event template', 'kaizen event checklist', 'how to run a kaizen event', 'kaizen blitz', 'lean manufacturing kaizen', 'continuous improvement sprint'],
  openGraph: {
    title: 'How to Run a Kaizen Event: Template, Checklist & Examples',
    description: 'The exact template, checklist, and daily agenda used by lean teams to run a kaizen event that delivers real results in 3–5 days.',
    type: 'article',
  },
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

export default function KaizenEventPost() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to Blog
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(108,185,252,0.15)', color: '#6CB9FC', fontFamily: 'monospace', letterSpacing: 1.5 }}>TEMPLATE</span>
            <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>7 min read · March 12, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
            How to Run a Kaizen Event: Template, Checklist, and Examples
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8 }}>
            A kaizen event is a focused 3–5 day improvement sprint. Done right, it delivers measurable results in days, not months. Here is the exact template used by the best lean teams.
          </p>
        </div>

        <div style={{ fontSize: 15, color: '#B8B5D1', lineHeight: 1.9 }}>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What is a kaizen event?</h2>
          <p style={{ marginBottom: 18 }}>
            A kaizen event (also called a kaizen blitz or rapid improvement event) is a short, intensive workshop where a cross-functional team focuses all their attention on improving a single process or problem. The team meets every day for 3–5 days, maps the current state, identifies waste, implements changes, and measures the result — all before the week is over.
          </p>
          <p style={{ marginBottom: 18 }}>
            Unlike traditional improvement projects that drag on for months, a kaizen event creates urgency and momentum. Teams are empowered to <em style={{ color: 'var(--text)' }}>implement changes immediately</em>, not write reports and wait for approval cycles.
          </p>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>When to run a kaizen event</h2>
          <p style={{ marginBottom: 14 }}>A kaizen event works best when:</p>
          {[
            'A specific process has a known quality, speed, or cost problem',
            'The problem is contained enough to tackle in a week (not a whole product line)',
            'Management is willing to free up 4–6 people for the full duration',
            'The team has authority to implement changes without a 6-week approval process',
            'You have baseline data to measure improvement against',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{ color: '#6CB9FC', fontWeight: 800, flexShrink: 0, marginTop: 2 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>Pre-event checklist (2 weeks before)</h2>
          <p style={{ marginBottom: 16 }}>Poor preparation is the #1 reason kaizen events fail. Complete every item on this list before the event begins:</p>
          {[
            ['Define the target process', 'Which exact process, which shift, which product family. Be specific.'],
            ['Set measurable goals', 'e.g. "Reduce cycle time from 4.2 min to 2.8 min" — not "improve efficiency"'],
            ['Select the team', '4–6 people: 1 facilitator, 2–3 operators who actually do the work, 1 engineer, 1 manager'],
            ['Collect baseline data', 'Cycle times, defect rates, downtime, inventory counts — whatever your goal is measuring'],
            ['Walk the gemba', 'Facilitator walks the process floor before the event to understand current state'],
            ['Arrange cover for team members', 'The team cannot be pulled away during the event — arrange backfill in advance'],
            ['Book the war room', 'A dedicated space with whiteboards and wall space for the entire week'],
            ['Prepare supplies', 'Sticky notes, markers, stopwatches, tape, flip chart paper, and a camera'],
          ].map(([title, desc], i) => (
            <div key={i} style={{ background: 'rgba(108,185,252,0.04)', border: '1px solid rgba(108,185,252,0.15)', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: '#6CB9FC', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>{desc}</div>
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The 5-day kaizen event agenda</h2>

          {[
            {
              day: 'Day 1', label: 'Understand', color: '#D4A208',
              items: [
                'Morning: Team kickoff — review goals, ground rules, and roles',
                'Review baseline data and go to gemba (the actual work floor)',
                'Time study: stopwatch each step, count inventory at every station',
                'Afternoon: Draw current state value stream map as a team',
                'Identify the top 3 wastes and biggest opportunity area',
                'Evening homework: Each team member writes down their improvement ideas',
              ]
            },
            {
              day: 'Day 2', label: 'Analyse', color: '#6CB9FC',
              items: [
                'Morning: Share and discuss overnight ideas',
                'Run 5 Why analysis on the top defects and delays found on Day 1',
                'Fishbone diagram for the root cause of the biggest problem',
                'Afternoon: Draw future state value stream map — what should this look like?',
                'Identify quick wins (can implement Day 3) vs longer-term changes',
                'Create an action log: owner, action, deadline for every improvement',
              ]
            },
            {
              day: 'Day 3', label: 'Implement', color: '#1DD1A1',
              items: [
                'Full day on the floor implementing quick wins',
                'Rearrange workstations, update standard work, fix tooling issues',
                'Update visual management boards and labels',
                'Prototype any new process flows at reduced speed',
                'Test and time the new process — is it faster? fewer defects?',
                'Document every change made with before/after photos',
              ]
            },
            {
              day: 'Day 4', label: 'Refine', color: '#FF6B6B',
              items: [
                'Run the new process at full production speed',
                'Measure actual cycle times, count errors, track downtime',
                'Fix issues found during Day 3 testing',
                'Update standard operating procedures (SOPs) to reflect changes',
                'Train all operators on the new standard — not just the team members',
                'Afternoon: Begin preparing the results presentation',
              ]
            },
            {
              day: 'Day 5', label: 'Sustain', color: '#8C44CC',
              items: [
                'Morning: Final measurements and data collection',
                'Calculate improvement: before vs after on all target metrics',
                'Complete the 30-60-90 day action plan for remaining items',
                'Assign owners to every open action — no orphan tasks',
                'Afternoon: Present results to leadership and broader team',
                'Celebrate — kaizen events are hard work. Acknowledge the team.',
              ]
            },
          ].map(({ day, label, color, items }) => (
            <div key={day} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 8, padding: '6px 14px', fontFamily: 'monospace', fontWeight: 800, color, fontSize: 13 }}>
                  {day}
                </div>
                <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{label}</span>
              </div>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color, flexShrink: 0 }}>→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>What good results look like</h2>
          <p style={{ marginBottom: 16 }}>Well-run kaizen events consistently deliver:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
            {[
              ['30–50%', 'reduction in lead time'],
              ['20–40%', 'reduction in floor space used'],
              ['50–80%', 'reduction in defects'],
              ['25–60%', 'improvement in productivity'],
            ].map(([num, label]) => (
              <div key={num} style={{ background: 'rgba(248,247,245,0.97)', border: '1px solid rgba(44,44,92,0.6)', borderRadius: 12, padding: '18px', textAlign: 'center' }}>
                <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: '#6CB9FC', marginBottom: 6 }}>{num}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '40px 0 14px' }}>The most common kaizen event mistakes</h2>
          {[
            ['Skipping the pre-work', 'Teams show up on Day 1 with no data and spend the whole event figuring out what the problem actually is. Do the gemba walk and data collection before the event starts.'],
            ['No management presence', 'If leadership doesn\'t show up to the Day 1 kickoff and Day 5 presentation, the team feels the project doesn\'t matter. Leadership engagement is non-negotiable.'],
            ['Letting people leave early', 'The team gets pulled back to their "real jobs" mid-event. If that happens, you lose the momentum that makes kaizen events work.'],
            ['Not sustaining the gains', 'Results slip back within 60 days because nobody owns the new standard. Every change needs an SOP, visual control, and a named owner.'],
            ['Too big a scope', 'Trying to fix 10 things in a week means fixing none of them properly. Pick the biggest lever and go deep on it.'],
          ].map(([title, body], i) => (
            <div key={i} style={{ background: 'rgba(255,107,107,0.04)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: '#FF6B6B', marginBottom: 6 }}>✕ {title}</div>
              <div style={{ fontSize: 13, color: '#B8B5D1' }}>{body}</div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ marginTop: 48, padding: '32px 36px', background: 'rgba(108,185,252,0.06)', border: '1px solid rgba(108,185,252,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              Track your kaizen events digitally
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75 }}>
              VeSiMy's Kaizen Tracker links improvement events directly to your VSM process steps — so you always know what's been changed, what's pending, and what the result was. 14-day free trial.
            </p>
            <Link href="/auth/signup" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#4A9EDA,#6CB9FC)', color: 'var(--bg)', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Start tracking kaizen events free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
