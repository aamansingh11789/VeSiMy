// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── app/api/v2/parse-sop/route.ts ─────────────────────────────────────────────
// Accepts: multipart/form-data with a file (PDF, DOCX, TXT, RTF, MD, CSV)
// Extracts text, calls Claude to parse into structured VSM steps.
// Returns: ParsedSOP JSON ready for the V2 map canvas.

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { extractTextFromFile, parseSOP } from '@/lib/v2/sop-parser'

export const maxDuration = 60  // SOP parsing can take time

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('industry').eq('id', user.id).single()
    const industry = profile?.industry || 'general_manufacturing'

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const manualText = formData.get('manual_text') as string | null

    if (file && file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum file size is 5MB.' }, { status: 413 })
    }

    let rawText = ''
    let filename = 'manual_input'

    if (file && file.size > 0) {
      filename = file.name
      const buffer = Buffer.from(await file.arrayBuffer())
      const mimeType = file.type || ''
      rawText = await extractTextFromFile(buffer, filename, mimeType)
    } else if (manualText) {
      rawText = manualText
      filename = 'manual_input'
    } else {
      return NextResponse.json({ error: 'No file or text provided' }, { status: 400 })
    }

    if (!rawText || rawText.length < 20) {
      return NextResponse.json({ error: 'Could not extract readable text from this file. Try pasting the text manually.' }, { status: 422 })
    }

    const parsed = await parseSOP(rawText, industry)

    return NextResponse.json({
      success: true,
      filename,
      raw_text_preview: rawText.slice(0, 500),
      parsed,
    })

  } catch (err: any) {
    console.error('[parse-sop]', err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
