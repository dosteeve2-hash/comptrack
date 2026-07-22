// app/(dashboard)/transactions/TransactionModal.tsx
import { useMemo } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { categories } from '@/lib/data'
import type { NewTransactionForm } from './transactions.types'

const INPUT_CLS = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none'
const INPUT_STYLE = { background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }

export function TransactionModal({
  open,
  form,
  formError,
  onChange,
  onSubmit,
  onClose,
}: {
  open: boolean
  form: NewTransactionForm
  formError: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}) {
  const availableCategories = useMemo(
    () => categories.filter((c) => c.type === form.type || c.type === 'les_deux'),
    [form.type]
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 animate-slide-up"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Nouvelle transaction</h2>
          <button onClick={onClose} aria-label="Fermer" className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text2)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <div className="flex gap-2">
              {(['revenu', 'depense'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange({ target: { name: 'type', value: t } } as React.ChangeEvent<HTMLInputElement>)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: form.type === t ? (t === 'revenu' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)') : 'var(--bg3)',
                    border: form.type === t ? `1px solid var(--${t === 'revenu' ? 'green' : 'red'})` : '1px solid var(--border2)',
                    color: form.type === t ? `var(--${t === 'revenu' ? 'green' : 'red'})` : 'var(--text2)',
                  }}
                >
                  {t === 'revenu' ? '↑ Revenu' : '↓ Dépense'}
                </button>
              ))}
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="montant">Montant (FCFA) *</label>
            <input id="montant" name="montant" type="number" min="0" step="100"
              value={form.montant} onChange={onChange} placeholder="Ex: 150000"
              className={INPUT_CLS} style={INPUT_STYLE} required />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="categorie">Catégorie *</label>
            <div className="relative">
              <select id="categorie" name="categorie" value={form.categorie} onChange={onChange}
                className="w-full px-4 py-2.5 pr-8 rounded-xl text-sm outline-none appearance-none"
                style={{ ...INPUT_STYLE, color: form.categorie ? 'var(--text)' : 'var(--text2)' }} required>
                <option value="">Choisir une catégorie</option>
                {availableCategories.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text2)' }} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="description">Description *</label>
            <input id="description" name="description" type="text" value={form.description} onChange={onChange}
              placeholder="Ex: Vente tissus wax — client Aminata"
              className={INPUT_CLS} style={INPUT_STYLE} required />
          </div>

          {/* Date + Client */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="date">Date *</label>
              <input id="date" name="date" type="date" value={form.date} onChange={onChange}
                className={INPUT_CLS} style={INPUT_STYLE} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="client">Client / Fournisseur</label>
              <input id="client" name="client" type="text" value={form.client} onChange={onChange}
                placeholder="Optionnel" className={INPUT_CLS} style={INPUT_STYLE} />
            </div>
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
