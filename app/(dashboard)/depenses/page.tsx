'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  TrendingDown, Plus, Search, Filter, Download,
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

// ─── Données mock ─────────────────────────────────────────────────────────────
const MOCK_DEPENSES: Depense[] = [
  { id: 1, description: 'Loyer local commercial Ouaga 2000', categorie: 'Immobilier', montant: 250000, date: '2026-07-01', statut: 'Payée',      fournisseur: 'SCI Patrimoniale BF',  reference: 'DEP-2607-001' },
  { id: 2, description: 'Achat marchandises — lot juillet',   categorie: 'Stock',       montant: 520000, date: '2026-07-03', statut: 'Payée',      fournisseur: 'SONATUR Commerce',     reference: 'DEP-2607-002' },
  { id: 3, description: 'Salaires — Juillet 2026',            categorie: 'RH',          montant: 680000, date: '2026-07-05', statut: 'Payée',      fournisseur: 'Interne',              reference: 'DEP-2607-003' },
  { id: 4, description: 'CNSS cotisations patronales',        categorie: 'Fiscalité',   montant: 82000,  date: '2026-07-10', statut: 'Payée',      fournisseur: 'CNSS Burkina',         reference: 'DEP-2607-004' },
  { id: 5, description: 'Facture SONABEL — électricité',      categorie: 'Charges',     montant: 35000,  date: '2026-07-12', statut: 'Payée',      fournisseur: 'SONABEL',              reference: 'DEP-2607-005' },
  { id: 6, description: 'Abonnement Fibre ONATEL',            categorie: 'Charges',     montant: 28000,  date: '2026-07-12', statut: 'Payée',      fournisseur: 'ONATEL BF',            reference: 'DEP-2607-006' },
  { id: 7, description: 'Maintenance matériel informatique',  categorie: 'Équipement',  montant: 75000,  date: '2026-07-15', statut: 'Payée',      fournisseur: 'TechPro Ouaga',        reference: 'DEP-2607-007' },
  { id: 8, description: 'Conseil juridique — contrat bail',   categorie: 'Services',    montant: 120000, date: '2026-07-18', statut: 'Payée',      fournisseur: 'Cabinet Sawadogo',     reference: 'DEP-2607-008' },
  { id: 9, description: 'Achat fournitures bureau',           categorie: 'Charges',     montant: 18500,  date: '2026-07-20', statut: 'En attente', fournisseur: 'Bureau Plus BF',       reference: 'DEP-2607-009' },
  { id: 10, description: 'Formation équipe commerciale',      categorie: 'RH',          montant: 95000,  date: '2026-07-22', statut: 'En attente', fournisseur: 'Institut FASEG',       reference: 'DEP-2607-010' },
  { id: 11, description: 'TVA déclarée DGI — T2 2026',        categorie: 'Fiscalité',   montant: 148000, date: '2026-07-25', statut: 'En retard',  fournisseur: 'DGI Burkina',          reference: 'DEP-2607-011', notes: 'Dépôt effectué, paiement en attente' },
  { id: 12, description: 'Carburant véhicules livraison',     categorie: 'Charges',     montant: 42000,  date: '2026-07-28', statut: 'En attente', fournisseur: 'Total Énergies BF',    reference: 'DEP-2607-012' },
  { id: 13, description: 'Assurance multirisque local',       categorie: 'Services',    montant: 55000,  date: '2026-07-30', statut: 'En retard',  fournisseur: 'SONAR Burkina',        reference: 'DEP-2607-013', notes: 'Renouvellement en cours' },
  { id: 14, description: 'Achat stock — approvisionnement',   categorie: 'Stock',       montant: 385000, date: '2026-08-02', statut: 'En attente', fournisseur: 'Grossiste Zongo SARL', reference: 'DEP-2608-001' },
  { id: 15, description: 'IUTS employés — Juillet',           categorie: 'Fiscalité',   montant: 67000,  date: '2026-08-05', statut: 'Payée',      fournisseur: 'DGI Burkina',          reference: 'DEP-2608-002' },
]

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

  const filtered = useMemo(() => MOCK_DEPENSES.filter(d => {
    const okSearch = d.description.toLowerCase().includes(search.toLowerCase()) ||
                     d.fournisseur.toLowerCase().includes(search.toLowerCase()) ||
                     d.reference.toLowerCase().includes(search.toLowerCase())
    const okCat    = filtreCat === 'Toutes' || d.categorie === filtreCat
    const okStatut = filtreStatut === 'Tous' || d.statut === filtreStatut
    return okSearch && okCat && okStatut
  }), [search, filtreCat, filtreStatut])

  const totalDepenses = MOCK_DEPENSES.reduce((s, d) => s + d.montant, 0)
  const totalEnRetard = MOCK_DEPENSES.filter(d => d.statut === 'En retard').reduce((s, d) => s + d.montant, 0)
  const totalAttente  = MOCK_DEPENSES.filter(d => d.statut === 'En attente').reduce((s, d) => s + d.montant, 0)
  const nbEnRetard    = MOCK_DEPENSES.filter(d => d.statut === 'En retard').length

  const chartData = CATEGORIES.map(cat => ({
    name: cat,
    montant: MOCK_DEPENSES.filter(d => d.categorie === cat).reduce((s, d) => s + d.montant, 0),
    color: CAT_COLORS[cat],
  })).filter(d => d.montant > 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            Suivi et analyse de vos charges — Juillet–Août 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:opacity-80"
            style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
            <Download className="w-4 h-4" /> Exporter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
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
          { label: 'Total dépenses',     value: fmt(totalDepenses), sub: '15 transactions',  accent: false },
          { label: 'En retard',          value: fmt(totalEnRetard), sub: `${nbEnRetard} à régulariser`, accent: true },
          { label: 'En attente',         value: fmt(totalAttente),  sub: `${MOCK_DEPENSES.filter(d => d.statut === 'En attente').length} à régler`, accent: false },
          { label: 'Moy. / transaction', value: fmt(Math.round(totalDepenses / MOCK_DEPENSES.length)), sub: 'sur 15 transactions', accent: false },
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
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <table className="w-full">
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
                  Aucune dépense trouvée
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
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                Modifier
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                Marquer payée
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
