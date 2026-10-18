'use client'

import { useState } from 'react'
import { usePersistedList, STORAGE_KEYS } from '@/lib/store'
import { Target, Plus, CheckCircle2, AlertTriangle, Clock, X, TrendingUp, Users, Wallet, Settings } from 'lucide-react'

type Categorie = 'Financier' | 'Commercial' | 'RH' | 'Operationnel'
type StatutObj = 'Atteint' | 'En cours' | 'En retard' | 'En pause'

interface Objectif {
  id: number; titre: string; description: string; categorie: Categorie
  cible: number; actuel: number; unite: string; echeance: string; statut: StatutObj
}

const UNITES = ['FCFA', '%', 'clients', 'employés', 'contacts', 'unités']

const CAT_ICON: Record<Categorie, typeof Target> = {
  'Financier': Wallet, 'Commercial': TrendingUp, 'RH': Users, 'Operationnel': Settings,
}
const CAT_COLOR: Record<Categorie, string> = {
  'Financier': '#D4AF37', 'Commercial': '#00D4FF', 'RH': '#818CF8', 'Operationnel': '#10b981',
}
const STATUT_CFG: Record<StatutObj, { color: string; bg: string; icon: typeof Target }> = {
  'Atteint':   { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2   },
  'En cours':  { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)',  icon: Target         },
  'En retard': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertTriangle  },
  'En pause':  { color: '#64748b', bg: 'rgba(100,116,139,0.12)', icon: Clock          },
}

const fmtVal = (n: number, unite: string) =>
  unite === 'FCFA' ? n.toLocaleString('fr-FR') + ' FCFA' : `${n} ${unite}`

function Progress({ pct, statut }: { pct: number; statut: StatutObj }) {
  const color = statut === 'Atteint' ? '#10b981' : statut === 'En retard' ? '#ef4444' : statut === 'En pause' ? '#64748b' : undefined
  return (
    <div className="h-2 rounded-full" style={{ background: 'var(--bg3)' }}>
      <div className="h-full rounded-full transition-all duration-500" style={{
        width: `${Math.min(pct, 100)}%`,
        background: color || 'linear-gradient(90deg, #D4AF37, #00D4FF)',
      }} />
    </div>
  )
}

export default function ObjectifsPage() {
  const [filtreCat, setFiltreCat] = useState<Categorie | 'Toutes'>('Toutes')
  const [selected, setSelected] = useState<Objectif | null>(null)
  const [objectifs, setObjectifs] = usePersistedList<Objectif>(STORAGE_KEYS.objectifs)
  const [modalOpen, setModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    titre: '', description: '', categorie: 'Financier' as Categorie,
    cible: '', actuel: '0', unite: 'FCFA', echeance: '',
  })
  const [actuelEdit, setActuelEdit] = useState('')

  const openModal = () => {
    setForm({ titre: '', description: '', categorie: 'Financier', cible: '', actuel: '0', unite: 'FCFA', echeance: '' })
    setFormError('')
    setModalOpen(true)
  }

  const statutPour = (o: { cible: number; actuel: number; echeance: string; statut?: StatutObj }): StatutObj => {
    if (o.actuel >= o.cible) return 'Atteint'
    if (o.echeance && new Date(o.echeance) < new Date()) return 'En retard'
    return 'En cours'
  }

  const handleAdd = (ev: React.FormEvent) => {
    ev.preventDefault()
    const cible = Number(form.cible)
    const actuel = Number(form.actuel === '' ? '0' : form.actuel)
    if (!form.titre.trim() || isNaN(cible) || cible <= 0 || isNaN(actuel) || actuel < 0) {
      setFormError('Indiquez un titre, une cible positive et une valeur actuelle valide.')
      return
    }
    const base = { cible, actuel, echeance: form.echeance }
    setObjectifs(prev => [{
      id: Date.now(), titre: form.titre.trim(), description: form.description.trim(),
      categorie: form.categorie, cible, actuel, unite: form.unite, echeance: form.echeance,
      statut: statutPour(base),
    }, ...prev])
    setModalOpen(false)
  }

  const mettreAJour = (id: number) => {
    const actuel = Number(actuelEdit)
    if (isNaN(actuel) || actuel < 0) return
    setObjectifs(prev => prev.map(o => (o.id === id ? { ...o, actuel, statut: statutPour({ ...o, actuel }) } : o)))
    setSelected(null)
  }

  const liste = objectifs
  const filtered = liste.filter(o => filtreCat === 'Toutes' || o.categorie === filtreCat)

  const nbAtteints  = liste.filter(o => o.statut === 'Atteint').length
  const nbEnCours   = liste.filter(o => o.statut === 'En cours').length
  const nbEnRetard  = liste.filter(o => o.statut === 'En retard').length
  const avgProgress = liste.length ? Math.round(liste.reduce((s, o) => s + Math.min((o.actuel / o.cible) * 100, 100), 0) / liste.length) : 0

  const CATS: Categorie[] = ['Financier', 'Commercial', 'RH', 'Operationnel']

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Objectifs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {nbAtteints}/{liste.length} objectifs atteints — progression globale {avgProgress}%
          </p>
        </div>
        <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
          style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
          <Plus className="w-4 h-4" /> Nouvel objectif
        </button>
      </div>

      {nbEnRetard > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <p className="text-sm">
            <span className="font-semibold" style={{ color: '#ef4444' }}>{nbEnRetard} objectif{nbEnRetard > 1 ? 's' : ''} en retard</span>
            <span style={{ color: 'var(--text2)' }}> — action requise avant echeance</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Atteints',      value: String(nbAtteints),  sub: `sur ${liste.length} total`, color: '#10b981' },
          { label: 'En cours',      value: String(nbEnCours),   sub: 'progression active',       color: '#D4AF37' },
          { label: 'En retard',     value: String(nbEnRetard),  sub: 'action requise',           color: '#ef4444' },
          { label: 'Progression',   value: `${avgProgress}%`,   sub: 'moyenne tous objectifs',   color: 'var(--text)' },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text2)' }}>{k.label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['Toutes', ...CATS] as (Categorie | 'Toutes')[]).map(cat => {
          const active = filtreCat === cat
          return (
            <button key={cat} onClick={() => setFiltreCat(cat)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? (cat === 'Toutes' ? 'var(--gold)' : CAT_COLOR[cat as Categorie]) : 'var(--bg2)',
                color:      active ? (cat === 'Toutes' ? 'var(--navy)' : 'white') : 'var(--text2)',
                border:     active ? 'none' : '1px solid var(--border)',
              }}>
              {cat === 'Toutes' ? 'Tous' : cat}
              <span className="ml-1.5 text-xs opacity-70">
                {cat === 'Toutes' ? liste.length : liste.filter(o => o.categorie === cat).length}
              </span>
            </button>
          )
        })}
      </div>

      {liste.length === 0 && (
        <div className="p-8 rounded-2xl border text-center" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <p className="text-base font-semibold mb-1">Aucun objectif pour le moment</p>
          <p className="text-sm mb-5 mx-auto max-w-md" style={{ color: 'var(--text2)' }}>
            Fixez une cible chiffrée (chiffre d&apos;affaires, nombre de clients, taux de recouvrement…) et suivez votre progression.
          </p>
          <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Ajouter un objectif
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map(obj => {
          const pct = Math.min(Math.round((obj.actuel / obj.cible) * 100), 100)
          const Icon = CAT_ICON[obj.categorie]
          const sCfg = STATUT_CFG[obj.statut]
          const SIcon = sCfg.icon
          return (
            <div key={obj.id} onClick={() => { setSelected(obj); setActuelEdit(String(obj.actuel)) }}
              className="p-5 rounded-2xl border cursor-pointer hover:brightness-110 transition-all"
              style={{ background: 'var(--bg2)', borderColor: obj.statut === 'Atteint' ? 'rgba(16,185,129,0.3)' : obj.statut === 'En retard' ? 'rgba(239,68,68,0.3)' : 'var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${CAT_COLOR[obj.categorie]}18` }}>
                    <Icon className="w-4 h-4" style={{ color: CAT_COLOR[obj.categorie] }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{obj.titre}</p>
                    <p className="text-xs" style={{ color: 'var(--text2)' }}>{obj.categorie} · {obj.echeance}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                  style={{ background: sCfg.bg, color: sCfg.color }}>
                  <SIcon className="w-3 h-3" />{obj.statut}
                </span>
              </div>
              <Progress pct={pct} statut={obj.statut} />
              <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text2)' }}>
                <span>{fmtVal(obj.actuel, obj.unite)} / {fmtVal(obj.cible, obj.unite)}</span>
                <span className="font-bold" style={{ color: sCfg.color }}>{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 space-y-4"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {(() => { const Icon = CAT_ICON[selected.categorie]; return (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${CAT_COLOR[selected.categorie]}18` }}>
                    <Icon className="w-5 h-5" style={{ color: CAT_COLOR[selected.categorie] }} />
                  </div>
                )})()}
                <div>
                  <h3 className="font-bold leading-snug">{selected.titre}</h3>
                  <p className="text-xs" style={{ color: 'var(--text2)' }}>{selected.categorie}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:brightness-110"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm" style={{ color: 'var(--text2)' }}>{selected.description}</p>
            <div className="space-y-2">
              <Progress pct={Math.min(Math.round((selected.actuel / selected.cible) * 100), 100)} statut={selected.statut} />
              <div className="flex justify-between text-xs" style={{ color: 'var(--text2)' }}>
                <span>Actuel : {fmtVal(selected.actuel, selected.unite)}</span>
                <span>Cible : {fmtVal(selected.cible, selected.unite)}</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                ['Statut',    selected.statut],
                ['Echeance',  selected.echeance],
                ['Progression', `${Math.min(Math.round((selected.actuel / selected.cible) * 100), 100)}%`],
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg2)' : 'transparent' }}>
                  <span className="text-xs" style={{ color: 'var(--text2)' }}>{label}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Mettre à jour la valeur actuelle ({selected.unite})</label>
              <input type="number" min="0" value={actuelEdit} onChange={e => setActuelEdit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setSelected(null)} className="flex-1 min-h-10 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                Fermer
              </button>
              <button onClick={() => mettreAJour(selected.id)} className="flex-1 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModalOpen(false)}>
          <form onSubmit={handleAdd} className="w-full max-w-md rounded-3xl p-6 space-y-3 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Nouvel objectif</h3>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fermer"
                className="p-2 rounded-xl hover:brightness-110" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {[
              { label: 'Titre *', key: 'titre', type: 'text', placeholder: 'Ce que vous voulez atteindre' },
              { label: 'Description', key: 'description', type: 'text', placeholder: 'Précisions (facultatif)' },
              { label: 'Cible *', key: 'cible', type: 'number', placeholder: 'Valeur à atteindre' },
              { label: 'Valeur actuelle', key: 'actuel', type: 'number', placeholder: 'Où vous en êtes' },
              { label: 'Échéance', key: 'echeance', type: 'date', placeholder: '' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key as 'titre' | 'description' | 'cible' | 'actuel' | 'echeance']}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Catégorie</label>
                <select value={form.categorie} onChange={e => setForm(p => ({ ...p, categorie: e.target.value as Categorie }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Unité</label>
                <select value={form.unite} onChange={e => setForm(p => ({ ...p, unite: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                  {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            {formError && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{formError}</p>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 min-h-10 rounded-xl text-sm font-medium"
                style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>Annuler</button>
              <button type="submit" className="flex-1 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
