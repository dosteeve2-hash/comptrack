'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { GlowButton } from '../ui/GlowButton'

const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs',          href: '/tarifs' },
  { label: 'Témoignages',     href: '#temoignages' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,22,40,0.97)' : 'rgba(10,22,40,0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}
          >CT</div>
          <span className="font-bold text-lg tracking-tight">CompTrack</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href}
              className="text-sm hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text2)' }}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/connexion"
            className="hidden sm:block px-4 py-2 text-sm rounded-lg transition-opacity hover:opacity-80"
            style={{ color: 'var(--text2)' }}>
            Connexion
          </Link>
          <GlowButton href="/inscription" size="sm">
            Essayer gratuitement
          </GlowButton>
        </div>
      </div>
    </header>
  )
}
