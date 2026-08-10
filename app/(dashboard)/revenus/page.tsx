'use client'

import { useState, useMemo } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Plus, Search, X, ChevronDown, Download, ArrowUpRight } from 'lucide-react'

type Source = 'Ventes' | 'Services' | 'Commissions' | 'Abonnements' | 'Projets' | 'Autres'
type Statut = 'Encaisse' | 'En attente' | 'Partiel'

interface Revenu {
  id: number; description: string; source: Source; client: string
  montant: number; encaisse: number; date: string; statut: Statut
}

const MOCK: Revenu[] = [
  { id: 1,  description: 'Abonnement clients — Juillet',      source: 'Abonnements', client: 'Clients recurrents',     montant: 625000, encaisse: 625000, date: '2026-07-01', statut: 'Encaisse' },
  { id: 2,  description: 'Vente marchandises — Lot A',        source: 'Ventes',      client: 'Divers',                 montant: 485000, encaisse: 485000, date: '2026-07-03', statut: 'Encaisse' },
  { id: 3,  description: 'Contrat prestation SI — phase 1',   source: 'Projets',     client: 'Ministere Agriculture',  montant: 850000, encaisse: 425000, date: '2026-07-05', statut: 'Partiel'  },
  { id: 4,  description: 'Commission vente terrain Ouaga',    source: 'Commissions', client: 'SCI Patrimoniale BF',    montant: 180000, encaisse: 180000, date: '2026-07-08', statut: 'Encaisse' },
  { id: 5,  description: 'Formation equipe commerciale',      source: 'Services',    client: 'Compaore & Associes',    montant: 220000, encaisse: 220000, date: '2026-07-10', statut: 'Encaisse' },
  { id: 6,  description: 'Vente marchandises — Lot B',        source: 'Ventes',      client: 'Divers',                 montant: 310000, encaisse: 310000, date: '2026-07-14', statut: 'Encaisse' },
  { id: 7,  description: 'Conseil juridique & fiscal',        source: 'Services',    client: 'Zongo Industries',       montant: 150000, encaisse: 0,      date: '2026-07-18', statut: 'En attente' },
  { id: 8,  description: 'Abonnement SaaS annuel',            source: 'Abonnements', client: 'BRAFASO SARL',           montant: 360000, encaisse: 360000, date: '2026-07-20', statut: 'Encaisse' },
  { id: 9,  description: 'Vente equipements bureautiques',    source: 'Ventes',      client: 'Mairie Ouagadougou',     montant: 275000, encaisse: 275000, date: '2026-07-22', statut: 'Encaisse' },
  { id: 10, description: 'Commission recrutement cadres',     source: 'Commissions', client: 'Total Energies BF',      montant: 95000,  encaisse: 95000,  date: '2026-07-25', statut: 'Encaisse' },
  { id: 11, description: 'Contrat maintenance informatique',  source: 'Projets',     client: 'ONATEL BF',              montant: 480000, encaisse: 480000, date: '2026-07-28', statut: 'Encaisse' },
  { id: 12, description: 'Formation digital marketing',       source: 'Services',    client: 'PME Ouaga Cluster',      montant: 185000, encaisse: 0,      date: '2026-07-30', statut: 'En attente' },
  { id: 13, description: 'Vente marchandises — Aout',         source: 'Ventes',      client: 'Divers',                 montant: 420000, encaisse: 420000, date: '2026-08-03', statut: 'Encaisse' },
  { id: 14, description: 'Abonnement clients — Aout',        source: 'Abonnements', client: 'Clients recurrents',     montant: 625000, encaisse: 625000, date: '2026-08-05', statut: 'Encaisse' },
]

const SOURCES: Source[] = ['Ventes', 'Services', 'Commissions', 'Abonnements', 'Projets', 'Autres']
const SRC_COLOR: Record<Source, string> = {
  'Ventes': '#D4AF37', 'Services': '#00D4FF', 'Commissions': '#818CF8',
  'Abonnements': '#10b981', 'Projets': '#F97316', 'Autres': '#64748b',
}

const TREND = [
  { mois: 'Avr', total: 1820000 }, { mois: 'Mai', total: 2150000 },
  { mois: 'Juin', total: 2580000 }, { mois: 'Juil', total: 4035000 }, { mois: 'Aout', total: 1045000 },
]

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

  const filtered = useMemo(() => MOCK.filter(r => {
    const ok1 = r.description.toLowerCase().includes(search.toLowerCase()) || r.client.toLowerCase().includes(search.toLowerCase())
    const ok2 = filtreSrc === 'Toutes' || r.source === filtreSrc
    return ok1 && ok2
  }), [search, filtreSrc])

  const total     = MOCK.reduce((s, r) => s + r.montant, 0)
  const encaisse  = MOCK.reduce((s, r) => s + r.encaisse, 0)
  const attente   = total - encaisse
  const croissance = Math.round(((TREND[3].total - TREND[2].total) / TREND[2].total) * 100)

  const bySource = SOURCES.map(src => ({
    name: src, montant: MOCK.filter(r => r.source === src).reduce((s, r) => s + r.montant, 0), color: SRC_COLOR[src],
  })).filter(d => d.montant > 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenus</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Suivi des encaissements — Juillet–Aout 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:opacity-80"
            style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
            <Download className="w-4 h-4" /> Exporter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Nouveau revenu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total revenus',   value: fmt(total),    sub: `${MOCK.length} transactions`, color: 'var(--text)' },
          { label: 'Encaisse',        value: fmt(encaisse), sub: `${MOCK.filter(r => r.statut === 'Encaisse').length} reglements`, color: '#10b981' },
          { label: 'En attente',      value: fmt(attente),  sub: `${MOCK.filter(r => r.statut !== 'Encaisse').length} a encaisser`, color: '#D4AF37' },
          { label: 'Croissance',      value: `+${croissance}%`, sub: 'vs mois precedent', color: '#10b981' },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text2)' }}>{k.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4">Tendance mensuelle</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={TREND} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Description', 'Source', 'Client', 'Date', 'Montant', 'Statut'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
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
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                Fermer
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                <ArrowUpRight className="w-4 h-4" /> Voir facture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
