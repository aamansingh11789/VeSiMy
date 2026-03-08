// @ts-nocheck
'use client'
// ── components/learn/LearningCenter.tsx ──────────────────────────────────────
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Lesson { id:string; module:string; title:string; content:string; order_index:number; quiz_json?:any; pass_score:number }
interface Progress { lesson_id:string; completed:boolean; score:number }
interface Props { userId: string }

const MOD_ICON: Record<string,string> = { lean_basics:'🏭', vsm:'〜', kaizen:'⚡', kanban:'📋' }

export function LearningCenter({ userId }: Props) {
  const [lessons,  setLessons]  = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [active,   setActive]   = useState<Lesson|null>(null)
  const [quiz,     setQuiz]     = useState(false)
  const [qIdx,     setQIdx]     = useState(0)
  const [answers,  setAnswers]  = useState<number[]>([])
  const [done,     setDone]     = useState(false)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const db = createClient()
    Promise.all([
      db.from('lessons').select('*').order('order_index'),
      db.from('user_lesson_progress').select('*').eq('user_id', userId),
    ]).then(([{data:l},{data:p}]) => { setLessons(l||[]); setProgress(p||[]); setLoading(false) })
  }, [userId])

  const getProg    = (id:string) => progress.find(p => p.lesson_id===id)
  const completed  = progress.filter(p => p.completed).length
  const pct        = lessons.length ? Math.round(completed/lessons.length*100) : 0

  function openLesson(lesson: Lesson) {
    setActive(lesson); setQuiz(false); setQIdx(0); setAnswers([]); setDone(false)
  }

  async function submitQuiz() {
    if (!active?.quiz_json) return
    const q     = active.quiz_json
    const right = answers.filter((a,i) => a===q[i]?.answer).length
    const score = Math.round(right/q.length*100)
    const pass  = score >= active.pass_score
    const db    = createClient()
    await db.from('user_lesson_progress').upsert(
      { user_id:userId, lesson_id:active.id, completed:pass, score, completed_at:pass?new Date().toISOString():null },
      { onConflict:'user_id,lesson_id' }
    )
    if (pass) {
      toast.success(`✓ Passed with ${score}%!`)
      setProgress(prev => {
        const ex = prev.findIndex(p => p.lesson_id===active.id)
        const u  = { lesson_id:active.id, completed:true, score }
        return ex>=0 ? prev.map((p,i) => i===ex?u:p) : [...prev,u]
      })
    } else {
      toast.error(`Score: ${score}%. Need ${active.pass_score}% to pass.`)
    }
    setDone(true)
  }

  // ── Lesson detail ─────────────────────────────────────────────────────────
  if (active) {
    const q = active.quiz_json || []
    return (
      <div style={{ maxWidth:640, margin:'0 auto', padding:'0 24px 40px' }}>
        <button onClick={() => setActive(null)} style={{ background:'none', border:'none', color:'var(--text2)', cursor:'pointer', fontSize:13, marginBottom:20, padding:0 }}>
          ← Back to Lessons
        </button>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', background:'rgba(212,162,8,0.03)' }}>
            <div style={{ fontSize:10, color:'var(--gold)', letterSpacing:2, marginBottom:6, fontFamily:'var(--font-mono)' }}>
              {MOD_ICON[active.module]||'📚'} {active.module.replace('_',' ').toUpperCase()}
            </div>
            <h2 style={{ fontSize:20, fontWeight:700, color:'var(--text)', fontFamily:'var(--font-serif)', margin:0 }}>{active.title}</h2>
            {getProg(active.id)?.completed && (
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:8, fontSize:11, color:'#1DD1A1', background:'rgba(29,209,161,0.08)', padding:'3px 10px', borderRadius:100, border:'1px solid rgba(29,209,161,0.2)' }}>
                ✓ Completed — {getProg(active.id)?.score}%
              </span>
            )}
          </div>

          {!quiz ? (
            <div style={{ padding:24 }}>
              <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.8, marginBottom:24 }}>{active.content}</p>
              {q.length>0 && (
                <button onClick={() => setQuiz(true)} className="btn-primary">Take Quiz →</button>
              )}
            </div>
          ) : !done ? (
            <div style={{ padding:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text3)', marginBottom:16 }}>
                <span>Q {qIdx+1} of {q.length}</span><span>Pass: {active.pass_score}%</span>
              </div>
              <h3 style={{ fontSize:15, color:'var(--text)', lineHeight:1.6, marginBottom:16 }}>{q[qIdx]?.question}</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                {q[qIdx]?.options.map((opt:string,i:number) => (
                  <button key={i} onClick={() => { const a=[...answers]; a[qIdx]=i; setAnswers(a) }}
                    style={{ padding:'11px 14px', textAlign:'left', fontSize:13, cursor:'pointer', borderRadius:'var(--radius-sm)',
                      background:answers[qIdx]===i?'var(--gold-dim)':'rgba(255,255,255,0.02)',
                      border:`1px solid ${answers[qIdx]===i?'var(--gold-glow)':'var(--border)'}`,
                      color:answers[qIdx]===i?'var(--gold2)':'var(--text2)' }}>
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {qIdx>0 && <button onClick={() => setQIdx(i=>i-1)} className="btn btn-ghost btn-sm">← Back</button>}
                {qIdx<q.length-1
                  ? <button onClick={() => setQIdx(i=>i+1)} disabled={answers[qIdx]===undefined} className="btn btn-secondary btn-sm" style={{ flex:1 }}>Next →</button>
                  : <button onClick={submitQuiz} disabled={answers[qIdx]===undefined} className="btn-primary btn-sm" style={{ flex:1 }}>Submit</button>
                }
              </div>
            </div>
          ) : (
            <div style={{ padding:'40px 24px', textAlign:'center' }}>
              {(() => {
                const right = answers.filter((a,i) => a===q[i]?.answer).length
                const score = Math.round(right/q.length*100)
                const pass  = score >= active.pass_score
                return (
                  <>
                    <div style={{ fontSize:44, marginBottom:10 }}>{pass?'🏆':'📚'}</div>
                    <h3 style={{ fontSize:20, fontWeight:700, color:pass?'#1DD1A1':'var(--red)', fontFamily:'var(--font-serif)', marginBottom:8 }}>
                      {pass?'Lesson Complete!':'Keep Studying'}
                    </h3>
                    <p style={{ color:'var(--text2)', marginBottom:20 }}>Score: <strong style={{ color:pass?'#1DD1A1':'var(--red)' }}>{score}%</strong> ({right}/{q.length} correct)</p>
                    <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                      {!pass && <button onClick={() => { setQIdx(0); setAnswers([]); setDone(false) }} className="btn btn-secondary">Retry Quiz</button>}
                      <button onClick={() => setActive(null)} className="btn btn-ghost">Back to Lessons</button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── List ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'0 24px 40px' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Learning Center</h1>
        <p style={{ fontSize:14, color:'var(--text2)' }}>Master lean manufacturing — earn your VeSiMy certification.</p>
      </div>
      <div className="card" style={{ padding:'14px 18px', marginBottom:18 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
          <span style={{ fontWeight:600, color:'var(--text)' }}>Progress</span>
          <span style={{ color:'var(--gold)', fontWeight:700 }}>{pct}%</span>
        </div>
        <div style={{ height:5, background:'var(--border2)', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--gold),var(--gold2))', transition:'width 0.6s' }} />
        </div>
        <div style={{ fontSize:11, color:'var(--text3)', marginTop:5 }}>{completed} of {lessons.length} completed</div>
      </div>
      {loading ? (
        <div style={{ textAlign:'center', color:'var(--text3)', padding:40 }}>Loading…</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {lessons.map((lesson, i) => {
            const p      = getProg(lesson.id)
            const locked = i > 0 && !getProg(lessons[i-1]?.id)?.completed && i > completed+1
            return (
              <div key={lesson.id} onClick={() => !locked && openLesson(lesson)} className="card"
                style={{ padding:'14px 18px', cursor:locked?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:14, opacity:locked?0.5:1 }}>
                <div style={{ width:38, height:38, borderRadius:9, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
                  background:p?.completed?'rgba(29,209,161,0.1)':'var(--gold-dim)',
                  border:`1px solid ${p?.completed?'rgba(29,209,161,0.25)':'var(--gold-glow)'}` }}>
                  {locked?'🔒':MOD_ICON[lesson.module]||'📚'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, color:'var(--text)', fontSize:14 }}>{lesson.title}</div>
                  <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--font-mono)', letterSpacing:1, marginTop:2 }}>
                    {lesson.module.replace('_',' ').toUpperCase()}
                  </div>
                </div>
                {p?.completed
                  ? <span style={{ color:'#1DD1A1', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>✓ {p.score}%</span>
                  : !locked && <span style={{ color:'var(--text3)', fontSize:14 }}>›</span>}
              </div>
            )
          })}
        </div>
      )}
      {pct===100 && (
        <div className="card" style={{ marginTop:24, padding:24, textAlign:'center', background:'var(--gold-dim)', borderColor:'var(--gold-glow)' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🏅</div>
          <h3 style={{ fontFamily:'var(--font-serif)', fontSize:18, color:'var(--text)', marginBottom:6 }}>All Lessons Complete!</h3>
          <p style={{ fontSize:13, color:'var(--text2)', marginBottom:14 }}>You&apos;ve finished all lessons. VeSiMy Certified.</p>
        </div>
      )}
    </div>
  )
}
