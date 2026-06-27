"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { donneesMensuelles, topCategoriesDepenses } from "@/lib/data";
import { formatMontant } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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
          {entry.name} : {formatMontant(entry.value)}
        </p>
      ))}
    </div>
  );
};

type Periode = "mensuel" | "trimestriel" | "annuel";

export default function RapportsPage() {
  const [periode, setPeriode] = useState<Periode>("mensuel");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalRevenus = donneesMensuelles.reduce((s, m) => s + m.revenus, 0);
  const totalDepenses = donneesMensuelles.reduce((s, m) => s + m.depenses, 0);
  const beneficeNet = totalRevenus - totalDepenses;
  const margeNette = Math.round((beneficeNet / totalRevenus) * 100);

  const donneesTrimestre = [
    {
      mois: "T1 (Jan–Mar)",
      revenus: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.revenus, 0),
      depenses: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.depenses, 0),
      benefice: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.benefice, 0),
    },
    {
      mois: "T2 (Avr–Jun)",
      revenus: donneesMensuelles.slice(3, 6).reduce((s, m) => s + m.revenus, 0),
      depenses: donneesMensuelles.slice(3, 6).reduce((s, m) => s + m.depenses, 0),
      benefice: donneesMensuelles.slice(3, 6).reduce((s, m) => s + m.benefice, 0),
    },
  ];

  const donneesAffichees =
    periode === "mensuel"
      ? donneesMensuelles
      : periode === "trimestriel"
      ? donneesTrimestre
      : [
          {
            mois: "Année 2026",
            revenus: totalRevenus,
            depenses: totalDepenses,
            benefice: beneficeNet,
          },
        ];

  const tableData =
    periode === "mensuel"
      ? donneesMensuelles
      : periode === "trimestriel"
      ? donneesTrimestre
      : donneesAffichees;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            Analyse de votre performance financière
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 no-print"
          style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
        >
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Period selector */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
        {(["mensuel", "trimestriel", "annuel"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriode(p)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              background: periode === p ? "var(--bg3)" : "transparent",
              color: periode === p ? "var(--text)" : "var(--text2)",
              border: periode === p ? "1px solid var(--border2)" : "1px solid transparent",
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenus", value: totalRevenus, color: "var(--green)" },
          { label: "Total Dépenses", value: totalDepenses, color: "var(--red)" },
          { label: "Bénéfice net", value: beneficeNet, color: "var(--blue)" },
          { label: "Marge nette", value: null, pct: margeNette, color: "var(--amber)" },
        ].map((s, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>
              {s.label}
            </p>
            <p className="font-bold font-mono text-lg" style={{ color: s.color }}>
              {s.value !== null ? formatMontant(s.value) : `${s.pct}%`}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Revenus vs Dépenses</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                Vue {periode}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded" style={{ background: "var(--green)" }} />
                Revenus
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded" style={{ background: "var(--red)" }} />
                Dépenses
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded" style={{ background: "var(--blue)" }} />
                Bénéfice
              </span>
            </div>
          </div>
          {mounted ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={donneesAffichees} barGap={4} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenus" name="Revenus" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="depenses" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benefice" name="Bénéfice" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
          )}
        </div>

        {/* Pie chart dépenses */}
        <div
          className="p-6 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="mb-4">
            <h3 className="font-semibold">Répartition dépenses</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              Par catégorie
            </p>
          </div>
          {mounted ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={topCategoriesDepenses}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    dataKey="montant"
                    strokeWidth={0}
                  >
                    {topCategoriesDepenses.map((entry, i) => (
                      <Cell key={i} fill={entry.couleur} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value: string) => (
                      <span style={{ color: "var(--text2)", fontSize: 11 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="h-48 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
          )}
        </div>
      </div>

      {/* Summary table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Tableau récapitulatif</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-xs font-medium uppercase tracking-wider"
                style={{ borderColor: "var(--border)", color: "var(--text2)" }}
              >
                <th className="text-left px-6 py-3">Période</th>
                <th className="text-right px-6 py-3">Revenus</th>
                <th className="text-right px-6 py-3">Dépenses</th>
                <th className="text-right px-6 py-3">Bénéfice</th>
                <th className="text-right px-6 py-3">Marge</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {tableData.map((row, i) => {
                const marge = Math.round((row.benefice / row.revenus) * 100);
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium">{row.mois}</td>
                    <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--green)" }}>
                      {formatMontant(row.revenus)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--red)" }}>
                      {formatMontant(row.depenses)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold font-mono" style={{ color: "var(--blue)" }}>
                      {formatMontant(row.benefice)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs" style={{ color: "var(--amber)" }}>
                      {marge}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr
                className="border-t font-bold"
                style={{ borderColor: "var(--border2)", background: "var(--bg3)" }}
              >
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--green)" }}>
                  {formatMontant(totalRevenus)}
                </td>
                <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--red)" }}>
                  {formatMontant(totalDepenses)}
                </td>
                <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--blue)" }}>
                  {formatMontant(beneficeNet)}
                </td>
                <td className="px-6 py-4 text-right font-mono text-xs" style={{ color: "var(--amber)" }}>
                  {margeNette}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
