'use client'

// app/(dashboard)/declarations/page.tsx
import { useState, useMemo } from 'react'
import { usePersistedList } from '@/lib/store'
import {
  FileCheck2, Clock, AlertTriangle, TrendingDown,
  X, ChevronDown, Search, Building2,
  CheckCircle2, AlertCircle, RotateCcw, Plus,
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

/* ─── Stockage local ─────────────────────────────────────────────── */
const STORAGE_KEY = 'comptrack_declarations'

const ORGANISME_PAR_TYPE: Record<TypeDeclaration, Organisme> = {
  TVA: 'DGI', IFU: 'DGI', IUTS: 'DGI', IS: 'DGI', CNSS: 'CNSS', DSU: 'INSD',
}

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
function ModalDeclaration({ decl, onClose, onDeposer }: { decl: Declaration; onClose: () => void; onDeposer: () => void }) {
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
          <button onClick={onClose} className="p-2 min-w-10 min-h-9 inline-flex items-center justify-center rounded-xl hover:opacity-70"
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
              <button onClick={onDeposer} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: '#000' }}>
                <FileCheck2 className="w-4 h-4" />
                Marquer comme déposée
              </button>
            ) : null}
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
  const [declarations, setDeclarations] = usePersistedList<Declaration>(STORAGE_KEY)
  const [modalOpen, setModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    type: 'TVA' as TypeDeclaration, titre: '', periodicite: 'Mensuelle' as Periodicite,
    periode: '', dateLimite: '', montantDu: '', reference: '', notes: '',
  })

  const openModal = () => {
    setForm({ type: 'TVA', titre: '', periodicite: 'Mensuelle', periode: '', dateLimite: '', montantDu: '', reference: '', notes: '' })
    setFormError('')
    setModalOpen(true)
  }

  const handleAdd = (ev: React.FormEvent) => {
    ev.preventDefault()
    const montantDu = form.montantDu.trim() === '' ? 0 : Number(form.montantDu)
    if (!form.titre.trim() || !form.dateLimite || isNaN(montantDu) || montantDu < 0) {
      setFormError('Indiquez un intitulé, une date limite et un montant valide (ou laissez vide).')
      return
    }
    const retard = new Date(form.dateLimite) < new Date()
    setDeclarations(prev => [{
      id: `decl_${Date.now()}`, type: form.type, titre: form.titre.trim(), periodicite: form.periodicite,
      statut: retard ? 'En retard' : 'À déposer', periode: form.periode.trim() || '—',
      dateLimite: form.dateLimite, dateDepot: null, montantDu, montantPaye: 0,
      reference: form.reference.trim() || null, organisme: ORGANISME_PAR_TYPE[form.type],
      notes: form.notes.trim(),
    }, ...prev])
    setModalOpen(false)
  }

  const deposer = (id: string) => {
    const aujourdhui = new Date().toISOString().split('T')[0]
    setDeclarations(prev => prev.map(d => (d.id === id
      ? { ...d, statut: 'Déposée' as StatutDeclaration, dateDepot: aujourdhui, montantPaye: d.montantDu }
      : d)))
    setSelected(null)
  }

  const filtered = useMemo(() =>
    declarations.filter(d => {
      if (filterType !== 'all' && d.type !== filterType) return false
      if (filterStat !== 'all' && d.statut !== filterStat) return false
      if (search) {
        const q = search.toLowerCase()
        return d.titre.toLowerCase().includes(q) || d.periode.toLowerCase().includes(q) || (d.reference ?? '').toLowerCase().includes(q)
      }
      return true
    }),
  [declarations, filterType, filterStat, search])

  /* KPIs */
  const deposees  = declarations.filter(d => d.statut === 'Déposée').length
  const aDeposer  = declarations.filter(d => d.statut === 'À déposer').length
  const enRetard  = declarations.filter(d => d.statut === 'En retard').length
  const totalPaye = declarations.filter(d => d.montantPaye > 0).reduce((s, d) => s + d.montantPaye, 0)

  /* Chart: montant payé par type */
  const chartData = (Object.keys(TYPE_COLORS) as TypeDeclaration[])
    .map(t => ({
      type: t,
      montant: declarations.filter(d => d.type === t).reduce((s, d) => s + d.montantPaye, 0),
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
            {filtered.length} déclaration{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
          style={{ background: 'var(--gold)', color: '#000' }}>
          <Plus className="w-4 h-4" />
          Nouvelle déclaration
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
          sub={`sur ${declarations.length} déclarations`}
          color="#22c55e" icon={FileCheck2} />
        <KpiCard label="À déposer" value={`${aDeposer}`}
          sub="prochaines échéances"
          color="#f59e0b" icon={Clock} />
        <KpiCard label="En retard" value={`${enRetard}`}
          sub="à régulariser urgemment"
          color="#ef4444" icon={AlertTriangle} />
        <KpiCard label="Impôts payés" value={new Intl.NumberFormat('fr-FR').format(totalPaye) + ' F'}
          sub="total des paiements enregistrés"
          color="#00D4FF" icon={TrendingDown} />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
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
      )}

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
                    {declarations.length === 0 ? (
                      <div className="flex flex-col items-center gap-3">
                        <span>Aucune déclaration enregistrée pour le moment.</span>
                        <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
                          style={{ background: 'var(--gold)', color: '#000' }}>
                          <Plus className="w-4 h-4" /> Ajouter une déclaration
                        </button>
                      </div>
                    ) : 'Aucune déclaration ne correspond aux filtres'}
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

      {selected && <ModalDeclaration decl={selected} onClose={() => setSelected(null)} onDeposer={() => deposer(selected.id)} />}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <form onSubmit={handleAdd} className="w-full max-w-md rounded-2xl border p-6 space-y-3 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Nouvelle déclaration</h3>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fermer"
                className="p-2 rounded-xl" style={{ color: 'var(--text2)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TypeDeclaration }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {(Object.keys(TYPE_COLORS) as TypeDeclaration[]).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Périodicité</label>
                <select value={form.periodicite} onChange={e => setForm(p => ({ ...p, periodicite: e.target.value as Periodicite }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {(['Mensuelle', 'Trimestrielle', 'Annuelle'] as Periodicite[]).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {[
              { label: 'Intitulé *', key: 'titre', type: 'text', placeholder: 'Ex. déclaration du mois' },
              { label: 'Période concernée', key: 'periode', type: 'text', placeholder: 'Mois, trimestre ou exercice' },
              { label: 'Date limite *', key: 'dateLimite', type: 'date', placeholder: '' },
              { label: 'Montant dû (FCFA)', key: 'montantDu', type: 'number', placeholder: 'Laisser vide si aucun montant' },
              { label: 'Référence de dépôt', key: 'reference', type: 'text', placeholder: 'Numéro de reçu (facultatif)' },
              { label: 'Notes', key: 'notes', type: 'text', placeholder: 'Facultatif' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key as 'titre' | 'periode' | 'dateLimite' | 'montantDu' | 'reference' | 'notes']}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>
            ))}
            {formError && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{formError}</p>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 min-h-10 rounded-xl text-sm font-medium border"
                style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>Annuler</button>
              <button type="submit" className="flex-1 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
                style={{ background: 'var(--gold)', color: '#000' }}>Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
