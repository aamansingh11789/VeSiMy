// @ts-nocheck
'use client'

import Link from 'next/link'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const posts = [
  {
    slug: 'what-is-value-stream-mapping',
    tag: 'Guide',
    tagColor: '#D4A208',
    title: "What Is Value Stream Mapping? The Complete Guide for 2026",
    excerpt: "Value stream mapping (VSM) is the single most powerful lean tool available to manufacturers. Here's how it works, when to use it, and how to run your first VSM session — with a free digital tool.",
    readTime: '8 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'free-vsm-tool',
    tag: 'Tool',
    tagColor: '#1DD1A1',
    title: "The Best Free VSM Tool in 2026 (That's Actually Free)",
    excerpt: "Most VSM software costs $200–$500 per month and requires a 2-day training course. VeSiMy is 14-day free trial, works on your phone, and takes 5 minutes to learn. Here's an honest comparison.",
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
    excerpt: 'Takt time is the heartbeat of lean manufacturing — the pace customer demand requires. Learn the formula, see 4 worked examples, and find out what to do once you have the number.',
    readTime: '5 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'pdca-in-manufacturing',
    tag: 'Guide',
    tagColor: '#8C44CC',
    title: 'PDCA in Manufacturing: The Complete Guide to Plan-Do-Check-Act',
    excerpt: 'PDCA is the backbone of ISO 9001 and lean manufacturing. Learn how to run it correctly, how it connects to A3, 8D, and DMAIC — and why the Check phase is the one everyone skips.',
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'yamazumi-chart-guide',
    tag: 'Guide',
    tagColor: '#1DD1A1',
    title: 'Yamazumi Chart: The Operator Balance Chart That Makes Waste Impossible to Ignore',
    excerpt: 'A Yamazumi chart shows exactly how much of each operator\'s time is value-adding vs waste, compared to takt time. The most powerful tool for line balancing and operator-level improvement.',
    readTime: '7 min read',
    date: 'March 2026',
  },
  {
    slug: 'standard-work-manufacturing',
    tag: 'Guide',
    tagColor: '#6CB9FC',
    title: 'Standard Work: The Foundation of All Lean Improvement',
    excerpt: 'Standard Work is not a procedure manual in a binder. It is the current best method — the baseline that makes every future improvement measurable. Without it, you cannot improve. You can only change.',
    readTime: '6 min read',
    date: 'March 2026',
  },
  {
    slug: 'automotive-process-improvement',
    tag: 'Industry',
    tagColor: '#D4A208',
    title: 'Process Improvement in Automotive Manufacturing: Where Every Second Has a Price Tag',
    excerpt: 'Takt-driven lines, model-mix complexity, and supplier quality cascades make automotive one of the most process-intensive environments in manufacturing. Here\'s how structured CI tools address it.',
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'aerospace-process-improvement',
    tag: 'Industry',
    tagColor: '#6CB9FC',
    title: 'Process Improvement in Aerospace: Where Zero Defects Is the Floor, Not the Goal',
    excerpt: 'Low-volume, high-complexity assemblies with airtight documentation requirements. Here\'s how CI tools apply in an environment where every non-conformance costs 10–15% of program cost.',
    readTime: '9 min read',
    date: 'March 2026',
  },
  {
    slug: 'food-beverage-process-improvement',
    tag: 'Industry',
    tagColor: '#1DD1A1',
    title: 'Freshness Is a Process Problem: CI in Food & Beverage Manufacturing',
    excerpt: 'Yield loss, changeover waste, sanitation downtime, and food safety compliance — all on the same line. Here\'s how structured CI addresses the unique challenges of food & beverage production.',
    readTime: '8 min read',
    date: 'March 2026',
  },
  {
    slug: 'medical-devices-process-improvement',
    tag: 'Industry',
    tagColor: '#FF6B6B',
    title: 'FDA Doesn\'t Grade on a Curve: CI in Medical Device Manufacturing',
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
    title: 'Yield Loss Isn\'t in the Component. It\'s in the Process.',
    excerpt: 'SMT line OEE, solder defect rates, and the brutal math of scrapping a $400 PCB over a $0.02 process step. How CI tools address electronics manufacturing\'s most costly failure modes.',
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
    tagColor: '#D4A208',
    title: 'The Machine Doesn\'t Know It\'s Inefficient. You Have to Tell It.',
    excerpt: 'Heavy industrial, job shops, and custom fabrication — the environments that said lean doesn\'t apply here. They were wrong. Here\'s how structured CI works in high-mix, low-volume industrial manufacturing.',
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

        <p style={{ fontSize: 11, color: '#D4A208', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 14, textTransform: 'uppercase' }}>
          Resources
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 12, lineHeight: 1.1 }}>
          Lean Manufacturing Blog
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.75, maxWidth: 580 }}>
          Practical guides, templates, and deep-dives on VSM, Kaizen, 5 Why, and AI-driven process improvement — plus industry-specific guides for every major sector.
        </p>

        <Link href="/industries" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(212,162,8,0.08)', border: '1px solid rgba(212,162,8,0.3)',
          color: '#D4A208', fontSize: 13, fontWeight: 700, padding: '9px 18px',
          borderRadius: 9, textDecoration: 'none', marginBottom: 48,
        }}>
          🏭 Browse by Industry →
        </Link>

        {/* Lean Guides */}
        <p style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 20, textTransform: 'uppercase' }}>
          Lean Guides &amp; Templates
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 24, marginBottom: 64 }}>
          {posts.filter(p => p.tag !== 'Industry').map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Industry Guides */}
        <p style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 8, textTransform: 'uppercase' }}>
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
          background: 'rgba(212,162,8,0.08)', border: '1px solid rgba(212,162,8,0.3)',
          color: '#D4A208', fontSize: 13, fontWeight: 700, padding: '10px 20px',
          borderRadius: 9, textDecoration: 'none',
        }}>
          View all industries on one page →
        </Link>

      </div>
    </div>
  )
}

function PostCard({ post }: { post: (typeof posts)[0] }) {
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
            fontFamily: 'monospace', letterSpacing: 1.5,
          }}>
            {post.tag}
          </span>
          <span style={{ fontSize: 12, color: 'var(--sl-400)', fontFamily: 'monospace' }}>{post.readTime}</span>
        </div>

        <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3, flex: 1 }}>
          {post.title}
        </h2>

        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 20 }}>
          {post.excerpt}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--sl-400)' }}>{post.date}</span>
          <span style={{ fontSize: 13, color: '#D4A208' }}>Read →</span>
        </div>
      </article>
    </Link>
  )
}
