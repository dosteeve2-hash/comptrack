// app/(dashboard)/bilan/BilanSectionCard.tsx
import type { SectionBilan } from './bilan.data'
import { sommeSec, fmt } from './bilan.data'

interface SectionProps {
  section: SectionBilan
  exercice: 'N' | 'N1'
}

export function BilanSectionCard({ section, exercice }: SectionProps) {
  const total = sommeSec(section, exercice)

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
          const montant = exercice === 'N' ? poste.montantN : poste.montantN1
          const pct = total > 0 ? (montant / total) * 100 : 0

          return (
            <div key={poste.label} className="px-5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" style={{ color: 'var(--text2)' }}>{poste.label}</span>
                <span className="text-sm font-medium tabular-nums">{fmt(montant)}</span>
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
