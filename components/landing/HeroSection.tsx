'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, Play } from 'lucide-react'
import gsap from 'gsap'
import { GlowButton } from '../ui/GlowButton'

const WORDS_LINE1 = ['La', 'comptabilité', 'simple']
const WORDS_LINE2 = ['pour', 'les', 'PME']
const WORD_ACCENT = 'africaines'

export function HeroSection() {
  const badgeRef  = useRef<HTMLDivElement>(null)
  const line1Ref  = useRef<HTMLSpanElement[]>([])
  const line2Ref  = useRef<HTMLSpanElement[]>([])
  const accentRef = useRef<HTMLSpanElement>(null)
  const subRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef    = useRef<HTMLDivElement>(null)
  const mockRef   = useRef<HTMLDivElement>(null)
  const badgeFloat = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const allWords = [...line1Ref.current, ...line2Ref.current, accentRef.current].filter(Boolean)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from(badgeRef.current,  { opacity: 0, y: -24, duration: 0.5 })
      .from(allWords,           { opacity: 0, y: 70, stagger: 0.07, duration: 0.75 }, '-=0.15')
      .from(subRef.current,     { opacity: 0, y: 28, duration: 0.55 }, '-=0.45')
      .from(ctaRef.current?.children ?? [], { opacity: 0, y: 20, stagger: 0.1, duration: 0.45 }, '-=0.35')
      .from(mockRef.current,    { opacity: 0, x: 70, duration: 0.8 }, '-=0.5')
      .from(badgeFloat.current, { opacity: 0, scale: 0.8, duration: 0.4 }, '-=0.3')
    return () => { tl.kill() }
  }, [])

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* ── Left: copy ─────────────────────────── */}
        <div>
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-8"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)' }} />
            FORGE Afrika — 100% OHADA conforme
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            <span className="flex flex-wrap gap-x-3">
              {WORDS_LINE1.map((w, i) => (
                <span key={w} ref={el => { if (el) line1Ref.current[i] = el }} className="inline-block">{w}</span>
              ))}
            </span>
            <span className="flex flex-wrap gap-x-3">
              {WORDS_LINE2.map((w, i) => (
                <span key={w} ref={el => { if (el) line2Ref.current[i] = el }} className="inline-block">{w}</span>
              ))}
            </span>
            <span ref={accentRef} className="inline-block" style={{ color: 'var(--gold)' }}>{WORD_ACCENT}</span>
          </h1>

          <p ref={subRef} className="text-xl mb-10 leading-relaxed" style={{ color: 'var(--text2)' }}>
            CompTrack remplace les cahiers et les Excel complexes. Factures, dépenses,
            rapports OHADA — en français, pour les réalités africaines.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <GlowButton href="/inscription" size="lg">
              Essayer gratuitement <ArrowRight className="w-4 h-4" />
            </GlowButton>
            <GlowButton href="#demo" variant="outline" size="lg">
              <Play className="w-4 h-4 fill-current" /> Voir la démo
            </GlowButton>
          </div>
        </div>

        {/* ── Right: dashboard mockup ─────────────── */}
        <div className="relative" ref={mockRef}>
          {/* Business photo */}
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border2)' }}>
            <Image
              src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80"
              alt="Entrepreneur africain utilisant CompTrack"
              width={800} height={480}
              className="w-full object-cover"
              style={{ maxHeight: '320px' }}
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg) 0%, transparent 60%)' }} />
          </div>

          {/* KPI overlay */}
          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Solde', value: '4,25M FCFA', up: true },
              { label: 'Revenus', value: '+21%', up: true },
              { label: 'Bénéfice', value: '702K', up: true },
            ].map((k) => (
              <div key={k.label} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(12px)', border: '1px solid var(--border2)' }}>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text2)' }}>{k.label}</p>
                <p className="text-sm font-bold font-mono" style={{ color: 'var(--gold)' }}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Floating badge */}
          <div ref={badgeFloat} className="floating-badge absolute -left-6 top-8 px-4 py-2.5 rounded-xl text-sm font-semibold hidden lg:block">
            <span style={{ color: 'var(--green)' }}>● </span>
            <span style={{ color: 'var(--text)' }}>500+ PME actives</span>
          </div>
        </div>
      </div>
    </section>
  )
}
