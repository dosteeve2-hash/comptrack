'use client'

// app/(dashboard)/dashboard/page.tsx
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { transactions, kpisMoisActuel } from '@/lib/data'
import { formatMontant, formatDate, calcVariation } from '@/lib/utils'
import type { EntrepriseConfig, KPIItem } from './dashboard.types'
import { defaultConfig } from './dashboard.types'
import { DashboardOnboarding } from './DashboardOnboarding'
import { DashboardChartsRow } from './DashboardCharts'

export default function DashboardPage() {
  const [mounted, setMounted]                       = useState(false)
  const [onboardingOpen, setOnboardingOpen]         = useState(false)
  const [onboardingStep, setOnboardingStep]         = useState(0)
  const [entrepriseConfig, setEntrepriseConfig]     = useState<EntrepriseConfig>(defaultConfig)
  const [entrepriseNom, setEntrepriseNom]           = useState('Mon Commerce')

  useEffect(() => {
    setMounted(true)
    const done = localStorage.getItem('ct_onboarding_done')
    if (!done) {
      setTimeout(() => setOnboardingOpen(true), 500)
    } else {
      const nom = localStorage.getItem('ct_entreprise_nom')
      if (nom) setEntrepriseNom(nom)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('ct_onboarding_done', '1')
    localStorage.setItem('ct_entreprise_nom', entrepriseConfig.nom || 'Mon Commerce')
    setEntrepriseNom(entrepriseConfig.nom || 'Mon Commerce')
    setOnboardingOpen(false)
  }

  const kpis: KPIItem[] = [
    { label: 'Solde total',    value: kpisMoisActuel.solde,          icon: Wallet,      color: 'var(--blue)',  change: null },
    { label: 'Revenus juin',   value: kpisMoisActuel.revenusMois,    icon: TrendingUp,  color: 'var(--green)', change: calcVariation(kpisMoisActuel.revenusMois, kpisMoisActuel.revenusMoisPrecedent),  up: true  },
    { label: 'Dépenses juin',  value: kpisMoisActuel.depensesMois,   icon: TrendingDown, color: 'var(--red)',  change: calcVariation(kpisMoisActuel.depensesMois, kpisMoisActuel.depensesMoisPrecedent), up: false },
    { label: 'Bénéfice net',   value: kpisMoisActuel.beneficeNet,    icon: TrendingUp,  color: 'var(--amber)', change: calcVariation(kpisMoisActuel.beneficeNet, kpisMoisActuel.beneficeNetPrecedent),   up: true  },
  ]

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">

      {onboardingOpen && (
        <DashboardOnboarding
          step={onboardingStep}
          config={entrepriseConfig}
          onStep={setOnboardingStep}
          onConfig={(patch) => setEntrepriseConfig((p) => ({ ...p, ...patch }))}
          onClose={() => setOnboardingOpen(false)}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>{entrepriseNom} — Juin 2026</p>
        </div>
        <Link href="/transactions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'var(--green)', color: '#000' }}>
          <Plus className="w-4 h-4" /> Nouvelle transaction
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: 'var(--text2)' }}>{kpi.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${kpi.color}18` }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="text-xl font-bold font-mono mb-1">{formatMontant(kpi.value)}</p>
            {kpi.change !== null && (
              <div className="flex items-center gap-1 text-xs font-mono"
                style={{ color: kpi.up ? 'var(--green)' : 'var(--red)' }}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change > 0 ? '+' : ''}{kpi.change}% vs mois dernier
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardChartsRow mounted={mounted} />

      {/* Recent transactions */}
      <div className="rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold">Transactions récentes</h3>
          <Link href="/transactions" className="text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--green)' }}>
            Voir tout →
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: tx.type === 'revenu' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                {tx.type === 'revenu'
                  ? <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--green)' }} />
                  : <ArrowDownRight className="w-4 h-4" style={{ color: 'var(--red)' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text2)' }}>
                  {tx.categorie} · {formatDate(tx.date)}
                </p>
              </div>
              <p className="text-sm font-bold font-mono flex-shrink-0"
                style={{ color: tx.type === 'revenu' ? 'var(--green)' : 'var(--red)' }}>
                {tx.type === 'revenu' ? '+' : '-'}{formatMontant(tx.montant)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
