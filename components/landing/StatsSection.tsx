'use client'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { ScrollReveal } from '../ui/ScrollReveal'

const STATS = [
  { target: 500,  suffix: '+', label: 'PME actives',        unit: '' },
  { target: 40,   suffix: '%', label: 'de temps économisé', unit: '+' },
  { target: 98,   suffix: '%', label: 'de satisfaction',    unit: '' },
  { target: 1000, suffix: '+', label: 'factures/mois',      unit: '' },
]

export function StatsSection() {
  return (
    <section className="py-16 px-6 border-t border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.1} direction="up">
            <div>
              <p className="text-4xl md:text-5xl font-bold font-mono mb-2" style={{ color: 'var(--gold)' }}>
                {s.unit}
                <AnimatedCounter
                  target={s.target}
                  suffix={s.suffix}
                  duration={2}
                />
              </p>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>{s.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
