'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Plus, X, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Objectif {
  id: string
  user_id: string
  titre: string
  type: 'revenus' | 'depenses' | 'profit'
  montant_cible: number
  operateur: 'gte' | 'lte'
  mois: string
  created_at: string
}

interface RowMontant {
  montant: number
  date: string
}

interface Props {
  objectifs: Record<string, unknown>[]
  revenus: RowMontant[]
  depenses: RowMontant[]
  user: { id: string; email?: string } | null
}

function fcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'
}

function calcActuel(
  type: Objectif['type'],
  mois: string,
  revenus: RowMontant[],
  depenses: RowMontant[]
): number {
  const revMois = revenus
    .filter((r) => r.date && r.date.startsWith(mois))
    .reduce((s, r) => s + Number(r.montant), 0)
  const depMois = depenses
    .filter((d) => d.date && d.date.startsWith(mois))
    .reduce((s, d) => s + Number(d.montant), 0)
  if (type === 'revenus') return revMois
  if (type === 'depenses') return depMois
  return revMois - depMois
}

type BadgeKind = 'atteint' | 'en_cours' | 'rate'

function calcBadge(obj: Objectif, actuel: number): BadgeKind {
  const currentMois = new Date().toISOString().slice(0, 7)
  const goalMet =
    obj.operateur === 'gte' ? actuel >= obj.montant_cible : actuel <= obj.montant_cible
  if (goalMet) return 'atteint'
  if (obj.mois < currentMois) return 'rate'
  return 'en_cours'
}

function calcProgress(obj: Objectif, actuel: number): number {
  if (obj.montant_cible === 0) return 0
  const pct = (Math.abs(actuel) / obj.montant_cible) * 100
  return Math.max(0, Math.min(100, pct))
}

const typeLabel: Record<Objectif['type'], string> = {
  revenus: 'Revenus',
  depenses: 'Dépenses',
  profit: 'Profit',
}

const operateurLabel: Record<Objectif['operateur'], string> = {
  gte: '≥ au moins',
  lte: '≤ au plus',
}

interface FormState {
  titre: string
  type: Objectif['type']
  montant_cible: string
  mois: string
  operateur: Objectif['operateur']
}

const defaultForm: FormState = {
  titre: '',
  type: 'revenus',
  montant_cible: '',
  mois: new Date().toISOString().slice(0, 7),
  operateur: 'gte',
}

export default function ObjectifsClient({ objectifs, revenus, depenses, user }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const typedObjectifs = objectifs as unknown as Objectif[]

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Target className="w-12 h-12" style={{ color: 'var(--text2)' }} />
        <p className="text-lg font-semibold">Connectez-vous pour suivre vos objectifs</p>
        <p className="text-sm" style={{ color: 'var(--text2)' }}>
          Vos objectifs financiers apparaîtront ici après connexion.
        </p>
      </div>
    )
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value } as FormState))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.titre || !form.montant_cible || !form.mois) {
      setError('Tous les champs sont obligatoires.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: sbError } = await supabase.from('objectifs').insert({
        user_id: user.id,
        titre: form.titre,
        type: form.type,
        montant_cible: Number(form.montant_cible),
        operateur: form.operateur,
        mois: form.mois,
      })
      if (sbError) throw sbError
      setForm(defaultForm)
      setShowForm(false)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const badgeConfig = {
    atteint: { label: 'Atteint ✓', color: '#d4a017', bg: 'rgba(212,160,23,0.15)', icon: CheckCircle },
    en_cours: { label: 'En cours', color: 'var(--blue)', bg: 'rgba(59,130,246,0.12)', icon: Clock },
    rate: { label: 'Raté', color: 'var(--red)', bg: 'rgba(239,68,68,0.12)', icon: XCircle },
  } as const

  const progressBarColor = {
    atteint: '#d4a017',
    en_cours: 'var(--blue)',
    rate: 'var(--red)',
  } as const

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" style={{ color: '#d4a017' }} />
            Objectifs financiers
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {typedObjectifs.length} objectif{typedObjectifs.length !== 1 ? 's' : ''} défini
            {typedObjectifs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError('') }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: '#d4a017', color: '#000' }}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Annuler' : 'Nouvel objectif'}
        </button>
      </div>

      {/* Formulaire inline */}
      {showForm && (
        <div
          className="p-6 rounded-2xl border animate-slide-up"
          style={{ background: 'var(--bg2)', borderColor: 'rgba(212,160,23,0.3)' }}
        >
          <h2 className="text-base font-semibold mb-4">Nouvel objectif</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Titre *</label>
              <input
                name="titre"
                type="text"
                value={form.titre}
                onChange={handleFormChange}
                placeholder="Ex: Atteindre 500 000 FCFA de chiffre d'affaires"
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
              >
                <option value="revenus">Revenus</option>
                <option value="depenses">Dépenses</option>
                <option value="profit">Profit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Opérateur *</label>
              <select
                name="operateur"
                value={form.operateur}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
              >
                <option value="gte">≥ au moins</option>
                <option value="lte">≤ au plus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Montant cible (FCFA) *</label>
              <input
                name="montant_cible"
                type="number"
                min="0"
                value={form.montant_cible}
                onChange={handleFormChange}
                placeholder="500000"
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Mois *</label>
              <input
                name="mois"
                type="month"
                value={form.mois}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
              />
            </div>
            {error && (
              <div className="sm:col-span-2 px-4 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>
                {error}
              </div>
            )}
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setShowForm(false); setError('') }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                style={{ background: '#d4a017', color: '#000' }}
              >
                {loading ? 'Création…' : 'Créer l\'objectif'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des objectifs */}
      {typedObjectifs.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl border"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text2)' }}
        >
          <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium mb-1">Aucun objectif défini</p>
          <p className="text-sm">Cliquez sur &ldquo;Nouvel objectif&rdquo; pour commencer.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {typedObjectifs.map((obj) => {
            const actuel = calcActuel(obj.type, obj.mois, revenus, depenses)
            const badge = calcBadge(obj, actuel)
            const progress = calcProgress(obj, actuel)
            const cfg = badgeConfig[badge]
            const BadgeIcon = cfg.icon

            return (
              <div
                key={obj.id}
                className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">{obj.titre}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                      {typeLabel[obj.type]} · {operateurLabel[obj.operateur]} · {obj.mois}
                    </p>
                  </div>
                  <span
                    className="ml-3 flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
                {/* Montants */}
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text2)' }}>Réalisé</p>
                    <p className="text-lg font-bold font-mono" style={{ color: progressBarColor[badge] }}>
                      {fcfa(actuel)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text2)' }}>Objectif</p>
                    <p className="text-sm font-mono font-semibold">
                      {fcfa(obj.montant_cible)}
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--bg3)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: progressBarColor[badge],
                    }}
                  />
                </div>
                <p className="text-xs mt-1 text-right font-mono" style={{ color: 'var(--text2)' }}>
                  {Math.round(progress)}%
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats summary */}
      {typedObjectifs.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              { label: 'Atteints', kind: 'atteint' as BadgeKind, color: '#d4a017' },
              { label: 'En cours', kind: 'en_cours' as BadgeKind, color: 'var(--blue)' },
              { label: 'Ratés', kind: 'rate' as BadgeKind, color: 'var(--red)' },
            ] as const
          ).map((s) => {
            const count = typedObjectifs.filter((obj) => {
              const actuel = calcActuel(obj.type, obj.mois, revenus, depenses)
              return calcBadge(obj, actuel) === s.kind
            }).length
            return (
              <div
                key={s.kind}
                className="p-4 rounded-xl border text-center"
                style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
              >
                <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>
                  {count}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                  {s.label}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
