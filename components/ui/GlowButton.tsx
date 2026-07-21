'use client'
import Link from 'next/link'
import { type ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
  variant?: 'gold' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  external?: boolean
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function GlowButton({
  href,
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  external = false,
}: Props) {
  const base = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-transform ${sizes[size]} ${className}`

  if (variant === 'gold') {
    return (
      <Link
        href={href}
        className={`glow-btn-gold ${base}`}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="relative z-10" style={{ color: 'var(--navy)' }}>
          {children}
        </span>
        <span className="shimmer-overlay" aria-hidden="true" />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`${base} hover:opacity-80`}
      style={{ border: '1px solid var(--border2)', color: 'var(--text)' }}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </Link>
  )
}
