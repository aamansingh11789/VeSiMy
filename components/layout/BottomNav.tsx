// TypeScript enabled
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardIcon, FolderIcon, BookIcon, SettingsIcon } from '@/components/ui/Icons'

const NAV = [
  { href: '/dashboard', icon: DashboardIcon, label: 'Home'     },
  { href: '/projects',  icon: FolderIcon,    label: 'Projects' },
  { href: '/learn',     icon: BookIcon,      label: 'Learn'    },
  { href: '/settings',  icon: SettingsIcon,  label: 'Settings' },
]

export function BottomNav() {
  const path = usePathname()
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = path === href || path.startsWith(href + '/')
        return (
          <Link key={href} href={href} className={`bottom-nav-item${active ? ' active' : ''}`}>
            <Icon size={20} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
