'use client'

import React from 'react'
import Link from 'next/link'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const posts = [
  // ── v4.0 new posts ──────────────────────────────────────────────────────
  {
    slug: 'vsm-workshop-wall-session',
    tag: 'Methodology',
    tagColor: '#0176D3',
    title: 'How to Run a VSM Workshop: The Wall Session Method',
    excerpt: 'Step by step from empty wall to completed current state map. Everything you need to run your first value stream mapping workshop the right way.',
    readTime: '8 min read',
    date: 'April 2026',
  },
  {
    slug: 'value-added-vs-non-value-added',
    tag: 'Methodology',
    tagColor: '#0176D3',
    title: 'Value-Added vs Non-Value-Added: How to Classify Every Task on Your VSM Honestly',
    excerpt: 'The honest guide to classifying every activity in your process. Most teams misclassify NVA work as necessary. Here is how to stop.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: 'takt-time-calculation',
    tag: 'Methodology',
    tagColor: '#1DD1A1',
    title: 'Takt Time: What It Means, How to Calculate It, and What to Do When Your CT Exceeds It',
    excerpt: 'Takt time is the heartbeat of a lean process. If you do not know yours, you cannot know whether your process is capable of meeting demand.',
    readTime: '7 min read',
    date: 'April 2026',
  },
  {
    slug: 'theory-of-constraints',
    tag: 'Methodology',
    tagColor: '#8C44CC',
    title: 'The Theory of Constraints in Plain Language: Why You Always Fix the Bottleneck First',
    excerpt: "Eli Goldratt's most important idea, explained without jargon. Why improving anything other than the bottleneck is wasted effort.",
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: 'smed-changeover',
    tag: 'Methodology',
    tagColor: '#0176D3',
    title: 'SMED: How to Cut Changeover Time in Half Before You Buy Any New Equipment',
    excerpt: 'Single-Minute Exchange of Die explained with practical steps. Most changeover time is fixable with observation and organization, not capital.',
    readTime: '7 min read',
    date: 'April 2026',
  },
  {
    slug: 'littles-law',
    tag: 'Methodology',
    tagColor: '#1DD1A1',
    title: "Little's Law: The Simple Formula That Validates Your WIP and Lead Time Data",
    excerpt: 'A queueing theorem from 1961 that every lean practitioner should know. If your numbers do not reconcile, your data has a problem.',
    readTime: '5 min read',
    date: 'April 2026',
  },
  {
    slug: 'process-cycle-efficiency-guide',
    tag: 'Methodology',
    tagColor: '#1DD1A1',
    title: 'Process Cycle Efficiency: What PCE Means and Why Most Operations Are Between 10 and 30 Percent',
    excerpt: 'Process cycle efficiency is the most revealing single number in a VSM analysis. Here is what it measures, how to calculate it, and what to do with it.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: '5-whys-root-cause-analysis',
    tag: 'Methodology',
    tagColor: '#FF6B6B',
    title: 'How to Run a 5 Whys That Actually Finds the Root Cause and Does Not Stop at Symptoms',
    excerpt: '5 Whys is the most misused tool in lean. Here is how to use it correctly so you fix the system, not the symptom.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: 'oee-explained',
    tag: 'Methodology',
    tagColor: '#6CB9FC',
    title: 'OEE Explained: Availability, Performance, Quality, and the Six Big Losses',
    excerpt: 'Overall equipment effectiveness is the most comprehensive single metric for machine-intensive operations. Here is how to calculate it and what it reveals.',
    readTime: '7 min read',
    date: 'April 2026',
  },
  {
    slug: 'standard-work-foundation',
    tag: 'Methodology',
    tagColor: '#6CB9FC',
    title: 'Standard Work: Why It Is the Foundation of All Lean Improvement, Not Just a Procedure Manual',
    excerpt: 'Standard work is not a bureaucratic document. It is the current best method for a process, written down, so that improvement starts from a stable baseline.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: 'sub-process-mapping',
    tag: 'Methodology',
    tagColor: '#0176D3',
    title: 'Sub-Process Mapping: How to Map Feeding Processes Without Losing the Main Flow',
    excerpt: 'Sub-processes are where the real constraint often lives. Here is how to map them without creating a map that nobody can read.',
    readTime: '5 min read',
    date: 'April 2026',
  },
  {
    slug: 'current-state-vs-future-state',
    tag: 'Methodology',
    tagColor: '#0176D3',
    title: 'Current State vs Future State: The Two Maps Every Lean Project Needs',
    excerpt: 'The current state map shows what is. The future state map shows what is possible. The gap between them is where the improvement work lives.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: 'lean-healthcare-er',
    tag: 'Industry',
    tagColor: '#FF6B6B',
    title: 'How Lean Applies in Healthcare: The ER Bed Example',
    excerpt: 'Lean is not a manufacturing concept. The ER bed flow problem is one of the clearest illustrations of VSM thinking outside the factory.',
    readTime: '7 min read',
    date: 'April 2026',
  },
  {
    slug: 'vsm-construction',
    tag: 'Industry',
    tagColor: '#F7971E',
    title: 'VSM in Construction: How a Contractor Used Process Mapping to Win a Client and Deliver on Time',
    excerpt: 'Construction is not a manufacturing process, but the waste types are identical. Here is how one contractor used value stream mapping to change how they bid and deliver.',
    readTime: '7 min read',
    date: 'April 2026',
  },
  {
    slug: 'lean-brewing-bottling-line',
    tag: 'Industry',
    tagColor: '#1DD1A1',
    title: 'Lean in Brewing: Mapping the Bottling Line',
    excerpt: 'Craft brewing is a production operation with all the same waste types as any manufacturing process. Here is what a bottling line VSM reveals.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: 'process-improvement-small-business',
    tag: 'Industry',
    tagColor: '#8C44CC',
    title: 'Process Improvement in Small Business: Why You Do Not Need a Black Belt to Start',
    excerpt: 'Lean thinking is not a large-company methodology. Small businesses often have the clearest view of their waste and the fastest path to fixing it.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  {
    slug: 'vsm-service-businesses',
    tag: 'Industry',
    tagColor: '#6CB9FC',
    title: 'VSM for Service Businesses: Mapping Processes That Have No Physical Product',
    excerpt: 'Value stream mapping originated in manufacturing but applies with equal force to any process where a service flows from request to delivery.',
    readTime: '7 min read',
    date: 'April 2026',
  },
  {
    slug: 'vesimy-vs-manus-ai',
    tag: 'Comparison',
    tagColor: '#8C44CC',
    title: 'VeSiMy vs Manus AI for Small Business Process Improvement',
    excerpt: 'Choose Manus AI for general-purpose task execution. Choose VeSiMy when you need structured Lean Six Sigma improvement with measurable targets and industry-specific guidance.',
    readTime: '6 min read',
    date: 'April 2026',
  },
  // ── existing posts ───────────────────────────────────────────────────────
  {
    slug: 'smed-calculator',
    tag: 'Tool Guide',
    tagColor: '#0176D3',
    title: 'SMED Calculator: How to Calculate Changeover Savings Before You Touch a Wrench',
    excerpt: "Before you change a single procedure, a SMED calculator shows you exactly where the time goes and what you recover when you apply Shingo's three-stage methodology. Built-in tool included.",
    readTime: '7 min read',
    date: 'March 19, 2026',
  },
  {
    slug: 'vesimy-vs-excel',
    tag: 'Comparison',
    tagColor: '#6CB9FC',
    title: 'VeSiMy vs Excel for Value Stream Mapping: What Spreadsheets Actually Cost You',
    excerpt: "Nobody chose Excel for lean. But there's a real cost to running a CI programme in a tool that has no idea what a value stream is, and most teams pay it without ever adding it up.",
    readTime: '6 min read',
    date: 'March 19, 2026',
  },
  {
    slug: 'fishbone-diagram-guide',
    tag: 'Guide',
    tagColor: '#0176D3',
    title: 'Fishbone Diagram: How to Run an Ishikawa Analysis That Actually Finds the Root Cause',
    excerpt: 'A fishbone diagram that just lists "people, process, equipment" is not a root cause analysis. Here is how to run one that works, with a real machining defect example showing how deep to go.',
    readTime: '7 min read',
    date: 'March 19, 2026',
  },
  {
    slug: 'process-cycle-efficiency',
    tag: 'Guide',
    tagColor: '#1DD1A1',
    title: 'Process Cycle Efficiency: The Number That Tells You How Lean You Really Are',
    excerpt: 'Most operations teams can tell you their cycle time. Very few can tell you what percentage of their lead time is value-adding. PCE is that number, and for most manufacturers it is uncomfortable.',
    readTime: '6 min read',
    date: 'March 19, 2026',
  },
  {
    slug: '8-wastes-of-lean',
    tag: 'Guide',
    tagColor: '#C0402A',
    title: 'The 8 Wastes of Lean Manufacturing: DOWNTIME With Real Examples',
    excerpt: "Most teams can name the 8 wastes. Fewer can identify them specifically on their own floor and build an actionable elimination backlog. Here's the full DOWNTIME breakdown with shop floor examples.",
    readTime: '10 min read',
    date: 'March 19, 2026',
  },
  {
    slug: 'what-is-value-stream-mapping',
    tag: 'Guide',
    tagColor: '#0176D3',
    title: "What Is Value Stream Mapping? The Complete Guide for 2026",
    excerpt: "Value stream mapping (VSM) is the single most powerful lean tool available to manufacturers. Here's how it works, when to use it, and how to run your first VSM session, with a free digital tool.",
    readTime: '8 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'free-vsm-tool',
    tag: 'Tool',
    tagColor: '#1DD1A1',
    title: "The Best Free VSM Tool in 2026 (That's Actually Free)",
    excerpt: "Most VSM software costs $200–$500 per month and requires a 2-day training course. VeSiMy is Free to start, no credit card., works on your phone, and takes 5 minutes to learn. Here's an honest comparison.",
    readTime: '5 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'kaizen-event-template',
    tag: 'Template',
    tagColor: '#6CB9FC',
    title: 'How to Run a Kaizen Event: Template, Checklist, and Examples',
    excerpt: 'A kaizen event is a focused 3–5 day improvement sprint. Done right, it delivers measurable results in days, not months. Here is the exact template used by the best lean teams.',
    readTime: '7 min read',
    date: 'March 12, 2026',
  },
  {
    slug: '5-why-analysis-examples',
    tag: 'Guide',
    tagColor: '#FF6B6B',
    title: '5 Why Analysis: 6 Real Examples From the Shop Floor',
    excerpt: 'The 5 Why technique sounds simple but most teams stop too early or ask the wrong questions. Here are 6 real manufacturing examples that show you exactly how deep to dig.',
    readTime: '6 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'takt-time-calculator',
    tag: 'Calculator',
    tagColor: '#1DD1A1',
    title: 'Takt Time Calculator: Formula, Examples & Free Tool',
    excerpt: 'Takt time is the heartbeat of lean manufacturing, the pace customer demand requires. Learn the formula, see 4 worked examples, and find out what to do once you have the number.',
    readTime: '5 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'pdca-in-manufacturing',
    tag: 'Guide',
    tagColor: '#8C44CC',
    title: 'PDCA in Manufacturing: The Complete Guide to Plan-Do-Check-Act',
    excerpt: 'PDCA is the backbone of ISO 9001 and lean manufacturing. Learn how to run it correctly, how it connects to A3, 8D, and DMAIC, and why the Check phase is the one everyone skips.',
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'yamazumi-chart-guide',
    tag: 'Guide',
    tagColor: '#1DD1A1',
    title: 'Yamazumi Chart: The Operator Balance Chart That Makes Waste Impossible to Ignore',
    excerpt: "A Yamazumi chart shows exactly how much of each operator's time is value-adding vs waste, compared to takt time. The most powerful tool for line balancing and operator-level improvement.",
    readTime: '7 min read',
    date: 'March 2026',
  },
  {
    slug: 'standard-work-manufacturing',
    tag: 'Guide',
    tagColor: '#6CB9FC',
    title: 'Standard Work: The Foundation of All Lean Improvement',
    excerpt: 'Standard Work is not a procedure manual in a binder. It is the current best method, the baseline that makes every future improvement measurable. Without it, you cannot improve. You can only change.',
    readTime: '6 min read',
    date: 'March 2026',
  },
  {
    slug: 'automotive-process-improvement',
    tag: 'Industry',
    tagColor: '#0176D3',
    title: 'Process Improvement in Automotive Manufacturing: Where Every Second Has a Price Tag',
    excerpt: "Takt-driven lines, model-mix complexity, and supplier quality cascades make automotive one of the most process-intensive environments in manufacturing. Here's how structured CI tools address it.",
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'aerospace-process-improvement',
    tag: 'Industry',
    tagColor: '#6CB9FC',
    title: 'Process Improvement in Aerospace: Where Zero Defects Is the Floor, Not the Goal',
    excerpt: "Low-volume, high-complexity assemblies with airtight documentation requirements. Here's how CI tools apply in an environment where every non-conformance costs 10–15% of program cost.",
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'food-beverage-process-improvement',
    tag: 'Industry',
    tagColor: '#1DD1A1',
    title: 'Freshness Is a Process Problem: CI in Food & Beverage Manufacturing',
    excerpt: "Yield loss, changeover waste, sanitation downtime, and food safety compliance, all on the same line. Here's how structured CI addresses the unique challenges of food & beverage production.",
    readTime: '8 min read',
    date: 'March 2026',
  },
  {
    slug: 'medical-devices-process-improvement',
    tag: 'Industry',
    tagColor: '#FF6B6B',
    title: "FDA Doesn't Grade on a Curve: CI in Medical Device Manufacturing",
    excerpt: 'CAPA traceability, first-time quality, and a regulatory environment where the cost of getting it wrong is measured in consent decrees. How VeSiMy supports structured improvement in medical devices.',
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'logistics-process-improvement',
    tag: 'Industry',
    tagColor: '#F7971E',
    title: 'Speed Without Structure Is Just Chaos: CI in Logistics and Warehousing',
    excerpt: 'Motion waste, dock-to-stock time, pick accuracy, and fulfillment windows. How structured process improvement helps logistics operations compete on reliability, not just speed.',
    readTime: '8 min read',
    date: 'March 2026',
  },
  {
    slug: 'electronics-process-improvement',
    tag: 'Industry',
    tagColor: '#8C44CC',
    title: "Yield Loss Isn't in the Component. It's in the Process.",
    excerpt: "SMT line OEE, solder defect rates, and the brutal math of scrapping a $400 PCB over a $0.02 process step. How CI tools address electronics manufacturing's most costly failure modes.",
    readTime: '8 min read',
    date: 'March 2026',
  },
  {
    slug: 'pharmaceuticals-process-improvement',
    tag: 'Industry',
    tagColor: '#1DD1A1',
    title: 'Every Deviation Is a Documented Failure or a Documented Lesson: CI in Pharmaceuticals',
    excerpt: 'GMP compliance, batch record accuracy, deviation investigation, and a regulatory environment where drug recalls average $10M+. How structured CI makes the difference between a compliant system and a learning one.',
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'industrial-process-improvement',
    tag: 'Industry',
    tagColor: '#0176D3',
    title: "The Machine Doesn't Know It's Inefficient. You Have to Tell It.",
    excerpt: "Heavy industrial, job shops, and custom fabrication, the environments that said lean doesn't apply here. They were wrong. Here's how structured CI works in high-mix, low-volume industrial manufacturing.",
    readTime: '8 min read',
    date: 'March 2026',
  },
]

export default function BlogPageClient() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}>
          ← Back to VeSiMy
        </Link>

        <p style={{ fontSize: 11, color: '#0176D3', letterSpacing: 3, fontFamily: 'var(--font-mono)', marginBottom: 14, textTransform: 'uppercase' }}>
          Resources
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 12, lineHeight: 1.1 }}>
          Lean Manufacturing Blog
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75, maxWidth: 580 }}>
          Practical guides, templates, and deep-dives on VSM, Kaizen, 5 Why, and AI-driven process improvement, plus industry-specific guides for every major sector.
        </p>

        <Link href="/industries" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(1,118,211,0.08)', border: '1px solid rgba(1,118,211,0.3)',
          color: '#0176D3', fontSize: 13, fontWeight: 700, padding: '9px 18px',
          borderRadius: 9, textDecoration: 'none', marginBottom: 48,
        }}>
          Browse by Industry →
        </Link>

        {/* Lean Guides */}
        <p style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 3, fontFamily: 'var(--font-mono)', marginBottom: 20, textTransform: 'uppercase' }}>
          Lean Guides &amp; Templates
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 24, marginBottom: 64 }}>
          {posts.filter(p => p.tag !== 'Industry').map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Industry Guides */}
        <p style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 3, fontFamily: 'var(--font-mono)', marginBottom: 8, textTransform: 'uppercase' }}>
          Industry Guides
        </p>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.7 }}>
          Every industry runs on processes. These guides explore how structured CI applies to the specific challenges of each sector.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 24, marginBottom: 48 }}>
          {posts.filter(p => p.tag === 'Industry').map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Link href="/industries" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(1,118,211,0.08)', border: '1px solid rgba(1,118,211,0.3)',
          color: '#0176D3', fontSize: 13, fontWeight: 700, padding: '10px 20px',
          borderRadius: 9, textDecoration: 'none',
        }}>
          View all industries on one page →
        </Link>

      </div>
    </div>
  )
}

function PostCard({ post }: { post: (typeof posts)[0]; key?: string }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article style={{
        background: 'rgba(248,247,245,0.97)',
        border: '1px solid rgba(44,44,92,0.86)',
        borderRadius: 18,
        padding: '28px 28px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
            background: `${post.tagColor}1a`, color: post.tagColor,
            fontFamily: 'var(--font-mono)', letterSpacing: 1.5,
          }}>
            {post.tag}
          </span>
          <span style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'var(--font-mono)' }}>{post.readTime}</span>
        </div>

        <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3, flex: 1 }}>
          {post.title}
        </h2>

        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 20 }}>
          {post.excerpt}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--sl-400)' }}>{post.date}</span>
          <span style={{ fontSize: 13, color: '#0176D3' }}>Read →</span>
        </div>
      </article>
    </Link>
  )
}
