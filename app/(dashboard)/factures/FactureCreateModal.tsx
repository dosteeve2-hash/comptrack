// app/(dashboard)/factures/FactureCreateModal.tsx
import { X, ChevronDown } from 'lucide-react'
import { clients } from '@/lib/data'
import type { FactureArticle } from '@/lib/data'
import { formatMontant } from '@/lib/utils'
import type { NewFactureForm } from './factures.types'
import { defaultArticle } from './factures.types'

const INPUT_STYLE = {
  background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)',
}
const INP = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none'

export function FactureCreateModal({
  open,
  form,
  formError,
  onClose,
  onSubmit,
  onFormChange,
  onArticleChange,
  onAddArticle,
  onRemoveArticle,
}: {
  open: boolean
  form: NewFactureForm
  formError: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onFormChange: (field: keyof Pick<NewFactureForm, 'client' | 'dateEcheance'>, value: string) => void
  onArticleChange: (idx: number, field: keyof FactureArticle, value: string | number) => void
  onAddArticle: () => void
  onRemoveArticle: (idx: number) => void
}) {
  if (!open) return null

  const totalFacture = form.articles.reduce((s, a) => s + a.total, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6 animate-slide-up overflow-y-auto"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', maxHeight: '90vh' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Nouvelle facture</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text2)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Client */}
            <div>
              <label className="block text-sm font-medium mb-2">Client *</label>
              <div className="relative">
                <select value={form.client} onChange={(e) => onFormChange('client', e.target.value)}
                  className={`${INP} pr-8 appearance-none`}
                  style={{ ...INPUT_STYLE, color: form.client ? 'var(--text)' : 'var(--text2)' }} required>
                  <option value="">Choisir un client</option>
                  {clients.filter((c) => c.type === 'client').map((c) => (
                    <option key={c.id} value={c.nom}>{c.nom}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'var(--text2)' }} />
              </div>
            </div>
            {/* Échéance */}
            <div>
              <label className="block text-sm font-medium mb-2">Échéance *</label>
              <input type="date" value={form.dateEcheance}
                onChange={(e) => onFormChange('dateEcheance', e.target.value)}
                className={INP} style={INPUT_STYLE} required />
            </div>
          </div>

          {/* Articles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Articles *</label>
              <button type="button" onClick={onAddArticle}
                className="text-xs hover:opacity-70" style={{ color: 'var(--green)' }}>
                + Ajouter un article
              </button>
            </div>
            <div className="space-y-3">
              {form.articles.map((art, i) => (
                <div key={i} className="p-3 rounded-xl space-y-2"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  <input type="text" value={art.description}
                    onChange={(e) => onArticleChange(i, 'description', e.target.value)}
                    placeholder="Description de l'article"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Quantité', key: 'quantite' as const, type: 'number', val: art.quantite, min: 1 },
                      { label: 'Prix unit. (FCFA)', key: 'prixUnitaire' as const, type: 'number', val: art.prixUnitaire, min: 0 },
                    ].map(({ label, key, type, val, min }) => (
                      <div key={key}>
                        <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>{label}</p>
                        <input type={type} min={min} value={val}
                          onChange={(e) => onArticleChange(i, key,
                            key === 'quantite' ? parseInt(e.target.value) || 1 : parseFloat(e.target.value) || 0
                          )}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
                      </div>
                    ))}
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>Total</p>
                      <p className="px-3 py-2 rounded-lg text-sm font-mono font-semibold"
                        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--green)' }}>
                        {formatMontant(art.total)}
                      </p>
                    </div>
                  </div>
                  {form.articles.length > 1 && (
                    <button type="button" onClick={() => onRemoveArticle(i)}
                      className="text-xs hover:opacity-70" style={{ color: 'var(--red)' }}>
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-3 rounded-xl"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
            <span className="font-semibold">Total facture</span>
            <span className="font-bold font-mono text-lg" style={{ color: 'var(--green)' }}>
              {formatMontant(totalFacture)}
            </span>
          </div>

          {formError && (
            <p className="text-xs px-4 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-70"
              style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
              Annuler
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
              style={{ background: 'var(--green)', color: '#000' }}>
              Créer la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
