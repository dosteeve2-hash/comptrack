'use client'

// app/(dashboard)/tresorerie/TresorerieChart.tsx
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { Building2 } from 'lucide-react'
import type { CompteBancaire, DonneeJournaliere } from './tresorerie.data'
import { fmt } from './tresorerie.data'

interface TooltipPayloadItem { value: number }
interface TooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="p-3 rounded-xl text-xs shadow-lg"
      style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
      <p className="font-semibold mb-1">{label}</p>
      <p className="font-mono" style={{ color: 'var(--cyan)' }}>Solde : {fmt(payload[0].value)}</p>
    </div>
  )
}

export function ComptesBancairesRow({
  soldeTotal,
  comptes,
}: {
  soldeTotal: number
  comptes: CompteBancaire[]
}) {
  const soldePositif = soldeTotal >= 0
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Solde global */}
      <div className="md:col-span-1 p-6 rounded-2xl border flex flex-col justify-center"
        style={{
          background: soldePositif ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
          borderColor: soldePositif ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
        }}>
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text2)' }}>Solde global</p>
        <p className="text-3xl font-bold font-mono" style={{ color: soldePositif ? 'var(--green)' : 'var(--red)' }}>
          {fmt(soldeTotal)}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Tous comptes confondus</p>
      </div>
      {/* Comptes */}
      {comptes.map((c) => (
        <div key={c.id} className="p-5 rounded-2xl border flex flex-col gap-2"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: c.couleur }} />
            <span className="text-xs font-semibold truncate" style={{ color: c.couleur }}>{c.banque}</span>
          </div>
          <p className="text-xl font-bold font-mono" style={{ color: c.solde >= 0 ? 'var(--text)' : 'var(--red)' }}>
            {fmt(c.solde)}
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--text3)' }}>{c.numero}</p>
        </div>
      ))}
    </div>
  )
}

export function TresorerieAreaChart({
  mounted,
  data,
}: {
  mounted: boolean
  data: DonneeJournaliere[]
}) {
  return (
    <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold">Évolution du solde</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>90 derniers jours</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--cyan)' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--cyan)' }} />
          Solde quotidien
        </span>
      </div>
      {mounted ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00BCD4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: 'var(--text2)', fontSize: 10 }} axisLine={false} tickLine={false} interval={14} />
            <YAxis tick={{ fill: 'var(--text2)', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="solde" stroke="#00BCD4" strokeWidth={2} fill="url(#gradCyan)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-56 rounded-xl animate-pulse" style={{ background: 'var(--bg3)' }} />
      )}
    </div>
  )
}
