// app/(dashboard)/transactions/TransactionTable.tsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { Transaction } from '@/lib/data'
import { formatMontant, formatDate } from '@/lib/utils'
import { statutLabels } from './transactions.types'

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--text2)' }}>
        <p className="text-lg font-medium mb-1">Aucune transaction trouvée</p>
        <p className="text-sm">Modifiez vos filtres ou ajoutez une nouvelle transaction.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs font-medium uppercase tracking-wider"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
            {['Type', 'Description', 'Catégorie', 'Date', 'Client/Fourn.', 'Statut', 'Montant'].map((h) => (
              <th key={h} className={`${h === 'Montant' ? 'text-right px-6' : 'text-left px-4'} py-3 ${h === 'Type' ? 'pl-6' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: tx.type === 'revenu' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}
                >
                  {tx.type === 'revenu'
                    ? <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--green)' }} />
                    : <ArrowDownRight className="w-4 h-4" style={{ color: 'var(--red)' }} />}
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="font-medium truncate max-w-xs">{tx.description}</p>
              </td>
              <td className="px-4 py-4">
                <span className="px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                  {tx.categorie}
                </span>
              </td>
              <td className="px-4 py-4 text-xs font-mono" style={{ color: 'var(--text2)' }}>
                {formatDate(tx.date)}
              </td>
              <td className="px-4 py-4 text-xs" style={{ color: 'var(--text2)' }}>
                {tx.client ?? '—'}
              </td>
              <td className="px-4 py-4">
                <span className="text-xs font-medium font-mono" style={{ color: statutLabels[tx.statut].color }}>
                  ● {statutLabels[tx.statut].label}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold font-mono"
                  style={{ color: tx.type === 'revenu' ? 'var(--green)' : 'var(--red)' }}>
                  {tx.type === 'revenu' ? '+' : '-'}{formatMontant(tx.montant)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
