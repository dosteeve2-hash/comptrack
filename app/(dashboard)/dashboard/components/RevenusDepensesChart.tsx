"use client"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Données mockées (les vraies viendront quand il y aura assez de data)
const DATA_MOCK = [
  { mois: "Fév", revenus: 0, depenses: 0 },
  { mois: "Mar", revenus: 0, depenses: 0 },
  { mois: "Avr", revenus: 0, depenses: 0 },
  { mois: "Mai", revenus: 0, depenses: 0 },
  { mois: "Juin", revenus: 0, depenses: 0 },
  { mois: "Juil", revenus: 0, depenses: 0 },
]

export function RevenusDepensesChart({ data = DATA_MOCK }: { data?: typeof DATA_MOCK }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="h-[360px] rounded-xl animate-pulse"
        style={{ background: "var(--bg3)" }}
      />
    )
  }

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Revenus vs Dépenses (6 mois)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis dataKey="mois" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }}
            formatter={(value: number) => [`${new Intl.NumberFormat("fr-FR").format(value)} FCFA`]}
          />
          <Legend />
          <Bar dataKey="revenus" name="Revenus" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="depenses" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
