'use client'

// app/(dashboard)/dashboard/DashboardOnboarding.tsx
import { Building2, ChevronRight, X } from 'lucide-react'
import type { EntrepriseConfig } from './dashboard.types'
import { SECTEURS, PAYS, DEVISES, TYPES_ENTREPRISE } from './dashboard.types'

const SEL_BASE = 'px-3 py-2.5 rounded-xl text-sm text-left transition-all'
const CHIP_BASE = 'px-3 py-1.5 rounded-lg text-sm transition-all'

function selStyle(active: boolean) {
  return {
    background: active ? 'rgba(34,197,94,0.12)' : 'var(--bg3)',
    border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
    color: active ? 'var(--green)' : 'var(--text2)',
  }
}

export function DashboardOnboarding({
  step,
  config,
  onStep,
  onConfig,
  onClose,
  onComplete,
}: {
  step: number
  config: EntrepriseConfig
  onStep: (s: number) => void
  onConfig: (patch: Partial<EntrepriseConfig>) => void
  onClose: () => void
  onComplete: () => void
}) {
  const steps = [
    {
      titre: 'Votre entreprise',
      desc: 'Comment s\'appelle votre entreprise ?',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de l&apos;entreprise *</label>
            <input
              type="text"
              value={config.nom}
              onChange={(e) => onConfig({ nom: e.target.value })}
              placeholder="Ex: Boutique Aminata SARL"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type d&apos;entreprise</label>
            <div className="flex flex-wrap gap-2">
              {TYPES_ENTREPRISE.map((t) => (
                <button key={t} type="button" onClick={() => onConfig({ type: t })}
                  className={CHIP_BASE}
                  style={{
                    background: config.type === t ? 'rgba(34,197,94,0.15)' : 'var(--bg3)',
                    border: `1px solid ${config.type === t ? 'var(--green)' : 'var(--border2)'}`,
                    color: config.type === t ? 'var(--green)' : 'var(--text2)',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      titre: 'Votre secteur',
      desc: 'Dans quel secteur exercez-vous ?',
      fields: (
        <div className="grid grid-cols-2 gap-2">
          {SECTEURS.map((s) => (
            <button key={s} type="button" onClick={() => onConfig({ secteur: s })}
              className={SEL_BASE} style={selStyle(config.secteur === s)}>
              {s}
            </button>
          ))}
        </div>
      ),
    },
    {
      titre: 'Pays & Devise',
      desc: 'Où opérez-vous principalement ?',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pays</label>
            <div className="grid grid-cols-2 gap-2">
              {PAYS.map((p) => (
                <button key={p} type="button" onClick={() => onConfig({ pays: p })}
                  className={SEL_BASE} style={selStyle(config.pays === p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Devise principale</label>
            <div className="flex flex-wrap gap-2">
              {DEVISES.map((d) => (
                <button key={d} type="button" onClick={() => onConfig({ devise: d })}
                  className="px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all"
                  style={{
                    background: config.devise === d ? 'rgba(34,197,94,0.15)' : 'var(--bg3)',
                    border: `1px solid ${config.devise === d ? 'var(--green)' : 'var(--border2)'}`,
                    color: config.devise === d ? 'var(--green)' : 'var(--text2)',
                  }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ]

  const current = steps[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}>

        {/* Header */}
        <div className="px-6 py-5 border-b"
          style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.06))' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <span className="font-bold">Configurons votre entreprise</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text2)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--text2)' }}>
            Étape {step + 1} sur {steps.length} — {current.desc}
          </p>
          <div className="mt-3 h-1.5 rounded-full" style={{ background: 'var(--bg3)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%`, background: 'var(--green)' }} />
          </div>
        </div>

        {/* Step tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => onStep(i)}
              className="flex-1 px-3 py-2.5 text-xs font-medium transition-colors"
              style={{
                color: step === i ? 'var(--green)' : i < step ? 'var(--text2)' : 'var(--text3)',
                borderBottom: step === i ? '2px solid var(--green)' : '2px solid transparent',
              }}>
              {i < step ? '✓ ' : `${i + 1}. `}{s.titre}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">{current.fields}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => onStep(Math.max(0, step - 1))} disabled={step === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70 disabled:opacity-30"
            style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
            ← Précédent
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => onStep(step + 1)}
              disabled={step === 0 && !config.nom.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
              style={{ background: 'var(--green)', color: '#000' }}>
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onComplete}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: 'var(--green)', color: '#000' }}>
              Commencer →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
