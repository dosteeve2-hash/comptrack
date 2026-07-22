// app/(dashboard)/rapports/RapportsBilan.tsx
import { useState } from 'react'
import { Scale } from 'lucide-react'
import { formatMontant } from '@/lib/utils'
import { lignesActif, lignesPassif, totalActif, totalPassif } from './rapports.data'

export function RapportsBilan() {
  const [tooltipActif,  setTooltipActif]  = useState<string | null>(null)
  const [tooltipPassif, setTooltipPassif] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-start gap-3">
          <Scale className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--blue)' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--blue)' }}>Qu&apos;est-ce que le bilan ?</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
              Le bilan est une photo de la santé financière de votre entreprise à un instant T.
              Il compare ce que vous <strong style={{ color: 'var(--text)' }}>possédez</strong> (l&apos;Actif) à ce que vous{' '}
              <strong style={{ color: 'var(--text)' }}>devez</strong> (le Passif).
              La règle d&apos;or : <strong style={{ color: 'var(--green)' }}>Actif = Passif</strong> toujours.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Actif */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border)', background: 'rgba(34,197,94,0.05)' }}>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--green)' }}>ACTIF</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Ce que vous possédez</p>
            </div>
            <span className="font-bold font-mono text-lg" style={{ color: 'var(--green)' }}>{formatMontant(totalActif)}</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {lignesActif.map((ligne, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                onClick={() => setTooltipActif(tooltipActif === ligne.libelle ? null : ligne.libelle)}>
                <div className="flex-1">
                  <p className="text-sm font-medium">{ligne.libelle}</p>
                  {tooltipActif === ligne.libelle && ligne.info && (
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--blue)' }}>💡 {ligne.info}</p>
                  )}
                </div>
                <span className="font-mono font-semibold text-sm ml-4 flex-shrink-0" style={{ color: 'var(--green)' }}>
                  {formatMontant(ligne.montant)}
                </span>
              </div>
            ))}
            <div className="px-6 py-4 flex items-center justify-between font-bold" style={{ background: 'rgba(34,197,94,0.08)' }}>
              <span>Total Actif</span>
              <span className="font-mono" style={{ color: 'var(--green)' }}>{formatMontant(totalActif)}</span>
            </div>
          </div>
        </div>

        {/* Passif */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border)', background: 'rgba(59,130,246,0.05)' }}>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--blue)' }}>PASSIF</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Ce que vous devez + vos capitaux</p>
            </div>
            <span className="font-bold font-mono text-lg" style={{ color: 'var(--blue)' }}>{formatMontant(totalPassif)}</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {lignesPassif.map((ligne, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                onClick={() => setTooltipPassif(tooltipPassif === ligne.libelle ? null : ligne.libelle)}>
                <div className="flex-1">
                  <p className="text-sm font-medium">{ligne.libelle}</p>
                  {tooltipPassif === ligne.libelle && ligne.info && (
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--blue)' }}>💡 {ligne.info}</p>
                  )}
                </div>
                <span className="font-mono font-semibold text-sm ml-4 flex-shrink-0"
                  style={{ color: ligne.libelle.includes('Capitaux') ? 'var(--green)' : 'var(--red)' }}>
                  {formatMontant(ligne.montant)}
                </span>
              </div>
            ))}
            <div className="px-6 py-4 flex items-center justify-between font-bold" style={{ background: 'rgba(59,130,246,0.08)' }}>
              <span>Total Passif</span>
              <span className="font-mono" style={{ color: 'var(--blue)' }}>{formatMontant(totalPassif)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Équilibre */}
      <div className="p-5 rounded-2xl text-center" style={{
        background: totalActif === totalPassif ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
        border: `1px solid ${totalActif === totalPassif ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
      }}>
        <p className="text-sm font-semibold">
          Équilibre du bilan :{' '}
          <span style={{ color: totalActif === totalPassif ? 'var(--green)' : 'var(--red)' }}>
            Actif {formatMontant(totalActif)} = Passif {formatMontant(totalPassif)} ✓
          </span>
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
          Cliquez sur chaque ligne pour afficher l&apos;explication
        </p>
      </div>
    </div>
  )
}
