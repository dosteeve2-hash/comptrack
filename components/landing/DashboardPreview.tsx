'use client'
import { ScrollReveal } from '../ui/ScrollReveal'
import { AnimatedCounter } from '../ui/AnimatedCounter'

const KPIS = [
  { label: 'Solde total',  value: 4250, suffix: 'K', change: '+12%', up: true },
  { label: 'Revenus juin', value: 1395, suffix: 'K', change: '+21%', up: true },
  { label: 'Dépenses',     value: 693,  suffix: 'K', change: '+14%', up: false },
  { label: 'Bénéfice net', value: 702,  suffix: 'K', change: '+30%', up: true },
]

const BARS = [55, 62, 71, 68, 80, 100]

export function DashboardPreview() {
  return (
    <section id="demo" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Votre tableau de bord en temps réel</h2>
          <p className="text-lg" style={{ color: 'var(--text2)' }}>
            Toutes vos finances, au même endroit
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border2)', background: 'var(--bg2)' }}>
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--amber)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gold)' }} />
              <div className="flex-1 mx-4 h-6 rounded px-3 flex items-center text-xs font-mono"
                style={{ background: 'var(--bg)', color: 'var(--text2)' }}>
                comptrack.app/dashboard
              </div>
            </div>

            {/* KPIs */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {KPIS.map((k, i) => (
                  <ScrollReveal key={k.label} delay={0.1 + i * 0.07} direction="up">
                    <div className="rounded-xl p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                      <p className="text-xs mb-2" style={{ color: 'var(--text2)' }}>{k.label}</p>
                      <p className="text-lg font-bold font-mono">
                        <AnimatedCounter target={k.value} suffix={k.suffix} duration={1.8} />
                      </p>
                      <p className="text-xs font-mono mb-1" style={{ color: 'var(--text2)' }}>FCFA</p>
                      <span className="text-xs font-mono font-semibold"
                        style={{ color: k.up ? 'var(--green)' : 'var(--red)' }}>
                        {k.change}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Bar chart */}
              <ScrollReveal direction="up" delay={0.35}>
                <div className="rounded-xl p-4 flex items-end gap-2"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', height: '120px' }}>
                  {BARS.map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background: i === BARS.length - 1 ? 'var(--gold)' : 'var(--cyan)',
                        opacity: i === BARS.length - 1 ? 1 : 0.6,
                        transition: 'height 0.8s ease',
                      }} />
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
