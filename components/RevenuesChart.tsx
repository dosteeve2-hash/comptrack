"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  { mois: "Avr", revenus: 1200000, depenses: 850000 },
  { mois: "Mai", revenus: 980000, depenses: 720000 },
  { mois: "Jun", revenus: 1450000, depenses: 1100000 },
  { mois: "Jul", revenus: 1100000, depenses: 890000 },
  { mois: "Aoû", revenus: 1320000, depenses: 960000 },
  { mois: "Sep", revenus: 1580000, depenses: 1150000 },
]

export function RevenuesChart() {
  return (
    <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "var(--border)" }}>
      <h2 className="text-lg font-semibold text-white mb-4">
        Revenus vs Dépenses — 6 mois
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
          <XAxis dataKey="mois" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            formatter={(v: number) => [`${v.toLocaleString("fr-FR")} FCFA`]}
          />
          <Legend
            wrapperStyle={{ color: "#9ca3af", fontSize: 12 }}
          />
          <Bar dataKey="revenus" name="Revenus" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="depenses" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
