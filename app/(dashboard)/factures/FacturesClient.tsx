'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Trash2, FileText, AlertTriangle } from 'lucide-react'
import { formatMontant, formatDate } from '@/lib/utils'
import type { Facture } from './page'

// ─── Statut config ─────────────────────────────────────────────────────────────

type StatutKey = Facture['statut']

const statutConfig: Record<
  StatutKey,
  { label: string; bg: string; color: string }
> = {
  brouillon: { label: 'Brouillon', bg: 'rgba(139,148,158,0.12)', color: 'var(--text2)' },
  envoyee:   { label: 'Envoyée',   bg: 'rgba(59,130,246,0.14)',  color: 'var(--blue)' },
  payee:     { label: 'Payée',     bg: 'rgba(34,197,94,0.14)',   color: 'var(--green)' },
  en_retard: { label: 'En retard', bg: 'rgba(239,68,68,0.14)',   color: 'var(--red)' },
  annulee:   { label: 'Annulée',   bg: 'rgba(100,116,139,0.12)', color: 'var(--text3)' },
}

const STATUTS: StatutKey[] = ['brouillon', 'envoyee', 'payee', 'en_retard', 'annulee']

// ─── Animation variants ─────────────────────────────────────────────────────────

const statsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const statItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 26 },
  },
}

// ─── Form state type ───────────────────────────────────────────────────────────

interface FormState {
  numero: string
  client_nom: string
  client_email: string
  montant_ht: string
  tva_percent: string
  statut: StatutKey
  date_emission: string
  date_echeance: string
  notes: string
}

function defaultForm(nextNum: number): FormState {
  return {
    numero: `FAC-2026-${String(nextNum).padStart(3, '0')}`,
    client_nom: '',
    client_email: '',
    montant_ht: '',
    tva_percent: '18',
    statut: 'brouillon',
    date_emission: new Date().toISOString().split('T')[0],
    date_echeance: '',
    notes: '',
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calcTTC(montant_ht: number, tva: number): number {
  return montant_ht * (1 + tva / 100)
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  factures: Facture[]
}

export default function FacturesClient({ factures: initial }: Props) {
  const [factures, setFactures] = useState<Facture[]>(initial)
  const [filterStatut, setFilterStatut] = useState<'all' | StatutKey>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(() => defaultForm(initial.length + 1))
  const [formError, setFormError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // ── Derived ──────────────────────────────────────────────────────────────────

  const filtered =
    filterStatut === 'all'
      ? factures
      : factures.filter((f) => f.statut === filterStatut)

  const totalTTC = factures.reduce((s, f) => s + calcTTC(f.montant_ht, f.tva_percent), 0)
  const payees   = factures.filter((f) => f.statut === 'payee').length
  const enRetard = factures.filter((f) => f.statut === 'en_retard').length

  const stats = [
    { label: 'Total factures',    value: factures.length, display: String(factures.length), accent: 'var(--blue)' },
    { label: 'Montant total TTC', value: totalTTC,        display: formatMontant(Math.round(totalTTC)), accent: 'var(--green)' },
    { label: 'Payées',            value: payees,          display: String(payees), accent: 'var(--green)' },
    { label: 'En retard',         value: enRetard,        display: String(enRetard), accent: enRetard > 0 ? 'var(--red)' : 'var(--text2)' },
  ]

  // Preview TTC pendant la saisie
  const previewMontantHT = parseFloat(form.montant_ht) || 0
  const previewTVA       = parseFloat(form.tva_percent) || 18
  const previewTTC       = calcTTC(previewMontantHT, previewTVA)

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const openForm = () => {
    setForm(defaultForm(factures.length + 1))
    setFormError('')
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setFormError('')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!form.client_nom.trim()) {
      setFormError('Le nom du client est obligatoire.')
      return
    }
    if (!form.montant_ht || parseFloat(form.montant_ht) <= 0) {
      setFormError('Le montant HT doit être un nombre positif.')
      return
    }
    if (!form.date_emission) {
      setFormError("La date d'émission est obligatoire.")
      return
    }

    const newFacture: Facture = {
      id: `local-${Date.now()}`,
      numero: form.numero || `FAC-2026-${String(factures.length + 1).padStart(3, '0')}`,
      client_nom: form.client_nom.trim(),
      client_email: form.client_email.trim() || null,
      montant_ht: parseFloat(form.montant_ht),
      tva_percent: parseFloat(form.tva_percent) || 18,
      statut: form.statut,
      date_emission: form.date_emission,
      date_echeance: form.date_echeance || null,
      notes: form.notes.trim() || null,
    }

    setFactures((prev) => [newFacture, ...prev])
    closeForm()
  }

  const handleDelete = (id: string) => {
    setFactures((prev) => prev.filter((f) => f.id !== id))
    setDeleteConfirm(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Factures</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {filtered.length} facture{filtered.length !== 1 ? 's' : ''} affichée
            {filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'var(--green)', color: '#000' }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </button>
      </div>

      {/* ── Stats (stagger Framer Motion) ──────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={statsContainer}
        initial="hidden"
        animate="show"
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={statItem}
            className="p-5 rounded-2xl border"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text2)' }}>
              {s.label}
            </p>
            <p
              className="text-xl font-bold font-mono"
              style={{ color: s.accent }}
            >
              {s.display}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Filtres statut ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
      >
        {(['all', ...STATUTS] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatut(s)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filterStatut === s ? 'var(--bg3)' : 'transparent',
              color: filterStatut === s ? 'var(--text)' : 'var(--text2)',
              border: filterStatut === s ? '1px solid var(--border2)' : '1px solid transparent',
            }}
          >
            {s === 'all' ? 'Toutes' : statutConfig[s].label}
          </button>
        ))}
      </div>

      {/* ── Formulaire nouvelle facture ────────────────────────────────────── */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            key="form-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.72)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl p-6 overflow-y-auto"
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border2)',
                maxHeight: '92vh',
              }}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Nouvelle facture</h2>
                <button
                  onClick={closeForm}
                  className="p-1.5 rounded-lg hover:opacity-70"
                  style={{ color: 'var(--text2)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Numéro */}
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro de facture</label>
                  <input
                    name="numero"
                    value={form.numero}
                    onChange={handleChange}
                    placeholder="FAC-2026-006"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
                    style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text)',
                    }}
                  />
                </div>

                {/* Client */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Client *</label>
                    <input
                      name="client_nom"
                      value={form.client_nom}
                      onChange={handleChange}
                      placeholder="Nom du client"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email client</label>
                    <input
                      name="client_email"
                      type="email"
                      value={form.client_email}
                      onChange={handleChange}
                      placeholder="email@client.com"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                    />
                  </div>
                </div>

                {/* Montant HT + TVA + TTC preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Montant HT (FCFA) *</label>
                    <input
                      name="montant_ht"
                      type="number"
                      min="0"
                      step="100"
                      value={form.montant_ht}
                      onChange={handleChange}
                      placeholder="500000"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">TVA (%)</label>
                    <input
                      name="tva_percent"
                      type="number"
                      min="0"
                      max="100"
                      value={form.tva_percent}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                    />
                  </div>
                </div>

                {/* TTC auto */}
                {previewMontantHT > 0 && (
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--text2)' }}>
                      Montant TTC calculé
                    </span>
                    <span className="font-bold font-mono text-lg" style={{ color: 'var(--green)' }}>
                      {formatMontant(Math.round(previewTTC))}
                    </span>
                  </div>
                )}

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium mb-2">Statut</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, statut: s }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: form.statut === s ? statutConfig[s].bg : 'var(--bg3)',
                          color: form.statut === s ? statutConfig[s].color : 'var(--text2)',
                          border: `1px solid ${form.statut === s ? statutConfig[s].color : 'var(--border2)'}`,
                        }}
                      >
                        {statutConfig[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date d&apos;émission *</label>
                    <input
                      name="date_emission"
                      type="date"
                      value={form.date_emission}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date d&apos;échéance</label>
                    <input
                      name="date_echeance"
                      type="date"
                      value={form.date_echeance}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Informations complémentaires..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text)',
                    }}
                  />
                </div>

                {formError && (
                  <p
                    className="text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
                    style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
                    style={{ background: 'var(--green)', color: '#000' }}
                  >
                    Créer la facture
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal confirmation suppression ─────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            key="delete-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.72)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.12)' }}
                >
                  <Trash2 className="w-5 h-5" style={{ color: 'var(--red)' }} />
                </div>
                <div>
                  <p className="font-semibold">Supprimer la facture</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                    Cette action est irréversible.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-70"
                  style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
                  style={{ background: 'var(--red)', color: '#fff' }}
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Liste factures ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
        >
          <FileText className="w-10 h-10 mb-3 opacity-30" />
          <p className="font-medium text-sm" style={{ color: 'var(--text2)' }}>
            Aucune facture {filterStatut !== 'all' ? `avec le statut "${statutConfig[filterStatut].label}"` : ''}
          </p>
          <button
            onClick={openForm}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--green)', color: '#000' }}
          >
            + Nouvelle facture
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((f) => {
              const s = statutConfig[f.statut]
              const ttc = calcTTC(f.montant_ht, f.tva_percent)
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-colors hover:border-[var(--border2)]"
                  style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
                >
                  {/* Numéro + badge */}
                  <div className="flex-shrink-0 flex items-center gap-3 sm:w-48">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(245,158,11,0.1)' }}
                    >
                      <FileText className="w-4 h-4" style={{ color: '#F59E0B' }} />
                    </div>
                    <div>
                      <p
                        className="font-mono text-sm font-bold"
                        style={{ color: '#F59E0B' }}
                      >
                        {f.numero}
                      </p>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{f.client_nom}</p>
                    {f.client_email && (
                      <p className="text-xs truncate" style={{ color: 'var(--text2)' }}>
                        {f.client_email}
                      </p>
                    )}
                    {f.notes && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text3)' }}>
                        {f.notes}
                      </p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="text-xs flex-shrink-0 space-y-0.5" style={{ color: 'var(--text2)' }}>
                    <p>Émise {formatDate(f.date_emission)}</p>
                    {f.date_echeance && (
                      <p
                        style={{
                          color: f.statut === 'en_retard' ? 'var(--red)' : 'var(--text2)',
                        }}
                      >
                        Éch. {formatDate(f.date_echeance)}
                      </p>
                    )}
                  </div>

                  {/* Montant TTC */}
                  <div className="flex-shrink-0 text-right">
                    <p
                      className="font-bold font-mono text-base"
                      style={{ color: 'var(--green)' }}
                    >
                      {formatMontant(Math.round(ttc))}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text2)' }}>
                      TTC (TVA {f.tva_percent}%)
                    </p>
                  </div>

                  {/* Supprimer */}
                  <button
                    onClick={() => setDeleteConfirm(f.id)}
                    className="flex-shrink-0 p-2 rounded-lg transition-all hover:opacity-70"
                    style={{ color: 'var(--text2)' }}
                    title="Supprimer la facture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
