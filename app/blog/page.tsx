import type { Metadata } from 'next'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog — VeSiMy | Lean Manufacturing & AI Process Improvement',
  description: 'Guides, templates, and deep-dives on lean manufacturing, value stream mapping, kaizen, 5 Why analysis, and AI process optimization.',
}

export default function BlogPage() {
  return <BlogPageClient />
}
