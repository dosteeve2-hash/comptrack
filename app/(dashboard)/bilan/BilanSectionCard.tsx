// app/(dashboard)/bilan/BilanSectionCard.tsx
import type { SectionBilan, ValeursBilan } from './bilan.data'
import { sommeSec, montantPoste, fmt } from './bilan.data'

interface SectionProps {
  section: SectionBilan
  exercice: 'N' | 'N1'
  valeurs: ValeursBilan
  onChange: (section: SectionBilan, label: string, exercice: 'N' | 'N1', montant: number) => void
}

export function BilanSectionCard({ section, exercice, valeurs, onChange }: SectionProps) {
  const total = sommeSec(section, valeurs, exercice)

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>

      {/* En-tête section */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: section.couleur }} />
          <span className="text-sm font-semibold">{section.titre}</span>
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color: section.couleur }}>
          {fmt(total)}
        </span>
      </div>

      {/* Postes */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {section.postes.map((poste) => {
          const montant = montantPoste(valeurs, section, poste, exercice)
          const pct = total > 0 ? (montant / total) * 100 : 0

          return (
            <div key={poste.label} className="px-5 py-3">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <label htmlFor={`${section.titre}-${poste.label}-${exercice}`} className="text-sm" style={{ color: 'var(--text2)' }}>
                  {poste.label}
                </label>
                <input
                  id={`${section.titre}-${poste.label}-${exercice}`}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={montant === 0 ? '' : montant}
                  placeholder="0"
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    onChange(section, poste.label, exercice, isNaN(v) || v < 0 ? 0 : v)
                  }}
                  className="w-36 px-3 min-h-9 rounded-lg text-sm text-right tabular-nums outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
                />
              </div>
              {/* Barre de proportion */}
              <div className="h-1 rounded-full" style={{ background: 'var(--bg3)' }}>
                <div
                  className="h-1 rounded-full transition-all duration-700"
                  style={{ width: `${pct.toFixed(1)}%`, background: section.couleur, opacity: 0.6 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
