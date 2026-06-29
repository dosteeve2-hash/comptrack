"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface MonthlyData {
  mois: string;
  revenus: number;
  depenses: number;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function formatFcfa(value: number): string {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + " FCFA"
  );
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="p-3 rounded-xl text-xs shadow-lg"
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        color: "var(--text)",
      }}
    >
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="mb-0.5" style={{ color: entry.color }}>
          {entry.name} : {formatFcfa(entry.value)}
        </p>
      ))}
    </div>
  );
}

interface RevenueChartBarProps {
  data: MonthlyData[];
}

export default function RevenueChartBar({ data }: RevenueChartBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-60 rounded-xl animate-pulse"
        style={{ background: "var(--bg3)" }}
      />
    );
  }

  const hasData = data.some((d) => d.revenus > 0 || d.depenses > 0);

  if (!hasData) {
    return (
      <div
        className="h-60 rounded-xl flex items-center justify-center"
        style={{ background: "var(--bg3)" }}
      >
        <p className="text-sm" style={{ color: "var(--text3)" }}>
          Aucune donnée pour les 6 derniers mois
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        barGap={4}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="mois"
          tick={{ fill: "var(--text2)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text2)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar
          dataKey="revenus"
          name="Revenus"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="depenses"
          name="Dépenses"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
