// app/(dashboard)/factures/FactureDetail.tsx
import { X, Download } from 'lucide-react'
import type { Facture } from '@/lib/data'
import { formatMontant, formatDate } from '@/lib/utils'
import { statutConfig } from './factures.types'

export function FactureDetail({
  facture,
  onClose,
  onPrint,
}: {
  facture: Facture | null
  onClose: () => void
  onPrint: (f: Facture) => void
}) {
  if (!facture) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold">{facture.numero}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => onPrint(facture)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:brightness-110"
              style={{ background: 'var(--green)', color: '#000' }}>
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text2)' }}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Facture content */}
        <div className="p-6 print-facture">
          {/* En-tête facture */}
          <div className="flex justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono"
                  style={{ background: 'var(--green)', color: '#000' }}>CT</div>
                <span className="font-bold">CompTrack</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>Mon Commerce</p>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>Ouagadougou, Burkina Faso</p>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>contact@moncommerce.bf</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-lg">{facture.numero}</p>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: statutConfig[facture.statut].bg, color: statutConfig[facture.statut].color }}>
                {statutConfig[facture.statut].label}
              </span>
              <p className="text-xs mt-2" style={{ color: 'var(--text2)' }}>Émise le {formatDate(facture.dateCreation)}</p>
              <p className="text-xs" style={{ color: 'var(--text2)' }}>Échéance {formatDate(facture.dateEcheance)}</p>
            </div>
          </div>

          {/* Client */}
          <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
              Facturé à
            </p>
            <p className="font-semibold">{facture.client}</p>
          </div>

          {/* Articles */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Description', 'Qté', 'Prix unit.', 'Total'].map((h, i) => (
                  <th key={h} className={`py-2 text-xs font-medium uppercase ${i === 0 ? 'text-left' : 'text-right'}`}
                    style={{ color: 'var(--text2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {facture.articles.map((art, i) => (
                <tr key={i}>
                  <td className="py-3">{art.description}</td>
                  <td className="py-3 text-right font-mono">{art.quantite}</td>
                  <td className="py-3 text-right font-mono">{formatMontant(art.prixUnitaire)}</td>
                  <td className="py-3 text-right font-mono font-semibold">{formatMontant(art.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t" style={{ borderColor: 'var(--border2)' }}>
                <td colSpan={3} className="py-3 font-bold text-right">TOTAL</td>
                <td className="py-3 text-right font-bold font-mono text-lg" style={{ color: 'var(--green)' }}>
                  {formatMontant(facture.montant)}
                </td>
              </tr>
            </tfoot>
          </table>

          <p className="text-xs text-center" style={{ color: 'var(--text2)' }}>
            Merci pour votre confiance · Paiement par virement ou mobile money
          </p>
        </div>
      </div>
    </div>
  )
}
