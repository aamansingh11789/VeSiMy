// @ts-nocheck
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lean Manufacturing Blog — VeSiMy',
  description: 'Guides, templates, and deep dives on value stream mapping, kaizen, 5 Why analysis, SMED, and AI-powered continuous improvement for manufacturing teams.',
}

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const posts = [
  {
    slug: 'what-is-value-stream-mapping',
    tag: 'GUIDE',
    tagColor: '#D4A208',
    title: 'What Is Value Stream Mapping? The Complete Guide for 2026',
    excerpt: 'VSM is the most powerful lean tool most teams use wrong. Learn what value stream mapping really is, how to read one, and how to build your first map in under an hour.',
    readTime: '8 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'free-vsm-tool',
    tag: 'TOOL',
    tagColor: '#1DD1A1',
    title: 'The Best Free VSM Tool in 2026 (No Visio Required)',
    excerpt: 'Visio costs $15/month and requires hours of setup. Here are the best free alternatives — including a browser-based tool that builds your map in 60 seconds.',
    readTime: '5 min read',
    date: 'March 12, 2026',
  },
  {
    slug: 'kaizen-event-template',
    tag: 'TEMPLATE',
    tagColor: '#6CB9FC',
    title: 'Kaizen Event Template: Run a 5-Day Improvement Workshop',
    excerpt: 'A complete kaizen event template with daily agenda, team roles, tracking sheet, and a before/after report format — free to download and use.',
    readTime: '6 min read',
    date: 'March 12, 2026',
  },
  {
    slug: '5-why-analysis-examples',
    tag: 'EXAMPLES',
    tagColor: '#FF6B6B',
    title: '5 Why Analysis: 10 Real Manufacturing Examples (With Templates)',
    excerpt: 'Root cause analysis is only useful if you ask the right questions. These 10 real examples from automotive, food & bev, and medical manufacturing show you how.',
    readTime: '10 min read',
    date: 'March 12, 2026',
  },
]

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', color: '#EAE8F4' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,6vw,88px) clamp(20px,5vw,40px)' }}>

        <Link href="/" style={{ fontSize: 13, color: '#8B88B3', textDecoration: 'none', marginBottom: 48, display: 'inline-block' }}>
          ← Back to VeSiMy
        </Link>

        <p style={{ fontSize: 11, color: '#D4A208', letterSpacing: 3, fontFamily: 'monospace', marginBottom: 14, marginTop: 16, textTransform: 'uppercase' }}>
          Learning Center
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, color: '#F3F1FB', marginBottom: 12, lineHeight: 1.1 }}>
          Lean Manufacturing Blog
        </h1>
        <p style={{ fontSize: 16, color: '#8B88B3', marginBottom: 56, lineHeight: 1.75, maxWidth: 560 }}>
          Practical guides on VSM, kaizen, 5 Why, and AI-powered continuous improvement.
          Written for practitioners, not consultants.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: 24 }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <article style={{
                background: 'rgba(8,8,24,0.78)', border: '1px solid rgba(44,44,92,0.86)',
                borderRadius: 16, padding: '28px 28px', height: '100%',
                transition: 'border-color 0.2s, transform 0.2s',
                display: 'flex', flexDirection: 'column',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,162,8,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(44,44,92,0.86)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                    background: `${post.tagColor}22`, color: post.tagColor,
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
                  <span style={{ fontSize: 13, color: '#D4A208', fontWeight: 600 }}>Read →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
