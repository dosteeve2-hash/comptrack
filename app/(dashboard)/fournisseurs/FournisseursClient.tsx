'use client'

import { useState, useMemo, useEffect, useTransition } from 'react'
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  X,
  Check,
  AlertCircle,
  Truck,
  Tag,
} from 'lucide-react'
import { createFournisseurAction, updateFournisseurAction } from './actions'
import type { FournisseurFormData } from './actions'
import { formatDate } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FournisseurRow {
  id: string
  nom: string
  email: string | null
  telephone: string | null
  adresse: string | null
  ville: string | null
  pays: string
  categorie: string | null
  created_at: string
}

interface ToastState {
  message: string
  type: 'success' | 'error'
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_FORM: FournisseurFormData = {
  nom: '',
  email: '',
  telephone: '',
  adresse: '',
  ville: '',
  pays: 'Burkina Faso',
  categorie: '',
}

const CATEGORIES = [
  'Matières premières',
  'Services',
  'Équipements',
  'Logistique',
  'Autre',
]

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  initialFournisseurs: FournisseurRow[]
}

export default function FournisseursClient({ initialFournisseurs }: Props) {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FournisseurFormData>(DEFAULT_FORM)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState<ToastState | null>(null)
  const [isPending, startTransition] = useTransition()

  // Auto-dismiss toast after 3 s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(
    () =>
      initialFournisseurs.filter((f) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          f.nom.toLowerCase().includes(q) ||
          (f.email ?? '').toLowerCase().includes(q) ||
          (f.ville ?? '').toLowerCase().includes(q) ||
          (f.telephone ?? '').toLowerCase().includes(q) ||
          (f.categorie ?? '').toLowerCase().includes(q)
        )
      }),
    [initialFournisseurs, search],
  )

  function openCreate() {
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(f: FournisseurRow) {
    setEditingId(f.id)
    setForm({
      nom:       f.nom,
      email:     f.email     ?? '',
      telephone: f.telephone ?? '',
      adresse:   f.adresse   ?? '',
      ville:     f.ville     ?? '',
      pays:      f.pays,
      categorie: f.categorie ?? '',
    })
    setFormError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setFormError('')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    startTransition(async () => {
      const result = editingId
        ? await updateFournisseurAction(editingId, form)
        : await createFournisseurAction(form)
      if (result.success) {
        closeModal()
        setToast({
          message: editingId ? 'Fournisseur modifié !' : 'Fournisseur ajouté !',
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

  const uniqueVilles     = new Set(initialFournisseurs.map((f) => f.ville).filter(Boolean)).size
  const uniqueCategories = new Set(initialFournisseurs.map((f) => f.categorie).filter(Boolean)).size

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up"
          style={{
            background: toast.type === 'success' ? 'rgba(34,197,94,0.15)'  : 'rgba(239,68,68,0.15)',
            border:     `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color:      toast.type === 'success' ? 'var(--green)'           : 'var(--red)',
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
          <h1 className="text-2xl font-bold">Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {filtered.length} fournisseur{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'var(--green)', color: '#000' }}
        >
          <UserPlus className="w-4 h-4" />
          Nouveau fournisseur
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total fournisseurs', value: initialFournisseurs.length, color: 'var(--green)' },
          { label: 'Villes couvertes',   value: uniqueVilles,               color: 'var(--blue)'  },
          { label: 'Catégories',         value: uniqueCategories,           color: 'var(--amber)' },
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
            placeholder="Rechercher par nom, email, ville, catégorie..."
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
          <Truck className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-base font-medium mb-1">
            {search ? 'Aucun résultat trouvé' : 'Aucun fournisseur'}
          </p>
          <p className="text-sm">
            {search
              ? 'Essayez un autre terme de recherche.'
              : 'Commencez par ajouter votre premier fournisseur.'}
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
                      { label: 'Nom / Fournisseur', Icon: null     },
                      { label: 'Email',              Icon: Mail     },
                      { label: 'Téléphone',          Icon: Phone    },
                      { label: 'Ville',              Icon: MapPin   },
                      { label: 'Catégorie',          Icon: Tag      },
                      { label: 'Date création',      Icon: Calendar },
                      { label: '',                   Icon: null     },
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
                {filtered.map((f, idx) => (
                  <tr
                    key={f.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : undefined,
                      background:   idx % 2 === 1 ? 'rgba(255,255,255,0.015)' : undefined,
                    }}
                  >
                    {/* Nom */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                          style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--green)' }}
                        >
                          {f.nom.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                        </div>
                        <span className="font-medium">{f.nom}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-4 py-3">
                      {f.email ? (
                        <a href={`mailto:${f.email}`} className="hover:underline" style={{ color: 'var(--blue)' }}>
                          {f.email}
                        </a>
                      ) : (
                        <span className="opacity-30" style={{ color: 'var(--text2)' }}>—</span>
                      )}
                    </td>
                    {/* Téléphone */}
                    <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>
                      {f.telephone ?? <span className="opacity-30">—</span>}
                    </td>
                    {/* Ville */}
                    <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>
                      {f.ville ? (
                        <span className="flex items-center gap-1">
                          {f.ville}
                          {f.pays !== 'Burkina Faso' && (
                            <span className="text-xs opacity-50">({f.pays})</span>
                          )}
                        </span>
                      ) : (
                        <span className="opacity-30">—</span>
                      )}
                    </td>
                    {/* Catégorie */}
                    <td className="px-4 py-3">
                      {f.categorie ? (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--blue)' }}
                        >
                          {f.categorie}
                        </span>
                      ) : (
                        <span className="opacity-30" style={{ color: 'var(--text2)' }}>—</span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text3)' }}>
                      {formatDate(f.created_at)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(f)}
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
            className="w-full max-w-md rounded-2xl p-6 animate-slide-up"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">
                {editingId ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
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
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="nom">
                  Nom / Raison sociale *
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Ex: Société Approvis Sahel"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contact@fournisseur.com"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="telephone">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="text"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+226 70 12 34 56"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="adresse">
                  Adresse
                </label>
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  value={form.adresse}
                  onChange={handleChange}
                  placeholder="Avenue Kwamé Nkrumah, S. 4"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              {/* Ville */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="ville">
                  Ville
                </label>
                <input
                  id="ville"
                  name="ville"
                  type="text"
                  value={form.ville}
                  onChange={handleChange}
                  placeholder="Ouagadougou"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              {/* Pays */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="pays">
                  Pays
                </label>
                <input
                  id="pays"
                  name="pays"
                  type="text"
                  value={form.pays}
                  onChange={handleChange}
                  placeholder="Burkina Faso"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="categorie">
                  Catégorie
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="">— Sélectionner —</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  style={{ background: 'var(--green)', color: '#000' }}
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
