'use client'

import { useState, useMemo } from 'react'
import { usePersistedList } from '@/lib/store'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  TrendingDown, Plus, Search, Filter,
  X, ChevronDown, AlertTriangle, CheckCircle, Clock,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Categorie = 'Immobilier' | 'Stock' | 'RH' | 'Charges' | 'Équipement' | 'Services' | 'Fiscalité'
type Statut    = 'Payée' | 'En attente' | 'En retard'

interface Depense {
  id: number
  description: string
  categorie: Categorie
  montant: number
  date: string
  statut: Statut
  fournisseur: string
  reference: string
  notes?: string
}

const STORAGE_KEY = 'comptrack_depenses'

const CATEGORIES: Categorie[] = ['Immobilier', 'Stock', 'RH', 'Charges', 'Équipement', 'Services', 'Fiscalité']
const STATUTS: Statut[]       = ['Payée', 'En attente', 'En retard']

const CAT_COLORS: Record<Categorie, string> = {
  'Immobilier': '#D4AF37', 'Stock': '#00D4FF', 'RH': '#818CF8',
  'Charges': '#34D399', 'Équipement': '#F59E0B', 'Services': '#EC4899', 'Fiscalité': '#F97316',
}

const fmt  = (n: number) => n.toLocaleString('fr-FR') + ' FCFA'
const fmtK = (n: number) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + ' M' : n >= 1_000 ? (n / 1_000).toFixed(0) + ' k' : String(n)

function StatutBadge({ s }: { s: Statut }) {
  const cfg = {
    'Payée':      { icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    'En attente': { icon: Clock,         color: '#D4AF37', bg: 'rgba(212,175,55,0.12)' },
    'En retard':  { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  }[s]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />{s}
    </span>
  )
}

export default function DepensesPage() {
  const [search,       setSearch]       = useState('')
  const [filtreCat,    setFiltreCat]    = useState<Categorie | 'Toutes'>('Toutes')
  const [filtreStatut, setFiltreStatut] = useState<Statut | 'Tous'>('Tous')
  const [selected,     setSelected]     = useState<Depense | null>(null)
  const [depenses,     setDepenses]     = usePersistedList<Depense>(STORAGE_KEY)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [formError,    setFormError]    = useState('')
  const [form,         setForm]         = useState({
    description: '', categorie: 'Charges' as Categorie, montant: '', date: '',
    statut: 'En attente' as Statut, fournisseur: '', notes: '',
  })

  const openModal = () => {
    setForm({ description: '', categorie: 'Charges', montant: '', date: new Date().toISOString().split('T')[0], statut: 'En attente', fournisseur: '', notes: '' })
    setFormError('')
    setModalOpen(true)
  }

  const handleAdd = (ev: React.FormEvent) => {
    ev.preventDefault()
    const montant = Number(form.montant)
    if (!form.description.trim() || isNaN(montant) || montant <= 0) {
      setFormError('Indiquez une description et un montant positif.')
      return
    }
    const nouvelle: Depense = {
      id: Date.now(),
      description: form.description.trim(),
      categorie: form.categorie,
      montant,
      date: form.date || new Date().toISOString().split('T')[0],
      statut: form.statut,
      fournisseur: form.fournisseur.trim() || '—',
      reference: `DEP-${String(depenses.length + 1).padStart(4, '0')}`,
      notes: form.notes.trim() || undefined,
    }
    setDepenses(prev => [nouvelle, ...prev])
    setModalOpen(false)
  }

  const marquerPayee = (id: number) => {
    setDepenses(prev => prev.map(d => (d.id === id ? { ...d, statut: 'Payée' as Statut } : d)))
    setSelected(null)
  }

  const filtered = useMemo(() => depenses.filter(d => {
    const okSearch = d.description.toLowerCase().includes(search.toLowerCase()) ||
                     d.fournisseur.toLowerCase().includes(search.toLowerCase()) ||
                     d.reference.toLowerCase().includes(search.toLowerCase())
    const okCat    = filtreCat === 'Toutes' || d.categorie === filtreCat
    const okStatut = filtreStatut === 'Tous' || d.statut === filtreStatut
    return okSearch && okCat && okStatut
  }), [depenses, search, filtreCat, filtreStatut])

  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0)
  const totalEnRetard = depenses.filter(d => d.statut === 'En retard').reduce((s, d) => s + d.montant, 0)
  const totalAttente  = depenses.filter(d => d.statut === 'En attente').reduce((s, d) => s + d.montant, 0)
  const nbEnRetard    = depenses.filter(d => d.statut === 'En retard').length

  const chartData = CATEGORIES.map(cat => ({
    name: cat,
    montant: depenses.filter(d => d.categorie === cat).reduce((s, d) => s + d.montant, 0),
    color: CAT_COLORS[cat],
  })).filter(d => d.montant > 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            Suivi et analyse de vos charges
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Nouvelle dépense
          </button>
        </div>
      </div>

      {/* Alerte retard */}
      {nbEnRetard > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <p className="text-sm">
            <span className="font-semibold" style={{ color: '#ef4444' }}>{nbEnRetard} dépense{nbEnRetard > 1 ? 's' : ''} en retard</span>
            <span style={{ color: 'var(--text2)' }}> — montant total : {fmt(totalEnRetard)}</span>
          </p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total dépenses',     value: fmt(totalDepenses), sub: `${depenses.length} dépense${depenses.length > 1 ? 's' : ''}`,  accent: false },
          { label: 'En retard',          value: fmt(totalEnRetard), sub: `${nbEnRetard} à régulariser`, accent: true },
          { label: 'En attente',         value: fmt(totalAttente),  sub: `${depenses.filter(d => d.statut === 'En attente').length} à régler`, accent: false },
          { label: 'Moy. / transaction', value: fmt(depenses.length ? Math.round(totalDepenses / depenses.length) : 0), sub: `sur ${depenses.length} dépense${depenses.length > 1 ? 's' : ''}`, accent: false },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{
            background:   k.accent ? 'rgba(239,68,68,0.06)' : 'var(--bg2)',
            borderColor:  k.accent ? 'rgba(239,68,68,0.25)' : 'var(--border)',
          }}>
            <p className="text-xs mb-2" style={{ color: k.accent ? '#ef4444' : 'var(--text2)' }}>{k.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: k.accent ? '#ef4444' : 'var(--text)' }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* BarChart */}
      {chartData.length > 0 && (
      <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <h3 className="font-semibold mb-4">Répartition par catégorie</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} width={55} />
            <Tooltip
              contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [fmt(v), 'Montant']}
            />
            <Bar dataKey="montant" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-xl"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text2)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…" className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text)' }} />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="w-3.5 h-3.5" style={{ color: 'var(--text2)' }} />
            </button>
          )}
        </div>

        <div className="relative">
          <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text2)' }} />
          <select value={filtreCat} onChange={e => setFiltreCat(e.target.value as Categorie | 'Toutes')}
            className="pl-8 pr-8 py-2 rounded-xl text-sm appearance-none outline-none cursor-pointer"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <option value="Toutes">Toutes catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text2)' }} />
        </div>

        <div className="relative">
          <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as Statut | 'Tous')}
            className="pl-4 pr-8 py-2 rounded-xl text-sm appearance-none outline-none cursor-pointer"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <option value="Tous">Tous statuts</option>
            {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text2)' }} />
        </div>

        <p className="text-sm ml-auto" style={{ color: 'var(--text2)' }}>
          {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      {depenses.length === 0 && (
        <div className="p-8 rounded-2xl border text-center" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>Aucune dépense enregistrée pour le moment.</p>
          <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Ajouter une dépense
          </button>
        </div>
      )}
      {depenses.length > 0 && (
      <div className="rounded-2xl border overflow-x-auto" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Description', 'Catégorie', 'Fournisseur', 'Date', 'Montant', 'Statut'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text2)' }}>
                  {depenses.length === 0 ? (
                    <div className="flex flex-col items-center gap-3">
                      <span>Aucune dépense enregistrée pour le moment.</span>
                      <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                        style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                        <Plus className="w-4 h-4" /> Ajouter une dépense
                      </button>
                    </div>
                  ) : 'Aucune dépense ne correspond aux filtres'}
                </td>
              </tr>
            ) : filtered.map(dep => (
              <tr key={dep.id} onClick={() => setSelected(dep)}
                className="hover:brightness-110 cursor-pointer transition-all"
                style={{ borderTop: '1px solid var(--border)' }}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${CAT_COLORS[dep.categorie]}18` }}>
                      <TrendingDown className="w-4 h-4" style={{ color: CAT_COLORS[dep.categorie] }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{dep.description}</p>
                      <p className="text-xs" style={{ color: 'var(--text2)' }}>{dep.reference}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${CAT_COLORS[dep.categorie]}18`, color: CAT_COLORS[dep.categorie] }}>
                    {dep.categorie}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text2)' }}>{dep.fournisseur}</td>
                <td className="px-4 py-3.5 text-sm font-mono" style={{ color: 'var(--text2)' }}>{dep.date}</td>
                <td className="px-4 py-3.5 text-sm font-bold font-mono" style={{ color: '#ef4444' }}>
                  -{dep.montant.toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-4 py-3.5"><StatutBadge s={dep.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      )}

      {/* Modal détail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 space-y-4"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{selected.description}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{selected.reference}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="p-2 rounded-xl hover:brightness-110"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                ['Catégorie',   selected.categorie],
                ['Fournisseur', selected.fournisseur],
                ['Date',        selected.date],
                ['Montant',     fmt(selected.montant)],
                ['Statut',      selected.statut],
                ...(selected.notes ? [['Notes', selected.notes]] : []),
              ].map(([label, val], i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg2)' : 'transparent' }}>
                  <span className="text-xs" style={{ color: 'var(--text2)' }}>{label}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
            {selected.statut !== 'Payée' && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => marquerPayee(selected.id)} className="flex-1 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110 transition"
                  style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                  Marquer payée
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal nouvelle dépense */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModalOpen(false)}>
          <form onSubmit={handleAdd} className="w-full max-w-md rounded-3xl p-6 space-y-3 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Nouvelle dépense</h3>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fermer"
                className="p-2 rounded-xl hover:brightness-110" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {[
              { label: 'Description *', key: 'description', type: 'text', placeholder: 'Ce que vous avez payé' },
              { label: 'Montant (FCFA) *', key: 'montant', type: 'number', placeholder: 'Montant' },
              { label: 'Fournisseur', key: 'fournisseur', type: 'text', placeholder: 'Nom du fournisseur' },
              { label: 'Date', key: 'date', type: 'date', placeholder: '' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key as 'description' | 'montant' | 'fournisseur' | 'date']}
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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Statut</label>
                <select value={form.statut} onChange={e => setForm(p => ({ ...p, statut: e.target.value as Statut }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                  {STATUTS.map(st => <option key={st} value={st}>{st}</option>)}
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
