'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, Target, BarChart2 } from 'lucide-react'

type PrevData = { mois: string; revenus: number; depenses: number; benefice: number }
type Props = {
  data: {
    previsions: PrevData[]
    stats: { croissance: string; margeNette: string; objectif: string }
  }
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const STATS = [
  { label: 'Croissance prévue', value: '+18%', icon: TrendingUp, color: 'text-[#D4AF37]' },
  { label: 'Marge nette cible', value: '38%', icon: BarChart2, color: 'text-[#00BCD4]' },
  { label: 'Objectif annuel', value: '72%', icon: Target, color: 'text-[#D4AF37]' },
]

export default function PrevisionsClient({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Prévisions financières 2026</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring' as const }}
            className="bg-[#0A1628] border border-white/10 rounded-xl p-4 flex items-center gap-4"
          >
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0A1628] border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-white font-semibold mb-4">Revenus vs Dépenses vs Bénéfices</h2>
        {mounted ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={data.previsions}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="mois" tick={{ fill: '#ffffff60', fontSize: 12 }} />
              <YAxis
                tick={{ fill: '#ffffff60', fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1628',
                  border: '1px solid #ffffff20',
                  borderRadius: 8,
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(v: number) => fmt(v)}
              />
              <Legend wrapperStyle={{ color: '#ffffff80' }} />
              <Area
                type="monotone"
                dataKey="revenus"
                name="Revenus"
                stroke="#D4AF37"
                fill="url(#gRev)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="depenses"
                name="Dépenses"
                stroke="#ef4444"
                fill="url(#gDep)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="benefice"
                name="Bénéfice"
                stroke="#00BCD4"
                fill="url(#gBen)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-white/40">
            Chargement...
          </div>
        )}
      </motion.div>
    </div>
  )
}
