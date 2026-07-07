import { createClient } from '@/lib/supabase/server'
import { TrendingUp, TrendingDown, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface KPICard {
  label: string
  value: string
  icon: LucideIcon
  color: string
  bg: string
  note: string
}

export default async function DashboardKPIs() {
  let totalRevenus = 0
  let totalDepenses = 0
  let nbClients = 0

  try {
    const supabase = await createClient()

    const [
      { data: revenus },
      { data: depenses },
      { count: clientsCount },
    ] = await Promise.all([
      supabase.from('revenus').select('montant'),
      supabase.from('depenses').select('montant'),
      supabase.from('clients').select('*', { count: 'exact', head: true }),
    ])

    totalRevenus = revenus?.reduce((sum, r) => sum + (r.montant as number ?? 0), 0) ?? 0
    totalDepenses = depenses?.reduce((sum, d) => sum + (d.montant as number ?? 0), 0) ?? 0
    nbClients = clientsCount ?? 0
  } catch {
    // Supabase unavailable — affichage à zéro
  }

  const profit = totalRevenus - totalDepenses
  const profitPositif = profit >= 0
  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

  const kpis: KPICard[] = [
    {
      label: 'Total Revenus',
      value: fmt(totalRevenus),
      icon: TrendingUp,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.12)',
      note: 'Toutes périodes',
    },
    {
      label: 'Total Dépenses',
      value: fmt(totalDepenses),
      icon: TrendingDown,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.12)',
      note: 'Toutes périodes',
    },
    {
      label: 'Profit Net',
      value: fmt(profit),
      icon: profitPositif ? TrendingUp : TrendingDown,
      color: profitPositif ? '#22c55e' : '#ef4444',
      bg: profitPositif ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      note: 'Toutes périodes',
    },
    {
      label: 'Clients actifs',
      value: nbClients.toString(),
      icon: Users,
      color: 'var(--text)',
      bg: 'rgba(230,237,243,0.08)',
      note: 'Au total',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
          style={{ background: '#0d1117', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
              {kpi.label}
            </p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: kpi.bg }}
            >
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
            </div>
          </div>
          <p className="text-xl font-bold font-mono" style={{ color: kpi.color }}>
            {kpi.value}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>
            {kpi.note}
          </p>
        </div>
      ))}
    </div>
  )
}
