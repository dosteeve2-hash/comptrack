'use client'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { ScrollReveal } from '../ui/ScrollReveal'
import { GlowButton } from '../ui/GlowButton'

const PLANS = [
  {
    name: 'Solo', price: '0', desc: 'Pour démarrer', highlighted: false,
    features: ['1 utilisateur', '50 transactions/mois', 'Tableau de bord basique', 'Export PDF limité'],
    cta: 'Commencer gratuitement', href: '/inscription',
  },
  {
    name: 'PME', price: '15 000', desc: 'Le plus populaire', highlighted: true,
    features: ['5 utilisateurs', 'Transactions illimitées', 'Factures + Rapports OHADA', 'Export Excel/PDF', 'Support email 48h'],
    cta: 'Essayer 30 jours gratuit', href: '/inscription',
  },
  {
    name: 'Entreprise', price: '45 000', desc: 'Multi-entités', highlighted: false,
    features: ['Utilisateurs illimités', 'Multi-entreprises', 'API accès', 'Support prioritaire 4h', 'Formation en ligne'],
    cta: 'Contacter l\'équipe', href: 'mailto:contact@forgeafrika.com',
  },
]

export function PricingSection() {
  return (
    <section id="tarifs" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Des tarifs adaptés à votre croissance</h2>
          <p className="text-lg" style={{ color: 'var(--text2)' }}>Commencez gratuitement, évoluez sans contrainte</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1} direction="up">
              <div className="relative p-6 rounded-2xl h-full flex flex-col"
                style={{
                  background: plan.highlighted ? 'rgba(212,175,55,0.06)' : 'var(--bg2)',
                  border: plan.highlighted ? '2px solid var(--gold)' : '1px solid var(--border)',
                  boxShadow: plan.highlighted ? '0 0 40px rgba(212,175,55,0.12)' : 'none',
                }}>
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'var(--gold)', color: 'var(--navy)' }}>⭐ Populaire</span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text2)' }}>{plan.desc}</p>
                <p className="text-3xl font-bold font-mono mb-1"
                  style={{ color: plan.highlighted ? 'var(--gold)' : 'var(--text)' }}>{plan.price}</p>
                <p className="text-xs mb-6" style={{ color: 'var(--text2)' }}>FCFA / mois</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0"
                        style={{ color: plan.highlighted ? 'var(--gold)' : 'var(--cyan)' }} />
                      <span style={{ color: 'var(--text2)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.highlighted
                  ? <GlowButton href={plan.href} className="w-full">{plan.cta}</GlowButton>
                  : <Link href={plan.href}
                      className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                      style={{ background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border2)' }}>
                      {plan.cta}
                    </Link>
                }
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/tarifs" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--cyan)' }}>
            Voir les tarifs détaillés avec FAQ →
          </Link>
        </div>
      </div>
    </section>
  )
}
