'use client'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '../ui/ScrollReveal'
import { GlowButton } from '../ui/GlowButton'

export function CTASection() {
  return (
    <section className="py-20 px-6" style={{ background: 'var(--bg2)' }}>
      <div className="max-w-2xl mx-auto">
        <ScrollReveal direction="up">
          <div
            className="text-center rounded-2xl p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(0,188,212,0.08) 100%)',
              border: '1px solid rgba(212,175,55,0.25)',
              boxShadow: '0 0 60px rgba(212,175,55,0.08)',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Rejoignez 500 PME qui font confiance à CompTrack
            </h2>
            <p className="mb-8 text-lg" style={{ color: 'var(--text2)' }}>
              Démarrez gratuitement. Aucune carte bancaire requise.
            </p>
            <GlowButton href="/inscription" size="lg">
              Commencer gratuitement <ArrowRight className="w-5 h-5" />
            </GlowButton>
            <p className="mt-4 text-xs" style={{ color: 'var(--text3)' }}>
              Gratuit 30 jours · Sans carte bancaire · Annulable à tout moment
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
