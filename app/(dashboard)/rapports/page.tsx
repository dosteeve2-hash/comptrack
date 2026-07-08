import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RapportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const prevFirstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
  const prevLastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]

  const [{ data: rev }, { data: dep }, { data: prevRev }, { data: prevDep }] = await Promise.all([
    supabase.from('revenus').select('montant, categorie').gte('date_revenu', firstDay),
    supabase.from('depenses').select('montant, categorie').gte('date_depense', firstDay),
    supabase.from('revenus').select('montant').gte('date_revenu', prevFirstDay).lte('date_revenu', prevLastDay),
    supabase.from('depenses').select('montant').gte('date_depense', prevFirstDay).lte('date_depense', prevLastDay),
  ])

  const totalRev = (rev ?? []).reduce((s, r) => s + Number(r.montant), 0)
  const totalDep = (dep ?? []).reduce((s, d) => s + Number(d.montant), 0)
  const profit = totalRev - totalDep
  const prevTotalRev = (prevRev ?? []).reduce((s, r) => s + Number(r.montant), 0)
  const prevTotalDep = (prevDep ?? []).reduce((s, d) => s + Number(d.montant), 0)
  const prevProfit = prevTotalRev - prevTotalDep

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'
  const pct = (curr: number, prev: number) =>
    prev === 0 ? null : Math.round(((curr - prev) / prev) * 100)

  // Top catégories dépenses
  const depCat: Record<string, number> = {}
  ;(dep ?? []).forEach((d) => {
    depCat[d.categorie] = (depCat[d.categorie] ?? 0) + Number(d.montant)
  })
  const topDep = Object.entries(depCat).sort((a, b) => b[1] - a[1]).slice(0, 3)

  // Top catégories revenus
  const revCat: Record<string, number> = {}
  ;(rev ?? []).forEach((r) => {
    revCat[r.categorie] = (revCat[r.categorie] ?? 0) + Number(r.montant)
  })
  const topRev = Object.entries(revCat).sort((a, b) => b[1] - a[1]).slice(0, 3)

  const rentabilite = totalRev > 0 ? Math.round((profit / totalRev) * 100) : 0
  const moisNom = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const kpis = [
    {
      label: 'Revenus',
      val: fmt(totalRev),
      pct: pct(totalRev, prevTotalRev),
      color: '#22c55e',
    },
    {
      label: 'Dépenses',
      val: fmt(totalDep),
      pct: pct(totalDep, prevTotalDep),
      color: '#ef4444',
    },
    {
      label: 'Profit net',
      val: fmt(profit),
      pct: pct(profit, prevProfit),
      color: profit >= 0 ? '#22c55e' : '#ef4444',
    },
    {
      label: 'Rentabilité',
      val: `${rentabilite}%`,
      pct: null as number | null,
      color: rentabilite >= 0 ? '#22c55e' : '#ef4444',
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Rapport mensuel</h1>
        <p className="text-white/60 mt-1">Synthèse de {moisNom}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <p className="text-white/60 text-sm">{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color }}>
              {k.val}
            </p>
            {k.pct !== null && (
              <p
                className={`text-xs mt-1 ${k.pct >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {k.pct >= 0 ? '+' : ''}
                {k.pct}% vs mois précédent
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Top catégories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">
            Top dépenses par catégorie
          </h2>
          {topDep.length === 0 ? (
            <p className="text-white/40 text-sm">Aucune dépense ce mois</p>
          ) : (
            <ul className="space-y-3">
              {topDep.map(([cat, montant]) => (
                <li key={cat} className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">{cat}</span>
                  <span className="text-red-400 font-medium text-sm">
                    {fmt(montant)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">
            Top revenus par catégorie
          </h2>
          {topRev.length === 0 ? (
            <p className="text-white/40 text-sm">Aucun revenu ce mois</p>
          ) : (
            <ul className="space-y-3">
              {topRev.map(([cat, montant]) => (
                <li key={cat} className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">{cat}</span>
                  <span className="text-green-400 font-medium text-sm">
                    {fmt(montant)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
