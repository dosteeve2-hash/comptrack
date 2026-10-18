'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePersistedList } from '@/lib/store'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { toast, Toaster } from 'sonner'
import {
  Banknote, Users, TrendingUp, CheckCircle, Clock, X, Download, Eye,
} from 'lucide-react'
import { formatMontant } from '@/lib/utils'

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  navy:'#0A1628', gold:'#D4AF37', cyan:'#00D4FF', bg2:'#0c1a34', bg3:'#111d34',
  border:'rgba(255,255,255,0.08)', text:'#EBF4FF', text2:'#8BABC9', text3:'#4E6F8E',
  green:'#22c55e', red:'#ef4444', amber:'#f59e0b', purple:'#a78bfa',
}

// ─── Types ───────────────────────────────────────────────────────────────────
type StatutPaie = 'Payé' | 'En attente' | 'Bloqué'

interface LignePaie {
  id: number
  nom: string
  poste: string
  dept: string
  salaireBrut: number
  cnssEmploye: number   // 5.5% brut
  iuts: number          // Impot Unique sur les Traitements et Salaires BF
  netAPayer: number
  cnssPatronal: number  // 16% brut
  anciennete: number    // annees
  statut: StatutPaie
}

// ─── Calculs BF ──────────────────────────────────────────────────────────────
function calculerIUTS(brut: number): number {
  // Barème IUTS simplifié Burkina Faso (mensuel)
  const imposable = brut * 0.8 // abattement 20%
  if (imposable <= 15_000) return 0
  if (imposable <= 30_000) return (imposable - 15_000) * 0.02
  if (imposable <= 50_000) return 300 + (imposable - 30_000) * 0.05
  if (imposable <= 80_000) return 1_300 + (imposable - 50_000) * 0.115
  if (imposable <= 120_000) return 4_750 + (imposable - 80_000) * 0.165
  if (imposable <= 200_000) return 11_350 + (imposable - 120_000) * 0.22
  return 28_950 + (imposable - 200_000) * 0.275
}

function buildLigne(
  id: number, nom: string, poste: string, dept: string,
  salaireBrut: number, anciennete: number, statut: StatutPaie,
): LignePaie {
  const cnssEmploye  = Math.round(salaireBrut * 0.055)
  const cnssPatronal = Math.round(salaireBrut * 0.16)
  const iuts         = Math.round(calculerIUTS(salaireBrut))
  const netAPayer    = salaireBrut - cnssEmploye - iuts
  return { id, nom, poste, dept, salaireBrut, cnssEmploye, iuts, netAPayer, cnssPatronal, anciennete, statut }
}

// ─── Source : la liste des employés (page Employés) ──────────────────────────
interface EmployeStocke {
  id: number; nom: string; poste: string; dept: string; salaire: number; dateEntree: string
}

const EMPLOYES_KEY = 'comptrack_employes'
const PAIE_KEY = 'comptrack_paie_payes'

interface PaiePayee { cle: string }

function anciennete(dateEntree: string): number {
  const d = new Date(dateEntree)
  if (isNaN(d.getTime())) return 0
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / (365.25 * 86400000)))
}

function moisOptions(): string[] {
  const annee = new Date().getFullYear()
  const fmt = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
  return Array.from({ length: 12 }, (_, i) => {
    const t = fmt.format(new Date(annee, i, 1))
    return t.charAt(0).toUpperCase() + t.slice(1)
  })
}

const DEPT_COLORS: Record<string, string> = {
  Direction: C.gold, Finance: C.cyan, Commercial: C.green,
  IT: C.purple, RH: C.amber, Marketing: '#f97316',
}

// ─── Composants ──────────────────────────────────────────────────────────────
function StatutBadge({ s }: { s: StatutPaie }) {
  const color = s === 'Payé' ? C.green : s === 'En attente' ? C.amber : C.red
  const icon  = s === 'Payé' ? <CheckCircle size={11} /> : s === 'En attente' ? <Clock size={11} /> : <X size={11} />
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5,
      background:`${color}20`, color, borderRadius:6, padding:'3px 10px',
      fontSize:11, fontWeight:700, whiteSpace:'nowrap' as const }}>
      {icon}{s}
    </span>
  )
}

function KpiCard({ label, value, sub, color, icon: Icon }:
  { label:string; value:string; sub?:string; color:string; icon: React.ComponentType<{size?:number;color?:string}> }) {
  return (
    <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 22px',
      display:'flex', flexDirection:'column' as const, gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, color:C.text2 }}>{label}</span>
        <div style={{ background:`${color}18`, borderRadius:8, padding:8, display:'flex' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div style={{ fontSize:26, fontWeight:700, color:C.text, fontFamily:'monospace' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.text3 }}>{sub}</div>}
    </div>
  )
}

function ModalBulletin({ ligne, mois, onClose, onTogglePaye }:
  { ligne: LignePaie; mois: string; onClose: () => void; onTogglePaye: () => void }) {
  const rows: [string, string, string][] = [
    // [libellé, base/taux, montant]
    ['Salaire de base',            '',       formatMontant(ligne.salaireBrut)],
    ['',                           '',       ''],
    ['CNSS salarié (5,5%)',        '5,5 %',  `- ${formatMontant(ligne.cnssEmploye)}`],
    ['IUTS (barème progressif)',   'BF',     `- ${formatMontant(ligne.iuts)}`],
    ['Net à payer',                '',       formatMontant(ligne.netAPayer)],
    ['',                           '',       ''],
    ['Cotisation patronale CNSS',  '16 %',   formatMontant(ligne.cnssPatronal)],
    ['Coût total employeur',       '',       formatMontant(ligne.salaireBrut + ligne.cnssPatronal)],
  ]

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{ position:'relative', background:C.bg2, border:`1px solid ${C.border}`,
        borderRadius:18, padding:28, width:'100%', maxWidth:520, maxHeight:'90vh',
        overflowY:'auto' as const, margin:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{ligne.nom}</div>
            <div style={{ fontSize:12, color:C.text2, marginTop:2 }}>{ligne.poste} · {ligne.dept}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:C.text3, cursor:'pointer', padding:4 }}>
            <X size={18} />
          </button>
        </div>

        {/* En-tête bulletin */}
        <div style={{ background:C.bg3, borderRadius:12, padding:'14px 18px', marginBottom:16,
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            ['Période', mois],
            ['N° matricule', `EMP-${String(ligne.id).padStart(4,'0')}`],
            ['Ancienneté', `${ligne.anciennete} an${ligne.anciennete > 1 ? 's' : ''}`],
            ['Statut', <StatutBadge key="s" s={ligne.statut} />],
          ].map(([k, v], i) => (
            <div key={i}>
              <div style={{ fontSize:10, color:C.text3, textTransform:'uppercase' as const, letterSpacing:'0.05em', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:12, color:C.text, fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Tableau cotisations */}
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Libellé', 'Taux', 'Montant'].map(h => (
                <th key={h} style={{ padding:'7px 12px', fontSize:10, color:C.text3,
                  borderBottom:`1px solid ${C.border}`, textAlign:'left', background:C.bg3 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([lib, taux, montant], i) => {
              if (!lib) return <tr key={i}><td colSpan={3} style={{ height:6 }} /></tr>
              const isNet    = lib === 'Net à payer'
              const isTotal  = lib === 'Coût total employeur'
              const isMinus  = montant.startsWith('-')
              return (
                <tr key={i} style={{ background: isNet ? `${C.gold}10` : 'transparent' }}>
                  <td style={{ padding:'9px 12px', fontSize:13, color: isNet || isTotal ? C.text : C.text2,
                    fontWeight: isNet || isTotal ? 700 : 400, borderBottom:`1px solid ${C.border}` }}>{lib}</td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:C.text3, borderBottom:`1px solid ${C.border}` }}>{taux}</td>
                  <td style={{ padding:'9px 12px', fontFamily:'monospace', fontWeight:isNet || isTotal ? 700 : 500,
                    fontSize: isNet ? 15 : 13,
                    color: isNet ? C.gold : isTotal ? C.cyan : isMinus ? C.red : C.text,
                    borderBottom:`1px solid ${C.border}` }}>{montant}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:20, gap:10 }}>
          <button onClick={() => toast.success('Export PDF du bulletin — bientot disponible')}
            style={{ display:'flex', alignItems:'center', gap:6, background:`${C.cyan}18`,
              color:C.cyan, border:`1px solid ${C.cyan}40`, borderRadius:8,
              padding:'8px 16px', fontSize:12, cursor:'pointer', fontWeight:600 }}>
            <Download size={13} /> Exporter PDF
          </button>
          <button onClick={onTogglePaye}
            style={{ background:`${C.green}18`, color:C.green, border:`1px solid ${C.green}40`, borderRadius:8,
              padding:'8px 16px', fontSize:12, cursor:'pointer', fontWeight:600 }}>
            {ligne.statut === 'Payé' ? 'Marquer non payé' : 'Marquer payé'}
          </button>
          <button onClick={onClose}
            style={{ background:C.gold, color:C.navy, border:'none', borderRadius:8,
              padding:'8px 16px', fontSize:12, cursor:'pointer', fontWeight:700 }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function PaiePage() {
  const options = useMemo(() => moisOptions(), [])
  const [mois, setMois]       = useState(() => options[new Date().getMonth()])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [filterDept, setFilterDept] = useState('Tous')
  const [employes] = usePersistedList<EmployeStocke>(EMPLOYES_KEY)
  const [payes, setPayes] = usePersistedList<PaiePayee>(PAIE_KEY)

  const EMPLOYEES = useMemo<LignePaie[]>(() => employes.map(e => buildLigne(
    e.id, e.nom, e.poste, e.dept, e.salaire, anciennete(e.dateEntree),
    payes.some(p => p.cle === `${mois}:${e.id}`) ? 'Payé' : 'En attente',
  )), [employes, payes, mois])

  const selected = EMPLOYEES.find(e => e.id === selectedId) ?? null
  const setSelected = (l: LignePaie | null) => setSelectedId(l ? l.id : null)

  const togglePaye = (id: number) => {
    const cle = `${mois}:${id}`
    setPayes(prev => (prev.some(p => p.cle === cle) ? prev.filter(p => p.cle !== cle) : [...prev, { cle }]))
  }

  const depts = useMemo(() => ['Tous', ...Array.from(new Set(EMPLOYEES.map(e => e.dept)))], [EMPLOYEES])

  const filtered = useMemo(() =>
    EMPLOYEES.filter(e => filterDept === 'Tous' || e.dept === filterDept),
  [EMPLOYEES, filterDept])

  /* KPIs */
  const masseSalariale = useMemo(() => EMPLOYEES.reduce((s, e) => s + e.salaireBrut, 0), [EMPLOYEES])
  const chargesPatronal = useMemo(() => EMPLOYEES.reduce((s, e) => s + e.cnssPatronal, 0), [EMPLOYEES])
  const salaireMoyen   = useMemo(() => EMPLOYEES.length ? Math.round(masseSalariale / EMPLOYEES.length) : 0, [masseSalariale, EMPLOYEES])
  const paye           = useMemo(() => EMPLOYEES.filter(e => e.statut === 'Payé').length, [EMPLOYEES])

  /* Données chart par département */
  const chartData = useMemo(() => {
    const map: Record<string, number> = {}
    EMPLOYEES.forEach(e => { map[e.dept] = (map[e.dept] || 0) + e.salaireBrut })
    return Object.entries(map).map(([dept, total]) => ({ dept, total })).sort((a, b) => b.total - a.total)
  }, [EMPLOYEES])

  const th: React.CSSProperties = { padding:'10px 16px', textAlign:'left', fontSize:11, color:C.text3,
    fontWeight:600, borderBottom:`1px solid ${C.border}`, background:C.bg3, whiteSpace:'nowrap' as const }
  const td: React.CSSProperties = { padding:'12px 16px', fontSize:13, color:C.text,
    borderBottom:`1px solid ${C.border}`, verticalAlign:'middle' }
  const fBtn = (active: boolean): React.CSSProperties => ({
    background: active ? `${C.gold}20` : 'transparent', color: active ? C.gold : C.text2,
    border: `1px solid ${active ? C.gold : C.border}`, borderRadius:8,
    padding:'5px 12px', fontSize:11, cursor:'pointer', fontWeight: active ? 700 : 400,
  })

  return (
    <div style={{ display:'flex', flexDirection:'column' as const, gap:24 }}>
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Gestion de la Paie</h1>
          <p style={{ fontSize:13, color:C.text2, margin:'4px 0 0' }}>
            Bulletins de salaire · Cotisations CNSS · IUTS Burkina Faso
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <select value={mois} onChange={e => setMois(e.target.value)}
            style={{ background:C.bg2, border:`1px solid ${C.border}`, color:C.text,
              borderRadius:8, padding:'8px 14px', fontSize:13, outline:'none', cursor:'pointer' }}>
            {options.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button onClick={() => toast.success('Export fiche de paie globale — bientot disponible')}
            style={{ display:'flex', alignItems:'center', gap:7, background:C.gold, color:C.navy,
              border:'none', borderRadius:10, padding:'9px 16px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            <Download size={14} /> Exporter tout
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:14 }}>
        <KpiCard label="Masse salariale"  value={formatMontant(masseSalariale)} sub={`${EMPLOYEES.length} employes · brut`}    color={C.gold}   icon={Banknote}    />
        <KpiCard label="Charges patronales" value={formatMontant(chargesPatronal)} sub="CNSS employeur 16%"                    color={C.red}    icon={TrendingUp}  />
        <KpiCard label="Salaire moyen"    value={formatMontant(salaireMoyen)}    sub="brut mensuel"                            color={C.cyan}   icon={Users}       />
        <KpiCard label="Payes ce mois"    value={`${paye} / ${EMPLOYEES.length}`} sub="bulletins valides"                     color={C.green}  icon={CheckCircle} />
      </div>

      {EMPLOYEES.length === 0 && (
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:32, textAlign:'center' as const }}>
          <p style={{ fontSize:15, fontWeight:600, color:C.text, margin:'0 0 6px' }}>Aucun employé pour le moment</p>
          <p style={{ fontSize:13, color:C.text2, margin:'0 auto 18px', maxWidth:440 }}>
            Les bulletins sont calculés à partir de la liste de vos employés. Ajoutez-les d&apos;abord, la paie du mois apparaîtra ici.
          </p>
          <Link href="/employes" style={{ display:'inline-flex', alignItems:'center', minHeight:40, background:C.gold, color:C.navy,
            borderRadius:10, padding:'0 18px', fontWeight:700, fontSize:13, textDecoration:'none' }}>
            Ajouter un employé
          </Link>
        </div>
      )}

      {EMPLOYEES.length > 0 && (<>
      {/* BarChart */}
      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
        <h3 style={{ fontSize:13, fontWeight:600, color:C.text, margin:'0 0 16px' }}>
          Masse salariale brute par departement (FCFA)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={36} margin={{ top:0, right:0, bottom:0, left:-10 }}>
            <XAxis dataKey="dept" tick={{ fontSize:11, fill:C.text3 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:C.text3 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${((v as number)/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}
              cursor={{ fill:'rgba(255,255,255,0.04)' }}
              formatter={(v) => [formatMontant(v as number), 'Masse salariale']} />
            <Bar dataKey="total" radius={[5,5,0,0]}>
              {chartData.map(e => (
                <Cell key={e.dept} fill={DEPT_COLORS[e.dept] ?? C.cyan} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {depts.map(d => (
          <button key={d} onClick={() => setFilterDept(d)} style={fBtn(filterDept === d)}>{d}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Employe', 'Poste / Dept', 'Salaire brut', 'CNSS salarie', 'IUTS', 'Net a payer', 'Statut', ''].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} style={{ background: i % 2 === 1 ? `${C.bg3}80` : 'transparent' }}>
                  <td style={td}>
                    <div style={{ fontWeight:600 }}>{e.nom}</div>
                    <div style={{ fontSize:11, color:C.text3, marginTop:2 }}>{e.anciennete} an{e.anciennete > 1 ? 's' : ''} anciennete</div>
                  </td>
                  <td style={td}>
                    <div style={{ fontSize:12, color:C.text2 }}>{e.poste}</div>
                    <div style={{ fontSize:11 }}>
                      <span style={{ background:`${DEPT_COLORS[e.dept] ?? C.cyan}20`,
                        color:DEPT_COLORS[e.dept] ?? C.cyan, borderRadius:4, padding:'1px 7px', fontSize:10 }}>
                        {e.dept}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...td, fontFamily:'monospace', fontWeight:600, color:C.text }}>
                    {e.salaireBrut.toLocaleString('fr-FR')}
                  </td>
                  <td style={{ ...td, fontFamily:'monospace', color:C.red }}>
                    -{e.cnssEmploye.toLocaleString('fr-FR')}
                  </td>
                  <td style={{ ...td, fontFamily:'monospace', color:C.amber }}>
                    -{e.iuts.toLocaleString('fr-FR')}
                  </td>
                  <td style={{ ...td, fontFamily:'monospace', fontWeight:700, color:C.gold, fontSize:14 }}>
                    {e.netAPayer.toLocaleString('fr-FR')}
                  </td>
                  <td style={td}><StatutBadge s={e.statut} /></td>
                  <td style={td}>
                    <button onClick={() => setSelected(e)}
                      style={{ display:'flex', alignItems:'center', gap:5, background:`${C.cyan}18`,
                        border:'none', color:C.cyan, borderRadius:7, padding:'5px 11px',
                        fontSize:11, cursor:'pointer', fontWeight:600 }}>
                      <Eye size={12} /> Bulletin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 18px', borderTop:`1px solid ${C.border}`, fontSize:11, color:C.text3,
          display:'flex', justifyContent:'space-between' }}>
          <span>{filtered.length} employe{filtered.length !== 1 ? 's' : ''}</span>
          <span style={{ color:C.gold, fontWeight:600, fontFamily:'monospace' }}>
            Total net : {filtered.reduce((s, e) => s + e.netAPayer, 0).toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>

      </>)}

      {selected && <ModalBulletin ligne={selected} mois={mois} onClose={() => setSelected(null)} onTogglePaye={() => togglePaye(selected.id)} />}
    </div>
  )
}
