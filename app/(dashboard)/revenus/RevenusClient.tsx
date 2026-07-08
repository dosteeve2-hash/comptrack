'use client'

import { useState, useMemo, useEffect, useTransition } from 'react'
import {
  Search,
  Plus,
  Calendar,
  Pencil,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  Tag,
  FileText,
  Download,
} from 'lucide-react'
import { exportToCSV } from '@/utils/exportCsv'
import { createRevenuAction, updateRevenuAction } from './actions'
import type { RevenuFormData } from './actions'
import { formatDate } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RevenuRow {
  id: string
  libelle: string
  montant: number
  categorie: string
  date_revenu: string
  notes: string | null
  created_at: string
}

interface ToastState {
  message: string
  type: 'success' | 'error'
}

// ─── Constants ───────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const DEFAULT_FORM: RevenuFormData = {
  libelle:     '',
  montant:     '',
  categorie:   '',
  date_revenu: today,
  notes:       '',
}

const CATEGORIES = [
  'Ventes',
  'Prestations',
  'Consulting',
  'Abonnements',
  'Remboursements',
  'Autres',
]

function formatFCFA(montant: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(montant) + ' FCFA'
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  initialRevenus: RevenuRow[]
}

export default function RevenusClient({ initialRevenus }: Props) {
  const [search, setSearch]           = useState('')
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [form, setForm]               = useState<RevenuFormData>(DEFAULT_FORM)
  const [formError, setFormError]     = useState('')
  const [toast, setToast]             = useState<ToastState | null>(null)
  const [isPending, startTransition]  = useTransition()

  // Auto-dismiss toast après 3 s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(
    () =>
      initialRevenus.filter((r) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          r.libelle.toLowerCase().includes(q) ||
          r.categorie.toLowerCase().includes(q) ||
          (r.notes ?? '').toLowerCase().includes(q)
        )
      }),
    [initialRevenus, search],
  )

  const total = useMemo(
    () => initialRevenus.reduce((sum, r) => sum + Number(r.montant), 0),
    [initialRevenus],
  )

  const uniqueCategories = new Set(initialRevenus.map((r) => r.categorie)).size

  function openCreate() {
    setEditingId(null)
    setForm({ ...DEFAULT_FORM, date_revenu: today })
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(r: RevenuRow) {
    setEditingId(r.id)
    setForm({
      libelle:     r.libelle,
      montant:     String(r.montant),
      categorie:   r.categorie,
      date_revenu: r.date_revenu,
      notes:       r.notes ?? '',
    })
    setFormError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setFormError('')
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    startTransition(async () => {
      const result = editingId
        ? await updateRevenuAction(editingId, form)
        : await createRevenuAction(form)
      if (result.success) {
        closeModal()
        setToast({
          message: editingId ? 'Revenu modifié !' : 'Revenu ajouté !',
          type: 'success',
        })
      } else {
        setFormError(result.error ?? 'Une erreur est survenue.')
      }
    })
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg3)',
    border:     '1px solid var(--border2)',
    color:      'var(--text)',
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up"
          style={{
            background: toast.type === 'success' ? 'rgba(34,197,94,0.15)'  : 'rgba(239,68,68,0.15)',
            border:     `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color:      toast.type === 'success' ? '#22c55e'                : 'var(--red)',
          }}
        >
          {toast.type === 'success'
            ? <Check       className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />
          }
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenus</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {filtered.length} revenu{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filtered.map(i => ({ ...i })), 'revenus')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: '#22c55e', color: '#000' }}
          >
            <Plus className="w-4 h-4" />
            Nouveau revenu
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Total revenus',
            value: formatFCFA(total),
            color: '#22c55e',
          },
          {
            label: 'Nb de revenus',
            value: initialRevenus.length,
            color: 'var(--text)',
          },
          {
            label: 'Catégories',
            value: uniqueCategories,
            color: 'var(--amber)',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-xl border"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--text2)' }}>{s.label}</p>
            <p className="font-bold font-mono text-xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div
        className="p-4 rounded-2xl border"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text2)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par libellé, catégorie, notes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
        >
          <TrendingUp className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-base font-medium mb-1">
            {search ? 'Aucun résultat trouvé' : 'Aucun revenu'}
          </p>
          <p className="text-sm">
            {search
              ? 'Essayez un autre terme de recherche.'
              : 'Commencez par enregistrer votre premier revenu.'}
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {(
                    [
                      { label: 'Libellé',        Icon: null     },
                      { label: 'Montant (FCFA)',  Icon: null     },
                      { label: 'Catégorie',       Icon: Tag      },
                      { label: 'Date',            Icon: Calendar },
                      { label: 'Notes',           Icon: FileText },
                      { label: '',                Icon: null     },
                    ] as const
                  ).map((col, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text2)', background: 'var(--bg3)' }}
                    >
                      <span className="flex items-center gap-1.5">
                        {col.Icon && <col.Icon className="w-3 h-3" />}
                        {col.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : undefined,
                      background:   idx % 2 === 1 ? 'rgba(255,255,255,0.015)' : undefined,
                    }}
                  >
                    {/* Libellé */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
                        >
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{r.libelle}</span>
                      </div>
                    </td>
                    {/* Montant */}
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: '#22c55e' }}>
                      {formatFCFA(Number(r.montant))}
                    </td>
                    {/* Catégorie */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--amber)' }}
                      >
                        {r.categorie}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                      {formatDate(r.date_revenu)}
                    </td>
                    {/* Notes */}
                    <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>
                      {r.notes ? (
                        <span className="text-xs line-clamp-1 max-w-[180px]">{r.notes}</span>
                      ) : (
                        <span className="opacity-30">—</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg transition-all hover:opacity-70"
                        style={{ color: 'var(--text2)' }}
                        title="Modifier"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">
                {editingId ? 'Modifier le revenu' : 'Nouveau revenu'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg transition-all hover:opacity-70"
                style={{ color: 'var(--text2)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Libellé */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="libelle">
                  Libellé *
                </label>
                <input
                  id="libelle"
                  name="libelle"
                  type="text"
                  value={form.libelle}
                  onChange={handleChange}
                  placeholder="Ex: Vente produit janvier"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              {/* Montant */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="montant">
                  Montant (FCFA) *
                </label>
                <input
                  id="montant"
                  name="montant"
                  type="number"
                  min="0"
                  step="1"
                  value={form.montant}
                  onChange={handleChange}
                  placeholder="Ex: 500000"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="categorie">
                  Catégorie *
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="">— Sélectionner —</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="date_revenu">
                  Date *
                </label>
                <input
                  id="date_revenu"
                  name="date_revenu"
                  type="date"
                  value={form.date_revenu}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="notes">
                  Notes (optionnel)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Informations complémentaires..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </div>

              {formError && (
                <p
                  className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                  style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-60"
                  style={{ background: '#22c55e', color: '#000' }}
                >
                  {isPending
                    ? (editingId ? 'Modification...' : 'Ajout...')
                    : (editingId ? 'Modifier'         : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
