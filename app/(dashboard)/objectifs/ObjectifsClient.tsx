'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, TrendingUp, CheckCircle2, Clock, Trash2, Plus } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

interface Objectif {
  id?: string
  titre: string
  description?: string | null
  categorie: string
  montant_cible: number
  montant_actuel: number
  date_echeance?: string | null
  statut: string
}

interface Props {
  objectifs: Objectif[]
  userId: string
}

const catColors: Record<string, string> = {
  revenu: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  epargne: 'bg-green-500/20 text-green-300 border-green-500/30',
  investissement: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  remboursement: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  autre: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const catRadial: Record<string, string> = {
  revenu: '#00BCD4', epargne: '#22c55e', investissement: '#a855f7', remboursement: '#f59e0b', autre: '#6b7280',
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
const pct = (a: number, c: number) => c > 0 ? Math.min(100, Math.round((a / c) * 100)) : 0

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } } }

export default function ObjectifsClient({ objectifs: initial, userId }: Props) {
  const [objectifs, setObjectifs] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({ titre: '', description: '', categorie: 'epargne', montant_cible: '', montant_actuel: '0', date_echeance: '', statut: 'en_cours' })

  useEffect(() => setMounted(true), [])

  const enCours = objectifs.filter(o => o.statut === 'en_cours')
  const atteints = objectifs.filter(o => o.statut === 'atteint')
  const progressGlobal = objectifs.length > 0 ? Math.round(objectifs.reduce((s, o) => s + pct(o.montant_actuel, o.montant_cible), 0) / objectifs.length) : 0

  const radialData = objectifs.slice(0, 5).map(o => ({ name: o.titre.slice(0, 15), value: pct(o.montant_actuel, o.montant_cible), fill: catRadial[o.categorie] || '#6b7280' }))

  const stats = [
    { label: 'Total objectifs', value: objectifs.length, icon: Target, color: 'text-[#D4AF37]' },
    { label: 'Atteints', value: atteints.length, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'En cours', value: enCours.length, icon: Clock, color: 'text-cyan-400' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, montant_cible: parseFloat(form.montant_cible), montant_actuel: parseFloat(form.montant_actuel || '0'), user_id: userId }
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data, error } = await sb.from('objectifs').insert(payload).select().single()
      if (!error && data) { setObjectifs(p => [data, ...p]); setShowForm(false) }
    } catch { setObjectifs(p => [{ ...payload, id: Date.now().toString() }, ...p]); setShowForm(false) }
    setLoading(false)
  }

  const markAtteint = async (id: string) => {
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      await sb.from('objectifs').update({ statut: 'atteint' }).eq('id', id)
    } catch { /* mock */ }
    setObjectifs(p => p.map(o => o.id === id ? { ...o, statut: 'atteint' } : o))
  }

  const handleDelete = async (id: string) => {
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      await sb.from('objectifs').delete().eq('id', id)
    } catch { /* mock */ }
    setObjectifs(p => p.filter(o => o.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Objectifs financiers</h1>
          <p className="text-gray-400 text-sm mt-1">Suivez vos objectifs et votre progression</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#D4AF37] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors">
          <Plus className="w-4 h-4" />{showForm ? 'Annuler' : 'Nouvel objectif'}
        </button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <motion.div key={s.label} variants={item} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {mounted && radialData.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">Progression globale — {progressGlobal}%</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="30%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={4} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-5 space-y-4 overflow-hidden">
            <h2 className="text-white font-semibold">Nouvel objectif</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Titre *</label>
                <input required value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Catégorie</label>
                <select value={form.categorie} onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))} className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]">
                  {['revenu', 'epargne', 'investissement', 'remboursement', 'autre'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Date échéance</label>
                <input type="date" value={form.date_echeance} onChange={e => setForm(p => ({ ...p, date_echeance: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Montant cible (FCFA) *</label>
                <input required type="number" value={form.montant_cible} onChange={e => setForm(p => ({ ...p, montant_cible: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Montant actuel (FCFA)</label>
                <input type="number" value={form.montant_actuel} onChange={e => setForm(p => ({ ...p, montant_actuel: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="bg-[#D4AF37] text-[#0A1628] px-6 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50">
              {loading ? 'Enregistrement...' : 'Créer'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {objectifs.map(o => {
            const p = pct(o.montant_actuel, o.montant_cible)
            return (
              <motion.div key={o.id || o.titre} variants={item} exit={{ opacity: 0, x: -20 }} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{o.titre}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${catColors[o.categorie] || catColors.autre}`}>{o.categorie}</span>
                      {o.statut === 'atteint' && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Atteint</span>}
                      {o.date_echeance && <span className="text-xs text-gray-500">{new Date(o.date_echeance).toLocaleDateString('fr-FR')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.statut === 'en_cours' && o.id && (
                      <button onClick={() => markAtteint(o.id!)} className="text-xs text-green-400 hover:text-green-300 border border-green-400/30 px-2 py-1 rounded transition-colors">✓ Atteint</button>
                    )}
                    {o.id && <button onClick={() => handleDelete(o.id!)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#D4AF37] font-medium">{fmt(o.montant_actuel)}</span>
                    <span className="text-gray-400">{fmt(o.montant_cible)}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 0.8, type: 'spring' as const }} className={`h-full rounded-full ${o.statut === 'atteint' ? 'bg-green-500' : 'bg-[#D4AF37]'}`} />
                  </div>
                  <div className="text-right text-xs text-gray-400">{p}%</div>
                </div>
              </motion.div>
            )
          })}
          {objectifs.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
              <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Aucun objectif défini</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
