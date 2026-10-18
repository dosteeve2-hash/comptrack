'use client'

import { useState, useMemo } from 'react'
import { usePersistedList } from '@/lib/store'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Plus, Search, X, ChevronDown } from 'lucide-react'

type Source = 'Ventes' | 'Services' | 'Commissions' | 'Abonnements' | 'Projets' | 'Autres'
type Statut = 'Encaisse' | 'En attente' | 'Partiel'

interface Revenu {
  id: number; description: string; source: Source; client: string
  montant: number; encaisse: number; date: string; statut: Statut
}

const STORAGE_KEY = 'comptrack_revenus'

const SOURCES: Source[] = ['Ventes', 'Services', 'Commissions', 'Abonnements', 'Projets', 'Autres']
const SRC_COLOR: Record<Source, string> = {
  'Ventes': '#D4AF37', 'Services': '#00D4FF', 'Commissions': '#818CF8',
  'Abonnements': '#10b981', 'Projets': '#F97316', 'Autres': '#64748b',
}

const MOIS_ABBR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

function tendance(revenus: Revenu[]): { mois: string; total: number }[] {
  const now = new Date()
  const result: { mois: string; total: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const total = revenus
      .filter(r => {
        const rd = new Date(r.date)
        return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth()
      })
      .reduce((s, r) => s + r.montant, 0)
    result.push({ mois: MOIS_ABBR[d.getMonth()], total })
  }
  return result
}

const fmt  = (n: number) => n.toLocaleString('fr-FR') + ' FCFA'
const fmtK = (n: number) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + ' M' : n >= 1_000 ? (n / 1_000).toFixed(0) + ' k' : String(n)

function StatutPill({ s }: { s: Statut }) {
  const cfg = {
    'Encaisse':   { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    'En attente': { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)' },
    'Partiel':    { color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  }[s]
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>{s}</span>
  )
}

export default function RevenusPage() {
  const [search,   setSearch]   = useState('')
  const [filtreSrc, setFiltreSrc] = useState<Source | 'Toutes'>('Toutes')
  const [selected, setSelected] = useState<Revenu | null>(null)
  const [revenus, setRevenus] = usePersistedList<Revenu>(STORAGE_KEY)
  const [modalOpen, setModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    description: '', source: 'Ventes' as Source, client: '', montant: '', encaisse: '', date: '',
  })

  const openModal = () => {
    setForm({ description: '', source: 'Ventes', client: '', montant: '', encaisse: '', date: new Date().toISOString().split('T')[0] })
    setFormError('')
    setModalOpen(true)
  }

  const handleAdd = (ev: React.FormEvent) => {
    ev.preventDefault()
    const montant = Number(form.montant)
    const encaisse = form.encaisse.trim() === '' ? montant : Number(form.encaisse)
    if (!form.description.trim() || isNaN(montant) || montant <= 0 || isNaN(encaisse) || encaisse < 0 || encaisse > montant) {
      setFormError('Indiquez une description, un montant positif et un encaissé compris entre 0 et le montant.')
      return
    }
    const statut: Statut = encaisse >= montant ? 'Encaisse' : encaisse > 0 ? 'Partiel' : 'En attente'
    setRevenus(prev => [{
      id: Date.now(), description: form.description.trim(), source: form.source,
      client: form.client.trim() || '—', montant, encaisse,
      date: form.date || new Date().toISOString().split('T')[0], statut,
    }, ...prev])
    setModalOpen(false)
  }

  const filtered = useMemo(() => revenus.filter(r => {
    const ok1 = r.description.toLowerCase().includes(search.toLowerCase()) || r.client.toLowerCase().includes(search.toLowerCase())
    const ok2 = filtreSrc === 'Toutes' || r.source === filtreSrc
    return ok1 && ok2
  }), [revenus, search, filtreSrc])

  const total     = revenus.reduce((s, r) => s + r.montant, 0)
  const encaisse  = revenus.reduce((s, r) => s + r.encaisse, 0)
  const attente   = total - encaisse
  const trend = useMemo(() => tendance(revenus), [revenus])
  const moisPrec = trend[trend.length - 2].total
  const moisCour = trend[trend.length - 1].total
  const croissance = moisPrec > 0 ? Math.round(((moisCour - moisPrec) / moisPrec) * 100) : null

  const bySource = SOURCES.map(src => ({
    name: src, montant: revenus.filter(r => r.source === src).reduce((s, r) => s + r.montant, 0), color: SRC_COLOR[src],
  })).filter(d => d.montant > 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenus</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Suivi des encaissements</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Nouveau revenu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total revenus',   value: fmt(total),    sub: `${revenus.length} transactions`, color: 'var(--text)' },
          { label: 'Encaisse',        value: fmt(encaisse), sub: `${revenus.filter(r => r.statut === 'Encaisse').length} reglements`, color: '#10b981' },
          { label: 'En attente',      value: fmt(attente),  sub: `${revenus.filter(r => r.statut !== 'Encaisse').length} a encaisser`, color: '#D4AF37' },
          { label: 'Croissance',      value: croissance === null ? '—' : `${croissance > 0 ? '+' : ''}${croissance}%`, sub: 'vs mois precedent', color: croissance !== null && croissance < 0 ? '#ef4444' : '#10b981' },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text2)' }}>{k.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {revenus.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4">Tendance mensuelle</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [fmt(v), 'Revenus']} />
              <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4">Repartition par source</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={bySource} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 10, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text2)' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [fmt(v), 'Montant']} />
              <Bar dataKey="montant" radius={[0, 6, 6, 0]}>
                {bySource.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-xl"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text2)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text)' }} />
          {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5" style={{ color: 'var(--text2)' }} /></button>}
        </div>
        <div className="relative">
          <select value={filtreSrc} onChange={e => setFiltreSrc(e.target.value as Source | 'Toutes')}
            className="pl-4 pr-8 py-2 rounded-xl text-sm appearance-none outline-none cursor-pointer"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <option value="Toutes">Toutes sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text2)' }} />
        </div>
        <p className="text-sm ml-auto" style={{ color: 'var(--text2)' }}>{filtered.length} resultat{filtered.length > 1 ? 's' : ''}</p>
      </div>

      {revenus.length === 0 && (
        <div className="p-8 rounded-2xl border text-center" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>Aucun revenu enregistré pour le moment.</p>
          <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Ajouter un revenu
          </button>
        </div>
      )}
      {revenus.length > 0 && (
      <div className="rounded-2xl border overflow-x-auto" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Description', 'Source', 'Client', 'Date', 'Montant', 'Statut'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text2)' }}>
                  {revenus.length === 0 ? (
                    <div className="flex flex-col items-center gap-3">
                      <span>Aucun revenu enregistré pour le moment.</span>
                      <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
                        style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                        <Plus className="w-4 h-4" /> Ajouter un revenu
                      </button>
                    </div>
                  ) : 'Aucun revenu ne correspond aux filtres'}
                </td>
              </tr>
            )}
            {filtered.map(r => (
              <tr key={r.id} onClick={() => setSelected(r)}
                className="hover:brightness-110 cursor-pointer transition-all"
                style={{ borderTop: '1px solid var(--border)' }}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${SRC_COLOR[r.source]}18` }}>
                      <TrendingUp className="w-4 h-4" style={{ color: SRC_COLOR[r.source] }} />
                    </div>
                    <p className="text-sm font-medium">{r.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${SRC_COLOR[r.source]}18`, color: SRC_COLOR[r.source] }}>
                    {r.source}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text2)' }}>{r.client}</td>
                <td className="px-4 py-3.5 text-sm font-mono" style={{ color: 'var(--text2)' }}>{r.date}</td>
                <td className="px-4 py-3.5 text-sm font-bold font-mono" style={{ color: '#10b981' }}>
                  +{r.montant.toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-4 py-3.5"><StatutPill s={r.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 space-y-4"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg leading-snug">{selected.description}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{selected.client}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:brightness-110"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                ['Source',    selected.source],
                ['Date',      selected.date],
                ['Montant',   fmt(selected.montant)],
                ['Encaisse',  fmt(selected.encaisse)],
                ['Restant',   fmt(selected.montant - selected.encaisse)],
                ['Statut',    selected.statut],
              ].map(([label, val], i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg2)' : 'transparent' }}>
                  <span className="text-xs" style={{ color: 'var(--text2)' }}>{label}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setSelected(null)} className="flex-1 min-h-10 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                Fermer
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
              <h3 className="font-bold text-lg">Nouveau revenu</h3>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fermer"
                className="p-2 rounded-xl hover:brightness-110" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {[
              { label: 'Description *', key: 'description', type: 'text', placeholder: 'Ce que vous avez vendu' },
              { label: 'Client', key: 'client', type: 'text', placeholder: 'Nom du client' },
              { label: 'Montant (FCFA) *', key: 'montant', type: 'number', placeholder: 'Montant total' },
              { label: 'Déjà encaissé (FCFA)', key: 'encaisse', type: 'number', placeholder: 'Laisser vide si tout est encaissé' },
              { label: 'Date', key: 'date', type: 'date', placeholder: '' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key as 'description' | 'client' | 'montant' | 'encaisse' | 'date']}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
              </div>
            ))}
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Source</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value as Source }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                {SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
              </select>
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
