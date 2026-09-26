'use client'
import { useState, useMemo, useEffect, type CSSProperties } from 'react'
import { FileSignature, Plus, Search, X, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast, Toaster } from 'sonner'
import { formatMontant } from '@/lib/utils'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navy:'#0A1628', gold:'#D4AF37', cyan:'#00D4FF', bg2:'#0c1a34', bg3:'#111d34',
  border:'#1a3357', border2:'#2a4a72', text:'#EBF4FF', text2:'#8BABC9',
  text3:'#4E6F8E', green:'#22c55e', red:'#ef4444', amber:'#f59e0b', blue:'#3b82f6',
}

// ─── Types & mock data ────────────────────────────────────────────────────────
type TypeContrat = 'Client' | 'Fournisseur' | 'Partenaire'
type StatutContrat = 'Actif' | 'Expiré' | 'En cours de renouvellement' | 'Suspendu'

interface Contrat {
  id: number; titre: string; partie: string; type: TypeContrat
  montant: number; dateDebut: string; dateFin: string; statut: StatutContrat
}

const MOCK: Contrat[] = [
  { id:1,  titre:'Contrat cadre distribution',     partie:'Saf-Cacao BF',          type:'Client',      montant:4500000,  dateDebut:'2026-01-01', dateFin:'2026-12-31', statut:'Actif' },
  { id:2,  titre:'Approvisionnement marchandises',  partie:'CFAO Motors Burkina',   type:'Fournisseur', montant:2800000,  dateDebut:'2026-03-01', dateFin:'2027-02-28', statut:'Actif' },
  { id:3,  titre:'Maintenance équipements',         partie:'Sonabel SA',            type:'Fournisseur', montant:840000,   dateDebut:'2025-07-01', dateFin:'2026-06-30', statut:'Expiré' },
  { id:4,  titre:'Prestation conseil IT',           partie:'Ministère Commerce BF', type:'Client',      montant:3200000,  dateDebut:'2026-04-15', dateFin:'2026-10-14', statut:'Actif' },
  { id:5,  titre:'Partenariat co-marketing',        partie:'Brakina SA',            type:'Partenaire',  montant:600000,   dateDebut:'2026-02-01', dateFin:'2026-07-31', statut:'En cours de renouvellement' },
  { id:6,  titre:'Location entrepôt Kossodo',       partie:'Immobilier BF SAS',     type:'Fournisseur', montant:1800000,  dateDebut:'2025-09-01', dateFin:'2026-08-31', statut:'En cours de renouvellement' },
  { id:7,  titre:'Fourniture matériel bureau',      partie:'Bolloré Logistics BF',  type:'Fournisseur', montant:450000,   dateDebut:'2026-05-01', dateFin:'2026-04-30', statut:'Suspendu' },
  { id:8,  titre:'Distribution réseau national',    partie:'ONATEL SA',             type:'Client',      montant:7200000,  dateDebut:'2026-01-15', dateFin:'2027-01-14', statut:'Actif' },
  { id:9,  titre:'Audit comptable annuel',          partie:'Cabinet Faso Conseil',  type:'Fournisseur', montant:980000,   dateDebut:'2026-01-01', dateFin:'2026-12-31', statut:'Actif' },
  { id:10, titre:'Accord commercialisation',        partie:'Groupe Colgate BF',     type:'Client',      montant:5500000,  dateDebut:'2026-06-01', dateFin:'2027-05-31', statut:'Actif' },
]

const CHART_DATA = [
  { mois:'Jan', valeur:8200000 }, { mois:'Fév', valeur:3400000 }, { mois:'Mar', valeur:11500000 },
  { mois:'Avr', valeur:4200000 }, { mois:'Mai', valeur:6800000 }, { mois:'Jun', valeur:9100000 },
  { mois:'Jul', valeur:7300000 }, { mois:'Aoû', valeur:2900000 },
]

function statutMeta(s: StatutContrat): { background: string; color: string } {
  if (s === 'Actif')                      return { background:'rgba(34,197,94,0.12)',   color: C.green  }
  if (s === 'Expiré')                     return { background:'rgba(239,68,68,0.12)',   color: C.red    }
  if (s === 'En cours de renouvellement') return { background:'rgba(245,158,11,0.12)',  color: C.amber  }
  return                                         { background:'rgba(100,116,139,0.12)', color:'#64748b' }
}

function typeMeta(t: TypeContrat): CSSProperties {
  if (t === 'Client')      return { background:`${C.cyan}1a`, color: C.cyan }
  if (t === 'Fournisseur') return { background:`${C.gold}1a`, color: C.gold }
  return                          { background:`${C.blue}1a`, color: C.blue }
}

function joursRestants(dateFin: string): number {
  return Math.ceil((new Date(dateFin).getTime() - Date.now()) / 86400000)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ContratsPage() {
  const [list, setList]           = useState<Contrat[]>(MOCK)
  const [search, setSearch]       = useState('')
  const [filterType, setFilterType] = useState<TypeContrat | 'Tous'>('Tous')
  const [modalOpen, setModalOpen] = useState(false)
  const [mounted, setMounted]     = useState(false)
  const [form, setForm] = useState({
    titre:'', partie:'', type:'Client' as TypeContrat, montant:'',
    dateDebut:'', dateFin:'',
  })

  useEffect(() => { setMounted(true) }, [])

  const filtered = useMemo(() => list.filter(c => {
    const q = search.toLowerCase()
    const matchQ = !q || c.titre.toLowerCase().includes(q) || c.partie.toLowerCase().includes(q)
    const matchT = filterType === 'Tous' || c.type === filterType
    return matchQ && matchT
  }), [list, search, filterType])

  const valeurTotale = list.filter(c => c.statut === 'Actif').reduce((s, c) => s + c.montant, 0)
  const nbActifs     = list.filter(c => c.statut === 'Actif').length
  const nbExpires    = list.filter(c => c.statut === 'Expiré').length
  const nbRenou      = list.filter(c => c.statut === 'En cours de renouvellement').length

  function handleAdd(ev: React.FormEvent) {
    ev.preventDefault()
    if (!form.titre || !form.partie || !form.montant) { toast.error('Titre, partie et montant requis'); return }
    const mt = Number(form.montant)
    if (isNaN(mt) || mt <= 0) { toast.error('Montant invalide'); return }
    const nouveau: Contrat = {
      id: Date.now(), titre: form.titre, partie: form.partie, type: form.type,
      montant: mt, dateDebut: form.dateDebut || new Date().toISOString().split('T')[0],
      dateFin: form.dateFin || '', statut: 'Actif',
    }
    setList(p => [nouveau, ...p])
    setModalOpen(false)
    setForm({ titre:'', partie:'', type:'Client', montant:'', dateDebut:'', dateFin:'' })
    toast.success('Contrat ajouté avec succès')
  }

  const card: React.CSSProperties   = { background: C.bg2, border:`1px solid ${C.border}`, borderRadius:16 }
  const inputStyle: React.CSSProperties = {
    background: C.bg3, border:`1px solid ${C.border2}`, borderRadius:10,
    padding:'8px 12px', color: C.text, fontSize:13, outline:'none', width:'100%',
  }
  const labelStyle: React.CSSProperties = { fontSize:12, color: C.text2, display:'block', marginBottom:4 }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Contrats</h1>
          <p style={{ fontSize:13, color: C.text2, margin:'4px 0 0' }}>
            Suivi des contrats clients, fournisseurs & partenaires
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{
          display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:12,
          background: C.gold, color: C.navy, fontWeight:600, fontSize:13, border:'none', cursor:'pointer',
        }}>
          <Plus style={{ width:16, height:16 }} /> Nouveau contrat
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
        {[
          { label:'Valeur contrats actifs', value: formatMontant(valeurTotale), icon: TrendingUp,    color: C.gold  },
          { label:'Contrats actifs',        value: nbActifs,                    icon: CheckCircle,   color: C.green },
          { label:'À renouveler',           value: nbRenou,                     icon: Clock,         color: C.amber },
          { label:'Expirés',                value: nbExpires,                   icon: AlertTriangle, color: C.red   },
        ].map((k, i) => (
          <div key={i} style={{ ...card, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${k.color}1a`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <k.icon style={{ width:18, height:18, color: k.color }} />
              </div>
              <span style={{ fontSize:12, color: C.text2 }}>{k.label}</span>
            </div>
            <p style={{ fontSize:20, fontWeight:700, fontFamily:'monospace', margin:0, color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Filters */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ ...card, padding:20 }}>
          <p style={{ fontWeight:600, fontSize:14, margin:'0 0 4px' }}>Valeur des contrats signés / mois</p>
          <p style={{ fontSize:12, color: C.text2, margin:'0 0 16px' }}>2026 — FCFA</p>
          {mounted ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={CHART_DATA} margin={{ top:0, right:0, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="mois" tick={{ fill: C.text2, fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.text2, fontSize:10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ background: C.bg3, border:`1px solid ${C.border2}`, borderRadius:10, fontSize:12 }}
                  formatter={(v: number) => [formatMontant(v), 'Valeur']}
                  labelStyle={{ color: C.text }}
                />
                <Bar dataKey="valeur" fill={C.cyan} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:180, background: C.bg3, borderRadius:10 }} />
          )}
        </div>

        <div style={{ ...card, padding:20, display:'flex', flexDirection:'column', gap:12 }}>
          <p style={{ fontWeight:600, fontSize:14, margin:0 }}>Filtres</p>
          <div style={{ position:'relative' }}>
            <Search style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:15, height:15, color: C.text2 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher titre ou partie..."
              style={{ ...inputStyle, paddingLeft:32 }} />
          </div>
          <div>
            <p style={labelStyle}>Type de contrat</p>
            <div style={{ display:'flex', gap:6 }}>
              {(['Tous','Client','Fournisseur','Partenaire'] as const).map(t => (
                <button key={t} onClick={() => setFilterType(t)} style={{
                  padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer',
                  border: filterType === t ? `1px solid ${C.gold}` : `1px solid ${C.border}`,
                  background: filterType === t ? `${C.gold}1a` : 'transparent',
                  color: filterType === t ? C.gold : C.text2,
                }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ marginTop:'auto', padding:12, borderRadius:10, background:`${C.gold}0d`, border:`1px solid ${C.gold}33` }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color: C.text2 }}>Affichés</span>
              <span style={{ color: C.gold, fontWeight:600, fontFamily:'monospace' }}>{filtered.length}/{list.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontWeight:600, fontSize:14, margin:0 }}>Tous les contrats</p>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Contrat','Partie','Type','Montant','Période','Jours restants','Statut'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'12px 20px', fontSize:11, fontWeight:600, color: C.text2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color: C.text2 }}>Aucun contrat trouvé</td></tr>
              ) : filtered.map(c => {
                const sm = statutMeta(c.statut)
                const tm = typeMeta(c.type)
                const jours = joursRestants(c.dateFin)
                return (
                  <tr key={c.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:10, background:`${C.gold}1a`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <FileSignature style={{ width:16, height:16, color: C.gold }} />
                        </div>
                        <p style={{ fontSize:13, fontWeight:600, margin:0, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.titre}</p>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px', color: C.text2, fontSize:12 }}>{c.partie}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ ...tm, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>{c.type}</span>
                    </td>
                    <td style={{ padding:'14px 20px', fontFamily:'monospace', fontWeight:600, color: C.gold }}>{formatMontant(c.montant)}</td>
                    <td style={{ padding:'14px 20px', color: C.text2, fontSize:11 }}>
                      {c.dateDebut} → {c.dateFin || '∞'}
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      {c.dateFin ? (
                        <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:600, color: jours < 0 ? C.red : jours < 30 ? C.amber : C.green }}>
                          {jours < 0 ? `${Math.abs(jours)}j dépassés` : `${jours}j`}
                        </span>
                      ) : <span style={{ color: C.text3, fontSize:12 }}>—</span>}
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ background: sm.background, color: sm.color, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, whiteSpace:'nowrap' }}>
                        {c.statut}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
          <div style={{ background: C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:28, width:'100%', maxWidth:480 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <p style={{ fontWeight:700, fontSize:16, margin:0 }}>Nouveau contrat</p>
              <button onClick={() => setModalOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color: C.text2 }}>
                <X style={{ width:20, height:20 }} />
              </button>
            </div>
            <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={labelStyle}>Titre du contrat *</label>
                <input value={form.titre} onChange={e => setForm(p=>({...p, titre:e.target.value}))} placeholder="Contrat cadre distribution" style={inputStyle} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Partie concernée *</label>
                  <input value={form.partie} onChange={e => setForm(p=>({...p, partie:e.target.value}))} placeholder="Nom entreprise" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={form.type} onChange={e => setForm(p=>({...p, type:e.target.value as TypeContrat}))} style={inputStyle}>
                    <option>Client</option><option>Fournisseur</option><option>Partenaire</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Montant FCFA *</label>
                <input type="number" value={form.montant} onChange={e => setForm(p=>({...p, montant:e.target.value}))} placeholder="1500000" style={inputStyle} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" value={form.dateDebut} onChange={e => setForm(p=>({...p, dateDebut:e.target.value}))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date de fin</label>
                  <input type="date" value={form.dateFin} onChange={e => setForm(p=>({...p, dateFin:e.target.value}))} style={inputStyle} />
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{
                  flex:1, padding:'10px 0', borderRadius:10, border:`1px solid ${C.border2}`,
                  background:'transparent', color: C.text2, fontSize:13, cursor:'pointer', fontWeight:500,
                }}>Annuler</button>
                <button type="submit" style={{
                  flex:1, padding:'10px 0', borderRadius:10, border:'none',
                  background: C.gold, color: C.navy, fontSize:13, cursor:'pointer', fontWeight:700,
                }}>Créer le contrat</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
