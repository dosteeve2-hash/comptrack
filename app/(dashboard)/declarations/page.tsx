'use client'

// app/(dashboard)/declarations/page.tsx
import { useState, useMemo } from 'react'
import {
  FileCheck2, Clock, AlertTriangle, TrendingDown,
  X, ChevronDown, Search, Calendar, Building2,
  CheckCircle2, AlertCircle, RotateCcw, Download,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatMontant, formatDate } from '@/lib/utils'

/* ─── Types ─────────────────────────────────────────────────────── */
type TypeDeclaration   = 'TVA' | 'IFU' | 'DSU' | 'IUTS' | 'CNSS' | 'IS'
type StatutDeclaration = 'Déposée' | 'En cours' | 'À déposer' | 'En retard' | 'Suspendue'
type Periodicite       = 'Mensuelle' | 'Trimestrielle' | 'Annuelle'
type Organisme         = 'DGI' | 'CNSS' | 'INSD' | 'CGA'

interface Declaration {
  id:           string
  type:         TypeDeclaration
  titre:        string
  periodicite:  Periodicite
  statut:       StatutDeclaration
  periode:      string
  dateLimite:   string
  dateDepot:    string | null
  montantDu:    number
  montantPaye:  number
  reference:    string | null
  organisme:    Organisme
  notes:        string
}

/* ─── Mock data ──────────────────────────────────────────────────── */
const DECLARATIONS: Declaration[] = [
  {
    id: 'd1', type: 'TVA', titre: 'TVA — Juillet 2026',
    periodicite: 'Mensuelle', statut: 'À déposer',
    periode: 'Juillet 2026', dateLimite: '2026-08-15', dateDepot: null,
    montantDu: 1_250_000, montantPaye: 0,
    reference: null, organisme: 'DGI',
    notes: 'TVA collectée 1 500 000 FCFA — TVA déductible 250 000 FCFA',
  },
  {
    id: 'd2', type: 'TVA', titre: 'TVA — Juin 2026',
    periodicite: 'Mensuelle', statut: 'Déposée',
    periode: 'Juin 2026', dateLimite: '2026-07-15', dateDepot: '2026-07-12',
    montantDu: 980_000, montantPaye: 980_000,
    reference: 'DGI-TVA-2026-06-4471', organisme: 'DGI',
    notes: 'Déposée en ligne sur DGI-BF portail',
  },
  {
    id: 'd3', type: 'TVA', titre: 'TVA — Mai 2026',
    periodicite: 'Mensuelle', statut: 'Déposée',
    periode: 'Mai 2026', dateLimite: '2026-06-15', dateDepot: '2026-06-10',
    montantDu: 1_100_000, montantPaye: 1_100_000,
    reference: 'DGI-TVA-2026-05-3882', organisme: 'DGI',
    notes: '',
  },
  {
    id: 'd4', type: 'IUTS', titre: 'IUTS — Juillet 2026',
    periodicite: 'Mensuelle', statut: 'À déposer',
    periode: 'Juillet 2026', dateLimite: '2026-08-20', dateDepot: null,
    montantDu: 420_000, montantPaye: 0,
    reference: null, organisme: 'DGI',
    notes: 'Calculé sur 6 salariés — masse salariale brute 3 800 000 FCFA',
  },
  {
    id: 'd5', type: 'IUTS', titre: 'IUTS — Juin 2026',
    periodicite: 'Mensuelle', statut: 'Déposée',
    periode: 'Juin 2026', dateLimite: '2026-07-20', dateDepot: '2026-07-18',
    montantDu: 395_000, montantPaye: 395_000,
    reference: 'DGI-IUTS-2026-06-2210', organisme: 'DGI',
    notes: '',
  },
  {
    id: 'd6', type: 'CNSS', titre: 'CNSS — Juillet 2026',
    periodicite: 'Mensuelle', statut: 'En cours',
    periode: 'Juillet 2026', dateLimite: '2026-08-25', dateDepot: null,
    montantDu: 760_000, montantPaye: 0,
    reference: null, organisme: 'CNSS',
    notes: 'Part patronale + part salariale — 6 employés déclarés',
  },
  {
    id: 'd7', type: 'CNSS', titre: 'CNSS — Juin 2026',
    periodicite: 'Mensuelle', statut: 'Déposée',
    periode: 'Juin 2026', dateLimite: '2026-07-25', dateDepot: '2026-07-22',
    montantDu: 718_000, montantPaye: 718_000,
    reference: 'CNSS-2026-06-0095', organisme: 'CNSS',
    notes: '',
  },
  {
    id: 'd8', type: 'TVA', titre: 'TVA — Avril 2026',
    periodicite: 'Mensuelle', statut: 'En retard',
    periode: 'Avril 2026', dateLimite: '2026-05-15', dateDepot: null,
    montantDu: 875_000, montantPaye: 0,
    reference: null, organisme: 'DGI',
    notes: 'URGENT — dépassement délai, pénalités en cours de calcul',
  },
  {
    id: 'd9', type: 'DSU', titre: 'DSU — Exercice 2025',
    periodicite: 'Annuelle', statut: 'Déposée',
    periode: 'Exercice 2025', dateLimite: '2026-04-30', dateDepot: '2026-04-25',
    montantDu: 0, montantPaye: 0,
    reference: 'INSD-DSU-2025-BF-00831', organisme: 'INSD',
    notes: 'Déclaration Statistique et Fiscale Unique déposée avant délai',
  },
  {
    id: 'd10', type: 'IFU', titre: 'Renouvellement IFU 2026',
    periodicite: 'Annuelle', statut: 'Déposée',
    periode: '2026', dateLimite: '2026-03-31', dateDepot: '2026-03-15',
    montantDu: 25_000, montantPaye: 25_000,
    reference: 'IFU-BF-2026-04412', organisme: 'DGI',
    notes: 'IFU renouvelé — valide jusqu\'au 31 décembre 2026',
  },
  {
    id: 'd11', type: 'IS', titre: 'IS — Exercice 2025',
    periodicite: 'Annuelle', statut: 'Déposée',
    periode: 'Exercice 2025', dateLimite: '2026-05-31', dateDepot: '2026-05-28',
    montantDu: 3_200_000, montantPaye: 3_200_000,
    reference: 'DGI-IS-2025-00974', organisme: 'DGI',
    notes: 'Impôt sur les Sociétés — BIC net imposable 12 800 000 FCFA — taux 25%',
  },
  {
    id: 'd12', type: 'IS', titre: 'Acompte IS — Q3 2026',
    periodicite: 'Trimestrielle', statut: 'À déposer',
    periode: 'T3 2026', dateLimite: '2026-09-15', dateDepot: null,
    montantDu: 800_000, montantPaye: 0,
    reference: null, organisme: 'DGI',
    notes: 'Acompte provisionnel 1/4 de IS annuel estimé',
  },
]

/* ─── Constants ──────────────────────────────────────────────────── */
const STATUT_CONFIG: Record<StatutDeclaration, { color: string; bg: string; icon: React.ElementType }> = {
  'Déposée':   { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: CheckCircle2  },
  'En cours':  { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: RotateCcw     },
  'À déposer': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: Clock         },
  'En retard': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertCircle   },
  'Suspendue': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  icon: AlertTriangle },
}

const TYPE_COLORS: Record<TypeDeclaration, string> = {
  TVA:  '#00D4FF',
  IFU:  '#D4AF37',
  DSU:  '#a855f7',
  IUTS: '#f97316',
  CNSS: '#22c55e',
  IS:   '#ef4444',
}

const ORGANISME_LABEL: Record<Organisme, string> = {
  DGI:  'Direction Générale des Impôts',
  CNSS: 'Caisse Nationale de Sécurité Sociale',
  INSD: 'Institut National de la Statistique et de la Démographie',
  CGA:  'Centre de Gestion Agréé',
}

/* ─── Sub-components ─────────────────────────────────────────────── */
function StatutBadge({ statut }: { statut: StatutDeclaration }) {
  const cfg = STATUT_CONFIG[statut]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      <Icon className="w-3 h-3" />
      {statut}
    </span>
  )
}

function KpiCard({ label, value, sub, color, icon: Icon }:
  { label: string; value: string; sub: string; color: string; icon: React.ElementType }) {
  return (
    <div className="p-4 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text2)' }}>{label}</p>
        <span className="p-2 rounded-xl" style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </span>
      </div>
      <p className="text-xl font-bold font-mono" style={{ color }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{sub}</p>
    </div>
  )
}

/* ─── Modal ──────────────────────────────────────────────────────── */
function ModalDeclaration({ decl, onClose }: { decl: Declaration; onClose: () => void }) {
  const cfg     = STATUT_CONFIG[decl.statut]
  const retard  = !decl.dateDepot && new Date(decl.dateLimite) < new Date()
  const avance  = decl.montantDu - decl.montantPaye

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'var(--border)' }}>
          <div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-1"
              style={{ background: `${TYPE_COLORS[decl.type]}20`, color: TYPE_COLORS[decl.type] }}>
              {decl.type}
            </span>
            <h3 className="font-bold text-lg">{decl.titre}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{decl.periodicite} · {decl.periode}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:opacity-70"
            style={{ color: 'var(--text2)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          {/* Statut + organisme */}
          <div className="flex items-center justify-between">
            <StatutBadge statut={decl.statut} />
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
              <Building2 className="w-3 h-3 inline mr-1" />
              {decl.organisme}
            </span>
          </div>

          {/* Organisme full */}
          <p className="text-xs" style={{ color: 'var(--text3)' }}>{ORGANISME_LABEL[decl.organisme]}</p>

          {/* Alert retard */}
          {retard && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Délai dépassé — des pénalités peuvent être appliquées par la DGI.</span>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date limite', value: formatDate(decl.dateLimite), color: retard ? '#ef4444' : 'var(--text)' },
              { label: 'Date dépôt',  value: decl.dateDepot ? formatDate(decl.dateDepot) : '—', color: 'var(--text)' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text3)' }}>{item.label}</p>
                <p className="text-sm font-semibold font-mono" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Montants */}
          {decl.montantDu > 0 && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { l: 'Montant dû',    v: formatMontant(decl.montantDu),   c: 'var(--text)'   },
                    { l: 'Montant payé',  v: formatMontant(decl.montantPaye), c: '#22c55e'       },
                    { l: 'Solde restant', v: formatMontant(avance),           c: avance > 0 ? '#ef4444' : '#22c55e' },
                  ].map(row => (
                    <tr key={row.l} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text2)' }}>{row.l}</td>
                      <td className="px-4 py-2.5 text-right font-bold font-mono" style={{ color: row.c }}>{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Référence */}
          {decl.reference && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <FileCheck2 className="w-4 h-4 flex-shrink-0" style={{ color: '#00D4FF' }} />
              <span style={{ color: 'var(--text2)' }}>Réf : </span>
              <code className="font-mono font-semibold" style={{ color: '#00D4FF' }}>{decl.reference}</code>
            </div>
          )}

          {/* Notes */}
          {decl.notes && (
            <p className="text-xs px-1" style={{ color: 'var(--text2)' }}>{decl.notes}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {decl.statut === 'À déposer' || decl.statut === 'En retard' ? (
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: '#000' }}>
                <FileCheck2 className="w-4 h-4" />
                Marquer comme déposée
              </button>
            ) : null}
            {decl.reference && (
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border hover:opacity-70"
                style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
                <Download className="w-4 h-4" />
                Reçu
              </button>
            )}
            <button onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function DeclarationsPage() {
  const [selected,   setSelected]   = useState<Declaration | null>(null)
  const [filterType, setFilterType] = useState<'all' | TypeDeclaration>('all')
  const [filterStat, setFilterStat] = useState<'all' | StatutDeclaration>('all')
  const [search,     setSearch]     = useState('')

  const filtered = useMemo(() =>
    DECLARATIONS.filter(d => {
      if (filterType !== 'all' && d.type !== filterType) return false
      if (filterStat !== 'all' && d.statut !== filterStat) return false
      if (search) {
        const q = search.toLowerCase()
        return d.titre.toLowerCase().includes(q) || d.periode.toLowerCase().includes(q) || (d.reference ?? '').toLowerCase().includes(q)
      }
      return true
    }),
  [filterType, filterStat, search])

  /* KPIs */
  const deposees  = DECLARATIONS.filter(d => d.statut === 'Déposée').length
  const aDeposer  = DECLARATIONS.filter(d => d.statut === 'À déposer').length
  const enRetard  = DECLARATIONS.filter(d => d.statut === 'En retard').length
  const totalPaye = DECLARATIONS.filter(d => d.montantPaye > 0).reduce((s, d) => s + d.montantPaye, 0)

  /* Chart: montant payé par type */
  const chartData = (Object.keys(TYPE_COLORS) as TypeDeclaration[])
    .map(t => ({
      type: t,
      montant: DECLARATIONS.filter(d => d.type === t).reduce((s, d) => s + d.montantPaye, 0),
    }))
    .filter(d => d.montant > 0)

  const types:   Array<'all' | TypeDeclaration>   = ['all', 'TVA', 'IUTS', 'CNSS', 'IS', 'IFU', 'DSU']
  const statuts: Array<'all' | StatutDeclaration> = ['all', 'À déposer', 'En cours', 'En retard', 'Déposée', 'Suspendue']

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Déclarations fiscales</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {filtered.length} déclaration{filtered.length !== 1 ? 's' : ''} · BF 2026
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
          style={{ background: 'var(--gold)', color: '#000' }}>
          <Calendar className="w-4 h-4" />
          Calendrier fiscal
        </button>
      </div>

      {/* Alert retard */}
      {enRetard > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <div>
            <p className="font-semibold" style={{ color: '#ef4444' }}>
              {enRetard} déclaration{enRetard > 1 ? 's' : ''} en retard
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
              Des pénalités peuvent être appliquées. Régularisez auprès de la DGI dès que possible.
            </p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Déposées" value={`${deposees}`}
          sub={`sur ${DECLARATIONS.length} déclarations`}
          color="#22c55e" icon={FileCheck2} />
        <KpiCard label="À déposer" value={`${aDeposer}`}
          sub="prochaines échéances"
          color="#f59e0b" icon={Clock} />
        <KpiCard label="En retard" value={`${enRetard}`}
          sub="à régulariser urgemment"
          color="#ef4444" icon={AlertTriangle} />
        <KpiCard label="Impôts payés" value={new Intl.NumberFormat('fr-FR').format(totalPaye) + ' F'}
          sub="total exercice 2025–2026"
          color="#00D4FF" icon={TrendingDown} />
      </div>

      {/* Chart */}
      <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold mb-1">Impôts versés par type</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text2)' }}>Montants effectivement payés (FCFA)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={36}>
            <XAxis dataKey="type" tick={{ fontSize: 11, fill: 'var(--text2)' as string }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' as string }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [new Intl.NumberFormat('fr-FR').format(v) + ' FCFA', 'Payé']}
            />
            <Bar dataKey="montant" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.type} fill={TYPE_COLORS[entry.type as TypeDeclaration]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher déclaration, période, référence…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </div>

        {/* Type filter */}
        <div className="relative">
          <select value={filterType} onChange={e => setFilterType(e.target.value as 'all' | TypeDeclaration)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            {types.map(t => <option key={t} value={t}>{t === 'all' ? 'Tous types' : t}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--text3)' }} />
        </div>

        {/* Statut filter */}
        <div className="relative">
          <select value={filterStat} onChange={e => setFilterStat(e.target.value as 'all' | StatutDeclaration)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            {statuts.map(s => <option key={s} value={s}>{s === 'all' ? 'Tous statuts' : s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--text3)' }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-medium uppercase tracking-wider"
                style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
                {['Type', 'Déclaration', 'Période', 'Organisme', 'Date limite', 'Montant dû', 'Statut', ''].map((h, i) => (
                  <th key={h + i} className={`py-3 ${i === 0 ? 'text-left px-5' : i === 5 ? 'text-right px-4' : i === 7 ? 'text-center px-5' : 'text-left px-4'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm" style={{ color: 'var(--text3)' }}>
                    Aucune déclaration trouvée
                  </td>
                </tr>
              ) : filtered.map(d => {
                const retard = !d.dateDepot && new Date(d.dateLimite) < new Date()
                return (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelected(d)}>
                    <td className="px-5 py-4">
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ background: `${TYPE_COLORS[d.type]}20`, color: TYPE_COLORS[d.type] }}>
                        {d.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-sm">{d.titre}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{d.periodicite}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono" style={{ color: 'var(--text2)' }}>{d.periode}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>
                        {d.organisme}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono" style={{ color: retard ? '#ef4444' : 'var(--text2)' }}>
                      {formatDate(d.dateLimite)}
                      {retard && <span className="ml-1 text-[10px] font-bold">⚠</span>}
                    </td>
                    <td className="px-4 py-4 text-right font-bold font-mono text-sm">
                      {d.montantDu > 0 ? formatMontant(d.montantDu) : <span style={{ color: 'var(--text3)' }}>—</span>}
                    </td>
                    <td className="px-4 py-4"><StatutBadge statut={d.statut} /></td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={e => { e.stopPropagation(); setSelected(d) }}
                        className="text-xs px-2.5 py-1.5 rounded-lg border hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--text2)', borderColor: 'var(--border)' }}>
                        Détail
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Légende types */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(TYPE_COLORS) as [TypeDeclaration, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text2)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="font-medium" style={{ color }}>{type}</span>
            <span style={{ color: 'var(--text3)' }}>·</span>
            <span>
              {type === 'TVA' && 'Taxe sur la Valeur Ajoutée'}
              {type === 'IUTS' && 'Impôt sur Traitements et Salaires'}
              {type === 'CNSS' && 'Sécurité Sociale'}
              {type === 'IS' && 'Impôt sur les Sociétés'}
              {type === 'IFU' && 'Identifiant Financier Unique'}
              {type === 'DSU' && 'Déclaration Statistique Unique'}
            </span>
          </div>
        ))}
      </div>

      {selected && <ModalDeclaration decl={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
