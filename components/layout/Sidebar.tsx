// @ts-nocheck
// ── components/layout/Sidebar.tsx ─────────────────────────────────────────
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VesimyLogo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeProvider'
import { createClient } from '@/lib/supabase'
import {
  DashboardIcon, FolderIcon, ZapIcon, SettingsIcon, LogOutIcon,
  CrownIcon, ChevronRightIcon, BookIcon,
} from '@/components/ui/Icons'
import type { Profile } from '@/lib/store'

interface SidebarProps {
  profile: Profile
  collapsed?: boolean
}

const NAV = [
  { href: '/dashboard',    icon: DashboardIcon, label: 'Dashboard'        },
  { href: '/projects',     icon: FolderIcon,    label: 'Projects'         },
  { href: '/kaizen',       icon: ZapIcon,       label: 'Kaizen Hub'       },
  { href: '/settings',     icon: SettingsIcon,  label: 'Settings'         },
  { href: '/learn',        icon: BookIcon,      label: 'Learning Center'  },
]

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const isPro        = profile.plan_tier !== 'free'
  const isGold       = (profile as any).beta_tier === 'gold_standard'
  const isLifetime   = (profile as any).lifetime_access === true
  const usagePct     = Math.min(100, (profile.projects_count / profile.projects_limit) * 100)

  return (
    <aside style={{
      width: 240, minHeight: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
      background: 'linear-gradient(180deg, rgba(8,8,24,0.97) 0%, rgba(12,8,28,0.95) 50%, rgba(8,8,24,0.97) 100%)',
      borderRight: `1px solid ${isGold ? 'rgba(212,162,8,0.35)' : 'rgba(212,162,8,0.12)'}`,
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo — gold shimmer for Gold Standard users */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${isGold ? 'rgba(212,162,8,0.25)' : 'rgba(26,26,64,0.8)'}`,
        background: isGold ? 'linear-gradient(180deg,rgba(212,162,8,0.04),transparent)' : 'transparent' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <VesimyLogo size={40} showText />
          <ThemeToggle size={28} />
        </div>
        {isGold && (
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
            <svg width="14" height="14" viewBox="0 0 36 36" fill="none">
              <defs><linearGradient id="gg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F5D060"/><stop offset="100%" stopColor="#D4A208"/></linearGradient></defs>
              <path d="M4 26 L8 12 L14 20 L18 8 L22 20 L28 12 L32 26 Z" fill="url(#gg2)" />
              <rect x="4" y="26" width="28" height="4" rx="2" fill="url(#gg2)" />
            </svg>
            <span style={{ fontSize:9, letterSpacing:2, color:'#D4A208', fontWeight:700, fontFamily:'monospace' }}>
              {isLifetime ? 'GOLD · LIFETIME' : 'GOLD STANDARD'}
            </span>
          </div>
        )}
      </div>

      {/* Plan badge */}
      {isGold ? (
        <div style={{ margin: '12px 16px', padding: '10px 14px', borderRadius: 8,
          background: 'linear-gradient(135deg,rgba(212,162,8,0.1),rgba(196,149,16,0.06))',
          border: '1px solid rgba(212,162,8,0.35)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <span style={{ fontSize:10, color:'#D4A208', fontWeight:700, letterSpacing:1.5 }}>
              {isLifetime ? '∞ LIFETIME' : 'BETA TRIAL'}
            </span>
            {!isLifetime && (
              <Link href="/pricing#lifetime" style={{ fontSize:10, color:'#D4A208', textDecoration:'none', fontWeight:600 }}>
                Upgrade →
              </Link>
            )}
          </div>
          <div style={{ fontSize:10, color:'#7070A0' }}>
            {profile.projects_count} / {profile.projects_limit} projects used
          </div>
          <div style={{ height:2, borderRadius:2, background:'rgba(212,162,8,0.15)', marginTop:6 }}>
            <div style={{ height:'100%', borderRadius:2, width:`${usagePct}%`,
              background:'linear-gradient(90deg,#D4A208,#F5D060)' }} />
          </div>
        </div>
      ) : !isPro ? (
        <div style={{ margin: '12px 16px', padding: '10px 14px', borderRadius: 8,
          background: 'rgba(212,162,8,0.06)', border: '1px solid rgba(212,162,8,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#D4A208', fontWeight: 600, letterSpacing: 1 }}>FREE PLAN</span>
            <Link href="/pricing" style={{ fontSize: 11, color: '#6426A0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
              <CrownIcon size={11} /> Upgrade
            </Link>
          </div>
          <div style={{ fontSize: 10, color: '#7070A0', marginBottom: 6 }}>
            {profile.projects_count} / {profile.projects_limit} projects
          </div>
          <div style={{ height: 3, borderRadius: 2, background: '#1A1A40' }}>
            <div style={{ height: '100%', borderRadius: 2, width: `${usagePct}%`,
              background: usagePct > 80 ? '#FF6B6B' : 'linear-gradient(90deg,#D4A208,#F4A623)' }} />
          </div>
        </div>
      ) : (
        <div style={{ margin: '12px 16px', padding: '8px 14px', borderRadius: 8,
          background: 'rgba(100,38,160,0.08)', border: '1px solid rgba(100,38,160,0.20)',
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <CrownIcon size={14} color="#8C44CC" />
          <span style={{ fontSize: 11, color: '#8C44CC', fontWeight: 600, letterSpacing: 1 }}>
            {profile.plan_tier.toUpperCase()}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '8px 20px 4px', fontSize: 9, letterSpacing: 2, color: '#38385C', textTransform: 'uppercase' }}>
          Workspace
        </div>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px',
              fontSize: 13, fontWeight: active ? 600 : 400, textDecoration: 'none',
              color: active ? '#D4A208' : '#7070A0',
              background: active ? 'rgba(212,162,8,0.07)' : 'transparent',
              borderLeft: `3px solid ${active ? '#D4A208' : 'transparent'}`,
              transition: 'all 0.18s',
            }}>
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px 20px', borderTop: '1px solid rgba(26,26,64,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg,#D4A208,#6426A0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {(profile.full_name || profile.email).charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#EAE8F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.full_name || 'User'}
            </div>
            <div style={{ fontSize: 10, color: '#38385C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.email}
            </div>
          </div>
        </div>
        <button onClick={handleSignOut} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 4px',
          background: 'none', border: 'none', cursor: 'pointer', color: '#38385C', fontSize: 12,
          transition: 'color 0.18s',
        }} onMouseOver={e => (e.currentTarget.style.color = '#FF6B6B')}
           onMouseOut={e => (e.currentTarget.style.color = '#38385C')}>
          <LogOutIcon size={13} />
          Sign out
        </button>
        <div style={{ fontSize: 9, color: '#28285C', marginTop: 10, letterSpacing: 2, textAlign: 'center' }}>
          VESIMY v1.0 · CONTINUOUS IMPROVEMENT
        </div>
      </div>
    </aside>
  )
}
