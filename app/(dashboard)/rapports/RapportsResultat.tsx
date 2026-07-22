// app/(dashboard)/rapports/RapportsResultat.tsx
import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { formatMontant } from '@/lib/utils'
import {
  lignesResultat,
  totalRevenus6M,
  totalDepenses6M,
  resultatNet,
  tauxMarge,
} from './rapports.data'

export function RapportsResultat() {
  const [tooltipResultat, setTooltipResultat] = useState<string | null>(null)

  const KPI_STATS = [
    { label: 'Produits totaux',  value: totalRevenus6M,  color: 'var(--green)' },
    { label: 'Charges totales',  value: totalDepenses6M, color: 'var(--red)' },
    { label: 'Résultat net',     value: resultatNet,     color: resultatNet >= 0 ? 'var(--amber)' : 'var(--red)' },
    { label: 'Taux de marge',    value: null, pct: tauxMarge, color: 'var(--blue)' },
  ]

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--green)' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--green)' }}>Qu&apos;est-ce que le compte de résultat ?</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
              Le compte de résultat mesure votre performance sur une <strong style={{ color: 'var(--text)' }}>période</strong>.
              Il liste tous vos <strong style={{ color: 'var(--green)' }}>Produits</strong> (revenus) puis toutes vos{' '}
              <strong style={{ color: 'var(--red)' }}>Charges</strong> (dépenses).
              La différence = votre <strong style={{ color: 'var(--amber)' }}>Résultat net</strong> (bénéfice ou perte).
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_STATS.map((s) => (
          <div key={s.label} className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>{s.label}</p>
            <p className="font-bold font-mono text-lg" style={{ color: s.color }}>
              {s.value !== null ? formatMontant(s.value) : `${s.pct}%`}
            </p>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold">Compte de résultat — Jan à Juin 2026</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Cliquez sur une ligne pour l&apos;explication</p>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {lignesResultat.map((ligne, i) => {
            const isSousTotal = ligne.type === 'sous-total'
            const isResultat  = ligne.type === 'resultat'
            const isCharge    = ligne.type === 'charge'
            const montantColor = isResultat
              ? (ligne.montant >= 0 ? 'var(--amber)' : 'var(--red)')
              : isCharge ? 'var(--red)' : 'var(--green)'

            if (isSousTotal) {
              return (
                <div key={i} className="px-6 py-3 flex items-center justify-between font-bold text-sm" style={{ background: 'var(--bg3)' }}>
                  <span style={{ color: 'var(--text2)' }}>{ligne.libelle}</span>
                  <span className="font-mono" style={{ color: montantColor }}>{formatMontant(ligne.montant)}</span>
                </div>
              )
            }

            if (isResultat) {
              return (
                <div key={i}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                  style={{ background: 'rgba(245,158,11,0.06)', borderTop: '2px solid rgba(245,158,11,0.3)', borderBottom: '2px solid rgba(245,158,11,0.3)' }}
                  onClick={() => setTooltipResultat(tooltipResultat === ligne.libelle ? null : ligne.libelle)}>
                  <div>
                    <p className="font-bold text-sm">{ligne.libelle}</p>
                    {tooltipResultat === ligne.libelle && ligne.info && (
                      <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--amber)' }}>💡 {ligne.info}</p>
                    )}
                  </div>
                  <span className="font-bold font-mono ml-4 flex-shrink-0" style={{ color: montantColor }}>
                    {formatMontant(ligne.montant)}
                  </span>
                </div>
              )
            }

            return (
              <div key={i}
                className="px-6 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setTooltipResultat(tooltipResultat === ligne.libelle ? null : ligne.libelle)}>
                <div className="flex-1 pl-4">
                  <p className="text-sm">{ligne.libelle}</p>
                  {tooltipResultat === ligne.libelle && ligne.info && (
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--blue)' }}>💡 {ligne.info}</p>
                  )}
                </div>
                <span className="font-mono text-sm ml-4 flex-shrink-0" style={{ color: montantColor }}>
                  {formatMontant(ligne.montant)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
