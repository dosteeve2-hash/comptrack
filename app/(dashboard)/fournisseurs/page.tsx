'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { LucideIcon } from 'lucide-react'
import { Truck, Plus, Search, X, ChevronDown, AlertTriangle, CheckCircle, Clock, Star, Globe, Phone, Mail, ExternalLink } from 'lucide-react'

type Statut    = 'A jour' | 'En retard' | 'Solde' | 'Suspendu'
type Categorie = 'Matieres premieres' | 'Energie' | 'Services' | 'Equipement' | 'Logistique' | 'Technologie'

const STATUT_LABELS: Record<Statut, string> = {
  'A jour': 'A jour', 'En retard': 'En retard', 'Solde': 'Solde', 'Suspendu': 'Suspendu',
}
const CAT_LABELS: Record<Categorie, string> = {
  'Matieres premieres': 'Mat. premieres', 'Energie': 'Energie', 'Services': 'Services',
  'Equipement': 'Equipement', 'Logistique': 'Logistique', 'Technologie': 'Technologie',
}

interface Fournisseur {
  id: number; nom: string; categorie: Categorie; pays: string; ville: string
  contact: string; email: string; telephone: string; encours: number
  totalAchats: number; nbCommandes: number; statut: Statut; note: number; derniereCommande: string
}

const MOCK: Fournisseur[] = [
  { id: 1,  nom: 'Grossiste Zongo SARL',  categorie: 'Matieres premieres', pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Issa Zongo',      email: 'zongo@grossiste.bf',   telephone: '+226 25 30 11 22', encours: 520000,  totalAchats: 3200000, nbCommandes: 28, statut: 'A jour',    note: 5, derniereCommande: '2026-08-02' },
  { id: 2,  nom: 'SONATUR Commerce',       categorie: 'Matieres premieres', pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Mme Ouedraogo',   email: 'commerce@sonatur.bf',  telephone: '+226 25 31 44 55', encours: 320000,  totalAchats: 2100000, nbCommandes: 19, statut: 'A jour',    note: 4, derniereCommande: '2026-07-28' },
  { id: 3,  nom: 'Total Energies BF',      categorie: 'Energie',            pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Direction BF',    email: 'bf@totalenergies.com', telephone: '+226 25 49 60 00', encours: 42000,   totalAchats: 890000,  nbCommandes: 45, statut: 'A jour',    note: 4, derniereCommande: '2026-07-28' },
  { id: 4,  nom: 'SONABEL',                categorie: 'Energie',            pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Service Client',  email: 'client@sonabel.bf',    telephone: '+226 25 30 60 00', encours: 35000,   totalAchats: 420000,  nbCommandes: 24, statut: 'A jour',    note: 3, derniereCommande: '2026-07-12' },
  { id: 5,  nom: 'ONATEL BF',              categorie: 'Technologie',        pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Service Pro',     email: 'pro@onatel.bf',        telephone: '+226 25 49 49 49', encours: 28000,   totalAchats: 336000,  nbCommandes: 12, statut: 'En retard', note: 3, derniereCommande: '2026-07-12' },
  { id: 6,  nom: 'TechPro Ouaga',          categorie: 'Technologie',        pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Seydou Kabore',   email: 'seydou@techpro.bf',    telephone: '+226 76 20 30 40', encours: 75000,   totalAchats: 650000,  nbCommandes: 9,  statut: 'A jour',    note: 5, derniereCommande: '2026-07-15' },
  { id: 7,  nom: 'Cabinet Sawadogo',       categorie: 'Services',           pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Me Sawadogo',     email: 'cabinet@sawadogo.bf',  telephone: '+226 25 33 44 55', encours: 120000,  totalAchats: 480000,  nbCommandes: 4,  statut: 'A jour',    note: 5, derniereCommande: '2026-07-18' },
  { id: 8,  nom: 'SONAR Burkina',          categorie: 'Services',           pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Direction Tech',  email: 'tech@sonar.bf',        telephone: '+226 25 30 22 11', encours: 55000,   totalAchats: 220000,  nbCommandes: 4,  statut: 'En retard', note: 2, derniereCommande: '2026-07-30' },
  { id: 9,  nom: 'CFAO Motors BF',         categorie: 'Equipement',         pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'P. Coulibaly',    email: 'bf@cfao.com',          telephone: '+226 25 36 78 90', encours: 0,       totalAchats: 1800000, nbCommandes: 7,  statut: 'Solde',     note: 4, derniereCommande: '2026-05-20' },
  { id: 10, nom: 'Bureau Plus BF',         categorie: 'Equipement',         pays: 'Burkina Faso', ville: 'Bobo-Dioulasso', contact: 'Ali Traore',      email: 'ali@bureauplus.bf',    telephone: '+226 20 97 11 22', encours: 18500,   totalAchats: 155000,  nbCommandes: 12, statut: 'A jour',    note: 3, derniereCommande: '2026-07-20' },
  { id: 11, nom: 'Institut FASEG',         categorie: 'Services',           pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'Dr Konate',       email: 'formation@faseg.bf',   telephone: '+226 25 30 70 64', encours: 95000,   totalAchats: 380000,  nbCommandes: 4,  statut: 'A jour',    note: 4, derniereCommande: '2026-07-22' },
  { id: 12, nom: 'SCI Patrimoniale BF',    categorie: 'Services',           pays: 'Burkina Faso', ville: 'Ouagadougou',    contact: 'M. Compaore',     email: 'sci@patrimoniale.bf',  telephone: '+226 25 35 88 99', encours: 250000,  totalAchats: 3000000, nbCommandes: 12, statut: 'A jour',    note: 4, derniereCommande: '2026-07-01' },
]

const CATS: Categorie[] = ['Matieres premieres', 'Energie', 'Services', 'Equipement', 'Logistique', 'Technologie']
const STATUTS: Statut[] = ['A jour', 'En retard', 'Solde', 'Suspendu']
const CAT_COLOR: Record<Categorie, string> = {
  'Matieres premieres': '#D4AF37', 'Energie': '#F97316', 'Services': '#818CF8',
  'Equipement': '#00D4FF', 'Logistique': '#34D399', 'Technologie': '#EC4899',
}

const fmt  = (n: number) => n.toLocaleString('fr-FR') + ' FCFA'
const fmtK = (n: number) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + ' M' : n >= 1_000 ? (n / 1_000).toFixed(0) + ' k' : String(n)

function StatutBadge({ s }: { s: Statut }) {
  const cfgMap = {
    'A jour':    { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle   },
    'En retard': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertTriangle },
    'Solde':     { color: '#64748b', bg: 'rgba(100,116,139,0.12)', icon: CheckCircle   },
    'Suspendu':  { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)',  icon: Clock         },
  }
  const cfg = cfgMap[s]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />{STATUT_LABELS[s]}
    </span>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3 h-3" fill={i < n ? '#D4AF37' : 'none'} style={{ color: '#D4AF37' }} />
      ))}
    </span>
  )
}

export default function FournisseursPage() {
  const [search,       setSearch]       = useState('')
  const [filtreCat,    setFiltreCat]    = useState<Categorie | 'Toutes'>('Toutes')
  const [filtreStatut, setFiltreStatut] = useState<Statut | 'Tous'>('Tous')
  const [selected,     setSelected]     = useState<Fournisseur | null>(null)

  const filtered = useMemo(() => MOCK.filter(f => {
    const ok1 = f.nom.toLowerCase().includes(search.toLowerCase()) || f.contact.toLowerCase().includes(search.toLowerCase())
    const ok2 = filtreCat === 'Toutes' || f.categorie === filtreCat
    const ok3 = filtreStatut === 'Tous' || f.statut === filtreStatut
    return ok1 && ok2 && ok3
  }), [search, filtreCat, filtreStatut])

  const totalEncours = MOCK.reduce((s, f) => s + f.encours, 0)
  const totalAchats  = MOCK.reduce((s, f) => s + f.totalAchats, 0)
  const nbEnRetard   = MOCK.filter(f => f.statut === 'En retard').length
  const nbAvecEncours = MOCK.filter(f => f.encours > 0).length

  const chartData = CATS.map(cat => ({
    name: CAT_LABELS[cat].split(' ')[0],
    encours: MOCK.filter(f => f.categorie === cat).reduce((s, f) => s + f.encours, 0),
    color: CAT_COLOR[cat],
  })).filter(d => d.encours > 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {MOCK.length} fournisseurs actifs — encours {fmt(totalEncours)}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
          <Plus className="w-4 h-4" /> Ajouter fournisseur
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total encours',        value: fmt(totalEncours),              sub: `${MOCK.length} fournisseurs`,  accent: false },
          { label: 'En retard',            value: `${nbEnRetard} fournisseur${nbEnRetard !== 1 ? 's' : ''}`, sub: 'paiements en souffrance', accent: nbEnRetard > 0 },
          { label: 'Volume achats cumule', value: fmtK(totalAchats) + ' FCFA',    sub: 'total cumule',                 accent: false },
          { label: 'Encours moyen',        value: fmt(Math.round(totalEncours / Math.max(nbAvecEncours, 1))), sub: 'par fournisseur actif', accent: false },
        ].map((k, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{
            background:  k.accent ? 'rgba(239,68,68,0.06)' : 'var(--bg2)',
            borderColor: k.accent ? 'rgba(239,68,68,0.25)' : 'var(--border)',
          }}>
            <p className="text-xs mb-2" style={{ color: k.accent ? '#ef4444' : 'var(--text2)' }}>{k.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: k.accent ? '#ef4444' : 'var(--text)' }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <h3 className="font-semibold mb-4">Encours par categorie</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: 'var(--text2)' }} axisLine={false} tickLine={false} width={55} />
            <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [fmt(v), 'Encours']} />
            <Bar dataKey="encours" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
          <select value={filtreCat} onChange={e => setFiltreCat(e.target.value as Categorie | 'Toutes')}
            className="pl-4 pr-8 py-2 rounded-xl text-sm appearance-none outline-none cursor-pointer"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <option value="Toutes">Toutes categories</option>
            {CATS.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text2)' }} />
        </div>
        <div className="relative">
          <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as Statut | 'Tous')}
            className="pl-4 pr-8 py-2 rounded-xl text-sm appearance-none outline-none cursor-pointer"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <option value="Tous">Tous statuts</option>
            {STATUTS.map(s => <option key={s} value={s}>{STATUT_LABELS[s]}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text2)' }} />
        </div>
        <p className="text-sm ml-auto" style={{ color: 'var(--text2)' }}>{filtered.length} resultat{filtered.length > 1 ? 's' : ''}</p>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Fournisseur', 'Categorie', 'Ville', 'Encours', 'Total achats', 'Note', 'Statut'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} onClick={() => setSelected(f)}
                className="hover:brightness-110 cursor-pointer transition-all"
                style={{ borderTop: '1px solid var(--border)' }}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${CAT_COLOR[f.categorie]}18` }}>
                      <Truck className="w-4 h-4" style={{ color: CAT_COLOR[f.categorie] }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{f.nom}</p>
                      <p className="text-xs" style={{ color: 'var(--text2)' }}>{f.contact}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${CAT_COLOR[f.categorie]}18`, color: CAT_COLOR[f.categorie] }}>
                    {CAT_LABELS[f.categorie]}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text2)' }}>
                  <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{f.ville}</span>
                </td>
                <td className="px-4 py-3.5 text-sm font-bold font-mono" style={{ color: f.encours > 0 ? '#ef4444' : 'var(--text2)' }}>
                  {f.encours > 0 ? `-${f.encours.toLocaleString('fr-FR')}` : '—'}
                </td>
                <td className="px-4 py-3.5 text-sm font-mono" style={{ color: 'var(--text2)' }}>{fmtK(f.totalAchats)}</td>
                <td className="px-4 py-3.5"><Stars n={f.note} /></td>
                <td className="px-4 py-3.5"><StatutBadge s={f.statut} /></td>
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
                <h3 className="font-bold text-lg">{selected.nom}</h3>
                <Stars n={selected.note} />
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:brightness-110"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                ['Categorie',   CAT_LABELS[selected.categorie]],
                ['Contact',     selected.contact],
                ['Ville',       `${selected.ville}, ${selected.pays}`],
                ['Encours',     selected.encours > 0 ? fmt(selected.encours) : 'Solde'],
                ['Total achats', fmt(selected.totalAchats)],
                ['Commandes',   String(selected.nbCommandes)],
                ['Derniere cmd', selected.derniereCommande],
              ].map(([label, val], i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg2)' : 'transparent' }}>
                  <span className="text-xs" style={{ color: 'var(--text2)' }}>{label}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <a href={`tel:${selected.telephone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                <Phone className="w-4 h-4" /> Appeler
              </a>
              <a href={`mailto:${selected.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                <Mail className="w-4 h-4" /> Email
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                <ExternalLink className="w-4 h-4" /> Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
