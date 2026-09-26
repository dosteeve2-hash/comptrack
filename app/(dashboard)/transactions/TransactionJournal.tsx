// app/(dashboard)/transactions/TransactionJournal.tsx
import { BookOpen } from 'lucide-react'
import type { Transaction } from '@/lib/data'
import { formatMontant, formatDate } from '@/lib/utils'
import { compteParCategorie } from './transactions.types'

export function TransactionJournal({ transactions }: { transactions: Transaction[] }) {
  const totalRevenus  = transactions.filter(t => t.type === 'revenu').reduce((s, t) => s + t.montant, 0)
  const totalDepenses = transactions.filter(t => t.type === 'depense').reduce((s, t) => s + t.montant, 0)

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-start gap-3"
        style={{ borderColor: 'var(--border)', background: 'rgba(59,130,246,0.04)' }}>
        <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--blue)' }} />
        <div>
          <p className="text-sm font-semibold">Journal comptable — double entrée (SYSCOHADA)</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
            Chaque opération génère un débit et un crédit d&apos;égale valeur.
            Débit = ressources utilisées. Crédit = origine des ressources.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs font-medium uppercase tracking-wider"
              style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
              {['Date', 'Libellé', 'Compte débité', 'Compte crédité', 'Débit', 'Crédit'].map((h, i) => (
                <th key={h}
                  className={`py-3 ${i === 0 ? 'text-left px-6' : i >= 4 ? 'text-right px-4' : 'text-left px-4'} ${i === 5 ? 'pr-6' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12" style={{ color: 'var(--text2)' }}>
                  Aucune transaction
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const comptes = compteParCategorie[tx.categorie] ?? {
                  debit:  tx.type === 'revenu' ? '5111 - Banque' : '6099 - Charges diverses',
                  credit: tx.type === 'revenu' ? '7099 - Produits divers' : '5111 - Banque',
                }
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 text-xs font-mono" style={{ color: 'var(--text2)' }}>
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-xs truncate max-w-xs">{tx.description}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{tx.categorie}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--green)' }}>{comptes.debit}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--blue)' }}>{comptes.credit}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm" style={{ color: 'var(--green)' }}>
                      {tx.type === 'revenu' ? formatMontant(tx.montant) : '—'}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-sm" style={{ color: 'var(--red)' }}>
                      {tx.type === 'depense' ? formatMontant(tx.montant) : '—'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          {transactions.length > 0 && (
            <tfoot>
              <tr className="border-t font-bold" style={{ borderColor: 'var(--border2)', background: 'var(--bg3)' }}>
                <td colSpan={4} className="px-6 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
                  Totaux
                </td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: 'var(--green)' }}>
                  {formatMontant(totalRevenus)}
                </td>
                <td className="px-6 py-3 text-right font-mono" style={{ color: 'var(--red)' }}>
                  {formatMontant(totalDepenses)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
