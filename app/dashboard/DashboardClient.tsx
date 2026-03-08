// @ts-nocheck
// ── app/dashboard/DashboardClient.tsx ────────────────────────────────────────
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PlusIcon, ArrowRightIcon, ClockIcon, ZapIcon, BarChartIcon, CrownIcon, ActivityIcon, ChevronRightIcon } from '@/components/ui/Icons'
import toast                   from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import type { Profile, Project } from '@/lib/store'
import Link                    from 'next/link'
import { BetaBanner }          from '@/components/beta/BetaBanner'

interface Props { profile: Profile; initialProjects: Project[] }

function UpgradeToast() {
  const params = useSearchParams()
  useEffect(() => {
    if (params.get('upgraded') === 'true') {
      const plan = params.get('plan') || 'pro'
      toast.success(`🎉 Welcome to VeSiMy ${plan.charAt(0).toUpperCase()+plan.slice(1)}! Your plan is now active.`, { duration: 6000 })
      // Clean the URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [params])
  return null
}


const INDUSTRIES = ['Manufacturing','Healthcare','Logistics','Retail','Food & Beverage','Construction','Domestic','Other']
const serif      = 'Palatino Linotype,Book Antiqua,Palatino,serif'

// ── Mini SVG health gauge ─────────────────────────────────────────────────────
function MiniGauge({ score }: { score: number }) {
  const color = score >= 70 ? '#1DD1A1' : score >= 40 ? '#F4A623' : '#FF6B6B'
  const r = 16, circ = 2 * Math.PI * r, dash = (score / 100) * circ
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ flexShrink:0 }}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(40,40,92,0.4)" strokeWidth="3.5" />
      <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 22 22)"
        style={{ transition:'stroke-dasharray 1s ease' }} />
      <text x="22" y="26" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">{score}</text>
    </svg>
  )
}

// ── Per-project health card ───────────────────────────────────────────────────
function ProjectHealthCard({ project }: { project: Project }) {
  const count     = project.steps?.length || 0
  const score     = Math.min(100,
    (count>0?25:0) + (count>3?20:0) + (count>6?15:0) +
    (project.industry?20:0) +
    (new Date(project.updated_at) > new Date(Date.now()-7*24*60*60*1000)?20:0)
  )
  const color  = score >= 70 ? '#1DD1A1' : score >= 40 ? '#F4A623' : '#FF6B6B'
  const status = score >= 70 ? 'Active' : count === 0 ? 'Empty' : score >= 40 ? 'Building' : 'Started'

  return (
    <Link href={`/project/${project.id}`} style={{ textDecoration:'none' }}>
      <div className="card" style={{ padding:'18px 20px', cursor:'pointer', transition:'all 0.2s' }}
        onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor='rgba(212,162,8,0.3)'; (e.currentTarget as HTMLDivElement).style.transform='translateY(-2px)' }}
        onMouseOut={e  => { (e.currentTarget as HTMLDivElement).style.borderColor=''; (e.currentTarget as HTMLDivElement).style.transform='' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <MiniGauge score={score} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{project.name}</h3>
              <span style={{ fontSize:10, fontWeight:700, background:`${color}14`, color, border:`1px solid ${color}30`, borderRadius:100, padding:'2px 8px', whiteSpace:'nowrap', flexShrink:0 }}>{status}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:5 }}>
              {project.industry && <span style={{ fontSize:11, color:'#7070A0' }}>{project.industry}</span>}
              <span style={{ fontSize:11, color:'#38385C' }}>{count} step{count!==1?'s':''}</span>
              <span style={{ fontSize:11, color:'#38385C', display:'flex', alignItems:'center', gap:3 }}>
                <ClockIcon size={9} /> {formatDistanceToNow(new Date(project.updated_at), { addSuffix:true })}
              </span>
            </div>
          </div>
          <ChevronRightIcon size={14} color="#28285C" style={{ flexShrink:0 }} />
        </div>
      </div>
    </Link>
  )
}

// ── Portfolio health overview bar ─────────────────────────────────────────────
function HealthOverview({ projects }: { projects: Project[] }) {
  if (!projects.length) return null
  const scores  = projects.map(p => {
    const count = p.steps?.length || 0
    return Math.min(100, (count>0?25:0)+(count>3?20:0)+(count>6?15:0)+(p.industry?20:0)+
      (new Date(p.updated_at)>new Date(Date.now()-7*24*60*60*1000)?20:0))
  })
  const avg   = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)
  const high  = scores.filter(s=>s>=70).length
  const mid   = scores.filter(s=>s>=40&&s<70).length
  const low   = scores.filter(s=>s<40).length
  const color = avg>=70?'#1DD1A1':avg>=40?'#F4A623':'#FF6B6B'

  return (
    <div style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:14, padding:'20px 24px', marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <p style={{ fontSize:10, color:'#7070A0', letterSpacing:1.5, fontFamily:'monospace', marginBottom:4 }}>PORTFOLIO HEALTH</p>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span style={{ fontFamily:serif, fontSize:42, fontWeight:700, color, lineHeight:1 }}>{avg}</span>
            <span style={{ fontSize:13, color:'#7070A0' }}>/ 100 avg</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {([['Healthy','#1DD1A1',high],['Building','#F4A623',mid],['Needs Work','#FF6B6B',low]] as const).map(([label,c,n]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:700, color:c, fontFamily:serif }}>{n}</div>
              <div style={{ fontSize:10, color:'#38385C', fontFamily:'monospace', letterSpacing:1 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ height:6, borderRadius:100, background:'rgba(40,40,92,0.4)', overflow:'hidden', display:'flex' }}>
            {high>0 && <div style={{ flex:high, background:'#1DD1A1' }} />}
            {mid >0 && <div style={{ flex:mid,  background:'#F4A623' }} />}
            {low >0 && <div style={{ flex:low,  background:'#FF6B6B' }} />}
          </div>
          <p style={{ fontSize:11, color:'#38385C', marginTop:5 }}>{high} healthy · {mid} building · {low} needs attention</p>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function DashboardClient({ profile, initialProjects }: Props) {
  const router   = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [creating, setCreating] = useState(false)
  const [showNew,  setShowNew]  = useState(false)
  const [form,     setForm]     = useState({ name:'', industry:'', customer:'' })
  const [view,     setView]     = useState<'cards'|'list'>('cards')

  const isPro   = profile.plan_tier !== 'free'
  const atLimit = !isPro && profile.projects_count >= profile.projects_limit

  async function createProject() {
    if (!form.name.trim()) { toast.error('Project name is required'); return }
    setCreating(true)
    try {
      const res  = await fetch('/api/projects', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) {
        if (data.code==='LIMIT_REACHED') { toast.error('Upgrade to Pro for unlimited projects'); router.push('/pricing') }
        else throw new Error(data.error)
        return
      }
      toast.success('Project created!')
      router.push(`/project/${data.project.id}`)
    } catch (e: any) { toast.error(e.message) }
    finally { setCreating(false) }
  }

  const totalSteps    = projects.reduce((a,p) => a+(p.steps?.length||0), 0)
  const sorted        = [...projects].sort((a,b) => new Date(b.updated_at).getTime()-new Date(a.updated_at).getTime())
  const recentProject = sorted[0]

  return (
    <>
    <Suspense fallback={null}><UpgradeToast /></Suspense>
    <div>
      <BetaBanner
        userId={profile.id}
        isBeta={(profile as any).is_beta}
        isLifetime={(profile as any).lifetime_access}
        betaExpiresAt={(profile as any).beta_expires_at}
        onClaimed={() => window.location.reload()}
      />

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:serif, fontSize:28, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
            Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p style={{ fontSize:14, color:'#7070A0' }}>
            {projects.length===0 ? 'Create your first project to start the cycle.'
              : `${projects.length} active project${projects.length!==1?'s':''} · ${totalSteps} total steps mapped`}
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {projects.length>0 && (
            <div style={{ display:'flex', background:'rgba(8,8,24,0.7)', border:'1px solid rgba(40,40,92,0.5)', borderRadius:8, overflow:'hidden' }}>
              {(['cards','list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding:'7px 14px', fontSize:12, border:'none', cursor:'pointer', transition:'all 0.15s',
                  background:view===v?'rgba(212,162,8,0.12)':'transparent', color:view===v?'#D4A208':'#7070A0' }}>
                  {v==='cards'?'⊞':'☰'} {v.charAt(0).toUpperCase()+v.slice(1)}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => atLimit ? router.push('/pricing') : setShowNew(true)} className="btn-primary" style={{ gap:6 }}>
            <PlusIcon size={15} />
            {atLimit ? 'Upgrade for more' : 'New Project'}
          </button>
        </div>
      </div>

      {/* Upgrade banner */}
      {atLimit && (
        <div style={{ marginBottom:24, padding:'14px 18px', borderRadius:10, background:'rgba(212,162,8,0.06)', border:'1px solid rgba(212,162,8,0.18)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <CrownIcon size={16} color="#D4A208" />
            <span style={{ fontSize:13, color:'#D4A208', fontWeight:600 }}>You've reached your 3-project free limit</span>
            <span style={{ fontSize:13, color:'#7070A0' }}>— upgrade to Pro for unlimited projects</span>
          </div>
          <Link href="/pricing" className="btn-primary" style={{ padding:'6px 16px', fontSize:12, whiteSpace:'nowrap' }}>Upgrade — $29/mo</Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12, marginBottom:24 }}>
        {[
          { label:'Projects',    value:projects.length,    icon:BarChartIcon, color:'#D4A208' },
          { label:'Steps Mapped',value:totalSteps,          icon:ActivityIcon,  color:'#8C44CC' },
          { label:'Plan',        value:isPro?'Pro':'Free',  icon:CrownIcon,     color:'#6CB9FC' },
          { label:'Slots Used',  value:`${profile.projects_count}/${profile.projects_limit}`, icon:ZapIcon, color:'#F4A623' },
        ].map(({ label, value, icon:Icon, color }) => (
          <div key={label} className="card" style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:10, color:'#7070A0', letterSpacing:1.2, textTransform:'uppercase', fontFamily:'monospace' }}>{label}</span>
              <Icon size={13} color={color} />
            </div>
            <div style={{ fontSize:22, fontWeight:700, color:'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Health overview */}
      {projects.length > 0 && <HealthOverview projects={projects} />}

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="card" style={{ padding:48, textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⊚</div>
          <h3 style={{ fontSize:18, fontWeight:600, color:'var(--text)', marginBottom:8 }}>Start your first cycle</h3>
          <p style={{ fontSize:14, color:'#7070A0', marginBottom:24, maxWidth:380, margin:'0 auto 24px' }}>
            Create a project to begin mapping your value stream and identifying improvement opportunities.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => setShowNew(true)} className="btn-primary" style={{ gap:6 }}>
              <PlusIcon size={15} /> Create First Project
            </button>
            <Link href="/learn" style={{ textDecoration:'none' }} className="btn-ghost">📖 Learn Lean Basics</Link>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <h2 style={{ fontSize:12, color:'#7070A0', fontFamily:'monospace', letterSpacing:1.5, textTransform:'uppercase' }}>Your Projects</h2>
            {recentProject && (
              <Link href={`/project/${recentProject.id}`} style={{ fontSize:12, color:'#D4A208', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                Resume last <ArrowRightIcon size={12} />
              </Link>
            )}
          </div>
          {view==='cards' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:12 }}>
              {sorted.map(p => <ProjectHealthCard key={p.id} project={p} />)}
              {!atLimit && (
                <button onClick={() => setShowNew(true)} style={{ border:'2px dashed rgba(40,40,92,0.5)', borderRadius:14, padding:24, cursor:'pointer', background:'transparent', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, transition:'border-color 0.2s', minHeight:90 }}
                  onMouseOver={e => (e.currentTarget.style.borderColor='rgba(212,162,8,0.3)')}
                  onMouseOut={e  => (e.currentTarget.style.borderColor='rgba(40,40,92,0.5)')}>
                  <PlusIcon size={20} color="#38385C" />
                  <span style={{ fontSize:13, color:'#38385C' }}>New Project</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {sorted.map(p => <ProjectHealthCard key={p.id} project={p} />)}
            </div>
          )}
        </>
      )}

      {/* New project modal */}
      {showNew && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:24 }}
          onClick={e => e.target===e.currentTarget && setShowNew(false)}>
          <div className="card" style={{ width:'100%', maxWidth:440, padding:28 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:6, fontFamily:serif }}>New Project</h2>
            <p style={{ fontSize:13, color:'#7070A0', marginBottom:20 }}>Every great improvement starts with a name.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label className="label">Project Name *</label>
                <input className="input" placeholder="e.g. Assembly Line A — Current State"
                  value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                  onKeyDown={e => e.key==='Enter' && createProject()} autoFocus />
              </div>
              <div>
                <label className="label">Industry</label>
                <select className="input" value={form.industry} onChange={e => setForm(f=>({...f,industry:e.target.value}))}>
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Customer / End User</label>
                <input className="input" placeholder="e.g. OEM Assembly Plant"
                  value={form.customer} onChange={e => setForm(f=>({...f,customer:e.target.value}))} />
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:22, justifyContent:'flex-end' }}>
              <button onClick={() => setShowNew(false)} className="btn-ghost">Cancel</button>
              <button onClick={createProject} disabled={creating} className="btn-primary">
                {creating ? 'Creating…' : 'Create Project →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
