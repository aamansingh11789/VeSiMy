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
    excerpt: "Most VSM software costs $200–$500 per month and requires a 2-day training course. VeSiMy is free forever, works on your phone, and takes 5 minutes to learn. Here's an honest comparison.",
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
]

export default function BlogPageClient() {
  return (
    <div style={{ minHeight: '100vh', color: '#EAE8F4' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/" style={{ fontSize: 13, color: '#8B88B3', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}>
          ← Back to VeSiMy
        </Link>

        <p style={{ fontSize: 11, color: '#D4A208', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 14, textTransform: 'uppercase' }}>
          Resources
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: '#F3F1FB', marginBottom: 12, lineHeight: 1.1 }}>
          Lean Manufacturing Blog
        </h1>
        <p style={{ fontSize: 15, color: '#8B88B3', marginBottom: 56, lineHeight: 1.75, maxWidth: 580 }}>
          Practical guides, templates, and deep-dives on VSM, Kaizen, 5 Why, and AI-driven process improvement.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 24 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{
                background: 'rgba(8,8,24,0.78)',
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
                  <span style={{ fontSize: 12, color: '#52507A', fontFamily: 'monospace' }}>{post.readTime}</span>
                </div>

                <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#F3F1FB', marginBottom: 12, lineHeight: 1.3, flex: 1 }}>
                  {post.title}
                </h2>

                <p style={{ fontSize: 13, color: '#8B88B3', lineHeight: 1.75, marginBottom: 20 }}>
                  {post.excerpt}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#52507A' }}>{post.date}</span>
                  <span style={{ fontSize: 13, color: '#D4A208' }}>Read →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
