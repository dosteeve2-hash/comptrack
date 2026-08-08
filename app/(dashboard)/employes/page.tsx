'use client'
import { useState, useMemo, useEffect, type CSSProperties } from 'react'
import { Users, Plus, Search, X, Wallet, Award, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast, Toaster } from 'sonner'
import { formatMontant } from '@/lib/utils'

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  navy:'#0A1628', gold:'#D4AF37', cyan:'#00D4FF', bg2:'#0c1a34', bg3:'#111d34',
  border:'#1a3357', border2:'#2a4a72', text:'#EBF4FF', text2:'#8BABC9',
  text3:'#4E6F8E', green:'#22c55e', red:'#ef4444', amber:'#f59e0b', blue:'#3b82f6',
}

// ─── Types & mock data ────────────────────────────────────────────────────────
type Contrat = 'CDI' | 'CDD' | 'Stage'
type Statut  = 'Actif' | 'Congé' | 'Inactif'
interface Employe {
  id: number; nom: string; poste: string; dept: string
  salaire: number; contrat: Contrat; statut: Statut
  dateEntree: string; telephone: string
}

const MOCK: Employe[] = [
  { id:1, nom:'Ouédraogo Issouf',     poste:'Directeur commercial',  dept:'Commercial',    salaire:350000, contrat:'CDI',   statut:'Actif',   dateEntree:'2020-03-01', telephone:'+226 70 12 34 56' },
  { id:2, nom:'Compaoré Aminata',     poste:'Comptable senior',      dept:'Finance',       salaire:280000, contrat:'CDI',   statut:'Actif',   dateEntree:'2021-07-15', telephone:'+226 76 23 45 67' },
  { id:3, nom:'Kaboré Rasmané',       poste:'Technicien IT',         dept:'Informatique',  salaire:220000, contrat:'CDI',   statut:'Actif',   dateEntree:'2022-01-10', telephone:'+226 75 34 56 78' },
  { id:4, nom:'Sawadogo Fatoumata',   poste:'Assistante RH',         dept:'RH',            salaire:185000, contrat:'CDD',   statut:'Actif',   dateEntree:'2023-06-01', telephone:'+226 70 45 67 89' },
  { id:5, nom:'Zongo Bienvenu',       poste:'Commercial terrain',    dept:'Commercial',    salaire:195000, contrat:'CDI',   statut:'Actif',   dateEntree:'2022-09-15', telephone:'+226 76 56 78 90' },
  { id:6, nom:'Tiendrébeogo Alice',   poste:'Développeuse web',      dept:'Informatique',  salaire:245000, contrat:'CDI',   statut:'Congé',   dateEntree:'2021-11-20', telephone:'+226 75 67 89 01' },
  { id:7, nom:'Ouattara Mamadou',     poste:'Livreur',               dept:'Logistique',    salaire:120000, contrat:'CDD',   statut:'Actif',   dateEntree:'2024-01-15', telephone:'+226 70 78 90 12' },
  { id:8, nom:'Diallo Mariam',        poste:'Secrétaire',            dept:'Administration',salaire:150000, contrat:'CDI',   statut:'Actif',   dateEntree:'2020-08-01', telephone:'+226 76 89 01 23' },
  { id:9, nom:'Rouamba Théodore',     poste:'Responsable logistique',dept:'Logistique',    salaire:230000, contrat:'CDI',   statut:'Actif',   dateEntree:'2019-05-10', telephone:'+226 70 90 12 34' },
  { id:10,nom:'Nana Sylvie',          poste:'Stagiaire marketing',   dept:'Commercial',    salaire:75000,  contrat:'Stage', statut:'Actif',   dateEntree:'2026-04-01', telephone:'+226 75 01 23 45' },
]

const CHART_DATA = [
  { dept:'Commercial',    total:620000 },
  { dept:'Finance',       total:280000 },
  { dept:'Info',          total:465000 },
  { dept:'RH',            total:185000 },
  { dept:'Logistique',    total:350000 },
  { dept:'Admin',         total:150000 },
]

function statutColor(s: Statut): CSSProperties {
  if (s === 'Actif')   return { background: 'rgba(34,197,94,0.12)',  color: C.green }
  if (s === 'Congé')   return { background: 'rgba(245,158,11,0.12)', color: C.amber }
  return                      { background: 'rgba(239,68,68,0.12)',  color: C.red   }
}

function contratColor(c: Contrat): CSSProperties {
  if (c === 'CDI')   return { background: 'rgba(0,212,255,0.1)',  color: C.cyan }
  if (c === 'CDD')   return { background: 'rgba(59,130,246,0.1)', color: C.blue }
  return                    { background: 'rgba(212,175,55,0.1)', color: C.gold }
}

function initials(nom: string) {
  return nom.split(' ').slice(0,2).map(p => p[0]).join('').toUpperCase()
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EmployesPage() {
  const [list, setList]         = useState<Employe[]>(MOCK)
  const [search, setSearch]     = useState('')
  const [filterDept, setFilterDept] = useState('Tous')
  const [modalOpen, setModalOpen]   = useState(false)
  const [mounted, setMounted]       = useState(false)
  const [form, setForm] = useState({ nom:'', poste:'', dept:'Commercial', salaire:'', contrat:'CDI' as Contrat, telephone:'' })

  useEffect(() => { setMounted(true) }, [])

  const depts = ['Tous', ...Array.from(new Set(list.map(e => e.dept)))]

  const filtered = useMemo(() => list.filter(e => {
    const q = search.toLowerCase()
    const matchQ = !q || e.nom.toLowerCase().includes(q) || e.poste.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q)
    const matchD = filterDept === 'Tous' || e.dept === filterDept
    return matchQ && matchD
  }), [list, search, filterDept])

  const masseSalariale = list.reduce((s, e) => s + e.salaire, 0)
  const nbActifs       = list.filter(e => e.statut === 'Actif').length
  const salaireMin     = Math.min(...list.map(e => e.salaire))
  const salaireMax     = Math.max(...list.map(e => e.salaire))

  function handleAdd(ev: React.FormEvent) {
    ev.preventDefault()
    if (!form.nom || !form.poste || !form.salaire) { toast.error('Nom, poste et salaire requis'); return }
    const sal = Number(form.salaire)
    if (isNaN(sal) || sal <= 0) { toast.error('Salaire invalide'); return }
    const nouvel: Employe = {
      id: Date.now(), nom: form.nom, poste: form.poste, dept: form.dept,
      salaire: sal, contrat: form.contrat, statut: 'Actif',
      dateEntree: new Date().toISOString().split('T')[0],
      telephone: form.telephone,
    }
    setList(p => [nouvel, ...p])
    setModalOpen(false)
    setForm({ nom:'', poste:'', dept:'Commercial', salaire:'', contrat:'CDI', telephone:'' })
    toast.success(`${form.nom} ajouté(e) avec succès`)
  }

  const row: CSSProperties = { display:'flex', alignItems:'center', gap:12 }
  const card: CSSProperties = { background: C.bg2, border:`1px solid ${C.border}`, borderRadius:16 }
  const inputStyle: CSSProperties = {
    background: C.bg3, border:`1px solid ${C.border2}`, borderRadius:10,
    padding:'8px 12px', color: C.text, fontSize:13, outline:'none', width:'100%',
  }
  const labelStyle: CSSProperties = { fontSize:12, color: C.text2, display:'block', marginBottom:4 }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>Employés</h1>
          <p style={{ fontSize:13, color: C.text2, margin:'4px 0 0' }}>
            {filtered.length} employé{filtered.length !== 1 ? 's' : ''} · Août 2026
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} style={{
          display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:12,
          background: C.gold, color: C.navy, fontWeight:600, fontSize:13, border:'none', cursor:'pointer',
        }}>
          <Plus style={{ width:16, height:16 }} /> Nouvel employé
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
        {[
          { label:'Total employés',    value: list.length,            icon: Users,      color: C.cyan  },
          { label:'Actifs',            value: nbActifs,               icon: Award,      color: C.green },
          { label:'Masse salariale',   value: formatMontant(masseSalariale), icon: Wallet, color: C.gold },
          { label:'Fourchette',        value: `${(salaireMin/1000).toFixed(0)}k–${(salaireMax/1000).toFixed(0)}k FCFA`, icon: TrendingUp, color: C.amber },
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

      {/* Chart + Search */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Chart */}
        <div style={{ ...card, padding:20 }}>
          <p style={{ fontWeight:600, fontSize:14, margin:'0 0 4px' }}>Masse salariale par département</p>
          <p style={{ fontSize:12, color: C.text2, margin:'0 0 16px' }}>FCFA / mois</p>
          {mounted ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={CHART_DATA} margin={{ top:0, right:0, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="dept" tick={{ fill: C.text2, fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.text2, fontSize:10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: C.bg3, border:`1px solid ${C.border2}`, borderRadius:10, fontSize:12 }}
                  formatter={(v: number) => [formatMontant(v), 'Total']}
                  labelStyle={{ color: C.text }}
                />
                <Bar dataKey="total" fill={C.gold} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:180, background: C.bg3, borderRadius:10, animation:'pulse 2s infinite' }} />
          )}
        </div>

        {/* Filters */}
        <div style={{ ...card, padding:20, display:'flex', flexDirection:'column', gap:12 }}>
          <p style={{ fontWeight:600, fontSize:14, margin:0 }}>Filtres</p>
          <div style={{ position:'relative' }}>
            <Search style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:15, height:15, color: C.text2 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un employé..."
              style={{ ...inputStyle, paddingLeft:32 }} />
          </div>
          <div>
            <p style={labelStyle}>Département</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {depts.map(d => (
                <button key={d} onClick={() => setFilterDept(d)} style={{
                  padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer',
                  border: filterDept === d ? `1px solid ${C.gold}` : `1px solid ${C.border}`,
                  background: filterDept === d ? `${C.gold}1a` : 'transparent',
                  color: filterDept === d ? C.gold : C.text2,
                }}>{d}</button>
              ))}
            </div>
          </div>
          <div style={{ marginTop:'auto', padding:12, borderRadius:10, background:`${C.cyan}0d`, border:`1px solid ${C.cyan}33` }}>
            <p style={{ fontSize:12, color: C.cyan, fontWeight:600, margin:'0 0 4px' }}>Résumé</p>
            <p style={{ fontSize:12, color: C.text2, margin:0 }}>{filtered.length} / {list.length} employés affichés</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontWeight:600, fontSize:14, margin:0 }}>Liste des employés</p>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Employé','Département','Poste','Salaire','Contrat','Statut','Entrée'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'12px 20px', fontSize:11, fontWeight:600, color: C.text2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color: C.text2 }}>Aucun employé trouvé</td></tr>
              ) : filtered.map(e => {
                const sc = statutColor(e.statut)
                const cc = contratColor(e.contrat)
                return (
                  <tr key={e.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ ...row }}>
                        <div style={{ width:34, height:34, borderRadius:10, background:`${C.cyan}1a`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color: C.cyan, flexShrink:0 }}>
                          {initials(e.nom)}
                        </div>
                        <div>
                          <p style={{ fontSize:13, fontWeight:600, margin:0 }}>{e.nom}</p>
                          <p style={{ fontSize:11, color: C.text3, margin:0 }}>{e.telephone}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px', color: C.text2 }}>{e.dept}</td>
                    <td style={{ padding:'14px 20px', color: C.text2, fontSize:12 }}>{e.poste}</td>
                    <td style={{ padding:'14px 20px', fontFamily:'monospace', fontWeight:600, color: C.gold }}>{formatMontant(e.salaire)}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ ...cc, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>{e.contrat}</span>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ ...sc, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>{e.statut}</span>
                    </td>
                    <td style={{ padding:'14px 20px', color: C.text2, fontSize:12 }}>{e.dateEntree}</td>
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
          <div style={{ ...card, padding:28, width:'100%', maxWidth:480, position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <p style={{ fontWeight:700, fontSize:16, margin:0 }}>Nouvel employé</p>
              <button onClick={() => setModalOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color: C.text2 }}>
                <X style={{ width:20, height:20 }} />
              </button>
            </div>
            <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={labelStyle}>Nom complet *</label>
                <input value={form.nom} onChange={e => setForm(p=>({...p, nom:e.target.value}))} placeholder="Koné Bakary" style={inputStyle} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Poste *</label>
                  <input value={form.poste} onChange={e => setForm(p=>({...p, poste:e.target.value}))} placeholder="Comptable" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Département</label>
                  <select value={form.dept} onChange={e => setForm(p=>({...p, dept:e.target.value}))} style={inputStyle}>
                    {['Commercial','Finance','Informatique','RH','Logistique','Administration'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Salaire FCFA *</label>
                  <input type="number" value={form.salaire} onChange={e => setForm(p=>({...p, salaire:e.target.value}))} placeholder="180000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Type de contrat</label>
                  <select value={form.contrat} onChange={e => setForm(p=>({...p, contrat:e.target.value as Contrat}))} style={inputStyle}>
                    <option>CDI</option><option>CDD</option><option>Stage</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input value={form.telephone} onChange={e => setForm(p=>({...p, telephone:e.target.value}))} placeholder="+226 70 00 00 00" style={inputStyle} />
              </div>
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{
                  flex:1, padding:'10px 0', borderRadius:10, border:`1px solid ${C.border2}`,
                  background:'transparent', color: C.text2, fontSize:13, cursor:'pointer', fontWeight:500,
                }}>Annuler</button>
                <button type="submit" style={{
                  flex:1, padding:'10px 0', borderRadius:10, border:'none',
                  background: C.gold, color: C.navy, fontSize:13, cursor:'pointer', fontWeight:700,
                }}>Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
