'use client'

// app/(dashboard)/dashboard/DashboardCharts.tsx
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { donneesMensuelles, topCategoriesDepenses } from '@/lib/data'
import { formatMontant } from '@/lib/utils'

interface TooltipPayloadItem { name: string; value: number; color: string }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="p-3 rounded-xl text-xs shadow-lg"
      style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="mb-0.5" style={{ color: entry.color }}>
          {entry.name} : {formatMontant(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function DashboardAreaChart() {
  return (
    <div className="lg:col-span-2 p-6 rounded-2xl border"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Revenus vs Dépenses</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>6 derniers mois</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[{ label: 'Revenus', color: 'var(--green)' }, { label: 'Dépenses', color: 'var(--red)' }].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={donneesMensuelles} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="mois" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text2)', fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#22c55e" strokeWidth={2} fill="url(#gradGreen)" />
          <Area type="monotone" dataKey="depenses" name="Dépenses" stroke="#ef4444" strokeWidth={2} fill="url(#gradRed)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DashboardPieChart() {
  return (
    <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="mb-4">
        <h3 className="font-semibold">Dépenses par catégorie</h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Juin 2026</p>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie data={topCategoriesDepenses} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
            dataKey="montant" strokeWidth={0}>
            {topCategoriesDepenses.map((entry, i) => <Cell key={i} fill={entry.couleur} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-3">
        {topCategoriesDepenses.slice(0, 4).map((cat, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.couleur }} />
              <span style={{ color: 'var(--text2)' }}>{cat.nom}</span>
            </div>
            <span className="font-mono font-medium">{formatMontant(cat.montant)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardChartsRow({ mounted }: { mounted: boolean }) {
  const Skeleton = () => <div className="h-56 rounded-xl animate-pulse" style={{ background: 'var(--bg3)' }} />
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {mounted ? <DashboardAreaChart /> : (
        <div className="lg:col-span-2 p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <Skeleton />
        </div>
      )}
      {mounted ? <DashboardPieChart /> : (
        <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="h-48 rounded-xl animate-pulse" style={{ background: 'var(--bg3)' }} />
        </div>
      )}
    </div>
  )
}
