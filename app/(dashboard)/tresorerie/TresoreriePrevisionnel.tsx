'use client'

// app/(dashboard)/tresorerie/TresoreriePrevisionnel.tsx
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { MouvementTresorerie, PrevisionMensuel } from './tresorerie.data'
import { fmt, fmtDate } from './tresorerie.data'

export function MouvementsTable({ mouvements }: { mouvements: MouvementTresorerie[] }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold">Mouvements récents</h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>10 dernières opérations</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
              <th className="text-left px-4 py-3 text-xs font-medium">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium">Libellé</th>
              <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'var(--red)' }}>Débit</th>
              <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: 'var(--green)' }}>Crédit</th>
              <th className="text-right px-4 py-3 text-xs font-medium">Solde après</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {mouvements.map((m, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text2)' }}>
                  {fmtDate(m.date)}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    {m.type === 'credit'
                      ? <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--green)' }} />
                      : <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--red)' }} />}
                    <span className="truncate">{m.libelle}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs"
                  style={{ color: m.debit > 0 ? 'var(--red)' : 'var(--text3)' }}>
                  {m.debit > 0 ? `- ${fmt(m.debit)}` : '—'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs"
                  style={{ color: m.credit > 0 ? 'var(--green)' : 'var(--text3)' }}>
                  {m.credit > 0 ? `+ ${fmt(m.credit)}` : '—'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs font-semibold">{fmt(m.soldeApres)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function PrevisionnelSection({
  entrees,
  sorties,
  soldeTotal,
}: {
  entrees: PrevisionMensuel[]
  sorties: PrevisionMensuel[]
  soldeTotal: number
}) {
  const totalEntrees  = entrees.reduce((a, p) => a + p.montant, 0)
  const totalSorties  = sorties.reduce((a, p) => a + p.montant, 0)
  const soldeProjecte = soldeTotal + totalEntrees - totalSorties

  return (
    <div className="rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold">Prévisionnel — Juillet 2025</h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Estimation sur 30 jours</p>
      </div>
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: 'var(--border)' }}>
        {/* Entrées */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--green)' }} />
            <span className="font-semibold text-sm">Entrées prévues</span>
            <span className="ml-auto font-bold font-mono text-sm" style={{ color: 'var(--green)' }}>{fmt(totalEntrees)}</span>
          </div>
          <div className="space-y-2.5">
            {entrees.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text2)' }}>{p.libelle}</span>
                <span className="font-mono font-medium" style={{ color: 'var(--green)' }}>+{fmt(p.montant)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Sorties */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4" style={{ color: 'var(--red)' }} />
            <span className="font-semibold text-sm">Sorties prévues</span>
            <span className="ml-auto font-bold font-mono text-sm" style={{ color: 'var(--red)' }}>{fmt(totalSorties)}</span>
          </div>
          <div className="space-y-2.5">
            {sorties.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text2)' }}>{p.libelle}</span>
                <span className="font-mono font-medium" style={{ color: 'var(--red)' }}>-{fmt(p.montant)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Solde projeté */}
      <div className="px-6 py-4 border-t flex items-center justify-between"
        style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
        <span className="text-sm font-semibold">Solde projeté fin juillet</span>
        <span className="font-bold font-mono text-lg"
          style={{ color: soldeProjecte >= 0 ? 'var(--green)' : 'var(--red)' }}>
          {fmt(soldeProjecte)}
        </span>
      </div>
    </div>
  )
}
