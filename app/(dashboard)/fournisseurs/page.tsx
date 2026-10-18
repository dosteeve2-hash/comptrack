'use client'

import { useState, useMemo } from 'react'
import { usePersistedList } from '@/lib/store'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Truck, Plus, Search, X, ChevronDown, AlertTriangle, CheckCircle, Clock, Globe, Phone, Mail } from 'lucide-react'

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
  id: number; nom: string; categorie: Categorie; ville: string
  contact: string; email: string; telephone: string; encours: number; statut: Statut
}

const STORAGE_KEY = 'comptrack_fournisseurs'

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

export default function FournisseursPage() {
  const [search,       setSearch]       = useState('')
  const [filtreCat,    setFiltreCat]    = useState<Categorie | 'Toutes'>('Toutes')
  const [filtreStatut, setFiltreStatut] = useState<Statut | 'Tous'>('Tous')
  const [selected,     setSelected]     = useState<Fournisseur | null>(null)
  const [fournisseurs, setFournisseurs] = usePersistedList<Fournisseur>(STORAGE_KEY)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [formError,    setFormError]    = useState('')
  const [form,         setForm]         = useState({
    nom: '', categorie: 'Services' as Categorie, contact: '', ville: '', telephone: '', email: '',
    encours: '', statut: 'A jour' as Statut,
  })

  const openModal = () => {
    setForm({ nom: '', categorie: 'Services', contact: '', ville: '', telephone: '', email: '', encours: '', statut: 'A jour' })
    setFormError('')
    setModalOpen(true)
  }

  const handleAdd = (ev: React.FormEvent) => {
    ev.preventDefault()
    const encours = form.encours.trim() === '' ? 0 : Number(form.encours)
    if (!form.nom.trim()) { setFormError('Indiquez le nom du fournisseur.'); return }
    if (isNaN(encours) || encours < 0) { setFormError('Encours : saisissez un montant positif ou laissez vide.'); return }
    setFournisseurs(prev => [{
      id: Date.now(), nom: form.nom.trim(), categorie: form.categorie, contact: form.contact.trim(),
      ville: form.ville.trim(), telephone: form.telephone.trim(), email: form.email.trim(),
      encours, statut: form.statut,
    }, ...prev])
    setModalOpen(false)
  }

  const filtered = useMemo(() => fournisseurs.filter(f => {
    const ok1 = f.nom.toLowerCase().includes(search.toLowerCase()) || f.contact.toLowerCase().includes(search.toLowerCase())
    const ok2 = filtreCat === 'Toutes' || f.categorie === filtreCat
    const ok3 = filtreStatut === 'Tous' || f.statut === filtreStatut
    return ok1 && ok2 && ok3
  }), [fournisseurs, search, filtreCat, filtreStatut])

  const totalEncours = fournisseurs.reduce((s, f) => s + f.encours, 0)
  const nbEnRetard   = fournisseurs.filter(f => f.statut === 'En retard').length
  const nbAvecEncours = fournisseurs.filter(f => f.encours > 0).length

  const chartData = CATS.map(cat => ({
    name: CAT_LABELS[cat].split(' ')[0],
    encours: fournisseurs.filter(f => f.categorie === cat).reduce((s, f) => s + f.encours, 0),
    color: CAT_COLOR[cat],
  })).filter(d => d.encours > 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            {fournisseurs.length} fournisseur{fournisseurs.length > 1 ? 's' : ''} — encours {fmt(totalEncours)}
          </p>
        </div>
        <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
          <Plus className="w-4 h-4" /> Ajouter fournisseur
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total encours',        value: fmt(totalEncours),              sub: `${fournisseurs.length} fournisseur${fournisseurs.length > 1 ? 's' : ''}`,  accent: false },
          { label: 'En retard',            value: `${nbEnRetard} fournisseur${nbEnRetard !== 1 ? 's' : ''}`, sub: 'paiements en souffrance', accent: nbEnRetard > 0 },
          { label: 'Avec encours',         value: String(nbAvecEncours),          sub: 'à régler',                     accent: false },
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

      {chartData.length > 0 && (
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

      {fournisseurs.length === 0 && (
        <div className="p-8 rounded-2xl border text-center" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>Aucun fournisseur enregistré pour le moment.</p>
          <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold hover:brightness-110"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
            <Plus className="w-4 h-4" /> Ajouter un fournisseur
          </button>
        </div>
      )}
      {fournisseurs.length > 0 && (
      <div className="rounded-2xl border overflow-x-auto" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Fournisseur', 'Categorie', 'Ville', 'Encours', 'Statut'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text2)' }}>
                  {fournisseurs.length === 0 ? (
                    <div className="flex flex-col items-center gap-3">
                      <span>Aucun fournisseur enregistré pour le moment.</span>
                      <button onClick={openModal} className="inline-flex items-center gap-2 px-4 min-h-10 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                        style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                        <Plus className="w-4 h-4" /> Ajouter un fournisseur
                      </button>
                    </div>
                  ) : 'Aucun fournisseur ne correspond aux filtres'}
                </td>
              </tr>
            )}
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
                  <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{f.ville || '—'}</span>
                </td>
                <td className="px-4 py-3.5 text-sm font-bold font-mono" style={{ color: f.encours > 0 ? '#ef4444' : 'var(--text2)' }}>
                  {f.encours > 0 ? `-${f.encours.toLocaleString('fr-FR')}` : '—'}
                </td>
                <td className="px-4 py-3.5"><StatutBadge s={f.statut} /></td>
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
                <h3 className="font-bold text-lg">{selected.nom}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:brightness-110"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                ['Categorie',   CAT_LABELS[selected.categorie]],
                ['Contact',     selected.contact || '—'],
                ['Ville',       selected.ville || '—'],
                ['Encours',     selected.encours > 0 ? fmt(selected.encours) : 'Solde'],
                ['Statut',      STATUT_LABELS[selected.statut]],
              ].map(([label, val], i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg2)' : 'transparent' }}>
                  <span className="text-xs" style={{ color: 'var(--text2)' }}>{label}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {selected.telephone && (
                <a href={`tel:${selected.telephone}`}
                  className="flex-1 flex items-center justify-center gap-2 min-h-10 rounded-xl text-sm font-medium hover:opacity-80"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                  <Phone className="w-4 h-4" /> Appeler
                </a>
              )}
              {selected.email && (
                <a href={`mailto:${selected.email}`}
                  className="flex-1 flex items-center justify-center gap-2 min-h-10 rounded-xl text-sm font-medium hover:opacity-80"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
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
              <h3 className="font-bold text-lg">Nouveau fournisseur</h3>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fermer"
                className="p-2 rounded-xl hover:brightness-110" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {[
              { label: 'Nom *', key: 'nom', type: 'text', placeholder: 'Nom du fournisseur' },
              { label: 'Contact', key: 'contact', type: 'text', placeholder: 'Personne à joindre' },
              { label: 'Ville', key: 'ville', type: 'text', placeholder: 'Ville' },
              { label: 'Téléphone', key: 'telephone', type: 'tel', placeholder: 'Numéro de téléphone' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'Adresse e-mail' },
              { label: 'Encours dû (FCFA)', key: 'encours', type: 'number', placeholder: 'Laisser vide si rien à régler' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key as 'nom' | 'contact' | 'ville' | 'telephone' | 'email' | 'encours']}
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
                  {CATS.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text2)' }}>Statut</label>
                <select value={form.statut} onChange={e => setForm(p => ({ ...p, statut: e.target.value as Statut }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                  {STATUTS.map(st => <option key={st} value={st}>{STATUT_LABELS[st]}</option>)}
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
