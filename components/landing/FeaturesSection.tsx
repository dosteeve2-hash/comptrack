'use client'
import { BarChart3, FileText, TrendingUp, Zap, Shield, Globe } from 'lucide-react'
import { ScrollReveal } from '../ui/ScrollReveal'

const FEATURES = [
  {
    icon: BarChart3, color: 'var(--gold)', title: 'Tableau de bord temps réel',
    desc: "Vue d'ensemble de votre santé financière avec KPIs, graphiques interactifs et alertes intelligentes.",
  },
  {
    icon: FileText, color: 'var(--cyan)', title: 'Factures automatiques',
    desc: 'Créez des factures PDF professionnelles en 30 secondes. Suivi des paiements et relances automatiques.',
  },
  {
    icon: TrendingUp, color: 'var(--gold)', title: 'Suivi des dépenses',
    desc: "Catégorisez et analysez chaque dépense. Identifiez les fuites financières et optimisez vos coûts.",
  },
  {
    icon: Zap, color: 'var(--cyan)', title: 'Objectifs financiers',
    desc: 'Fixez des objectifs mensuels et annuels. Suivez votre progression en temps réel.',
  },
  {
    icon: Shield, color: 'var(--gold)', title: 'Rapports OHADA',
    desc: "Génération automatique des états financiers conformes aux normes OHADA. Exportables PDF & Excel.",
  },
  {
    icon: Globe, color: 'var(--cyan)', title: 'Multi-devises FCFA/EUR/USD',
    desc: 'Gérez vos finances en FCFA, EUR, USD, XOF et plus. Conversion automatique aux taux du marché.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont votre PME a besoin</h2>
          <p className="text-lg" style={{ color: 'var(--text2)' }}>Conçu pour les réalités des entreprises africaines</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.09} direction="up">
              <div
                className="p-6 rounded-2xl border"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--border)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-6px)'
                  el.style.borderColor = f.color
                  el.style.boxShadow = `0 12px 40px ${f.color}22`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.transform = ''
                  el.style.borderColor = 'var(--border)'
                  el.style.boxShadow = ''
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}18` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
