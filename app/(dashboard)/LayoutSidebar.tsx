// app/(dashboard)/LayoutSidebar.tsx
import Link from 'next/link'
import { TrendingUp, LogOut } from 'lucide-react'
import type { UserPrefs } from '@/lib/prefs'
import { navItems } from './layout.config'

interface SidebarProps {
  pathname: string
  prefs: UserPrefs
  onClose: () => void
  onSignOut: () => void
}

export function LayoutSidebar({ pathname, prefs, onClose, onSignOut }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono flex-shrink-0"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            CT
          </div>
          <div>
            <p className="font-bold text-sm leading-none">CompTrack</p>
            <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text3)' }}>v2.0 · OHADA</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                color:      isActive ? 'var(--gold)' : 'var(--text2)',
                border:     isActive ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
              }}>
              <item.icon className="flex-shrink-0" style={{ width: 17, height: 17 }} />
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="px-3 py-3">
        <div className="p-3 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(0,188,212,0.08))',
            border:     '1px solid rgba(212,175,55,0.2)',
          }}>
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--gold)' }} />
            <span className="text-xs font-semibold">Plan Gratuit</span>
          </div>
          <p className="text-xs mb-2" style={{ color: 'var(--text2)' }}>
            Passez à PME pour rapports OHADA et transactions illimitées.
          </p>
          <Link href="/tarifs"
            className="block w-full py-1.5 rounded-lg text-xs font-semibold text-center transition-all hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            Voir les plans
          </Link>
        </div>
      </div>

      {/* User + déconnexion */}
      <div className="px-4 py-4 border-t flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
          style={{ background: 'var(--cyan)', color: 'var(--navy)' }}>
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{prefs.companyName}</p>
          <p className="text-xs truncate" style={{ color: 'var(--text3)' }}>{prefs.country} · {prefs.currency}</p>
        </div>
        <button onClick={onSignOut}
          className="p-1.5 rounded-lg transition-all hover:opacity-70"
          style={{ color: 'var(--text2)' }}
          title="Déconnexion"
          aria-label="Déconnexion">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
