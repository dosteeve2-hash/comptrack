"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
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
      style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
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

interface PosteBudgetaire {
  categorie: string;
  budgetAlloue: number;
  realise: number;
}

const postesBudgetaires: PosteBudgetaire[] = [
  { categorie: "Salaires",              budgetAlloue: 4_500_000, realise: 4_200_000 },
  { categorie: "Loyer & Charges",       budgetAlloue: 1_800_000, realise: 1_800_000 },
  { categorie: "Marketing",             budgetAlloue:   900_000, realise:   650_000 },
  { categorie: "Transport & Livraison", budgetAlloue:   750_000, realise:   610_000 },
  { categorie: "Fournitures",           budgetAlloue:   600_000, realise:   280_000 },
  { categorie: "Maintenance",           budgetAlloue:   400_000, realise:   190_000 },
  { categorie: "Impôts & Taxes",        budgetAlloue: 1_200_000, realise: 1_150_000 },
  { categorie: "Fonds de Roulement",    budgetAlloue: 4_850_000, realise:   320_000 },
];

function getStatut(pctExecution: number): { label: string; emoji: string; color: string } {
  if (pctExecution > 80) return { label: "En ligne", emoji: "🟢", color: "var(--green)" };
  if (pctExecution >= 50) return { label: "Attention", emoji: "🟠", color: "var(--amber)" };
  return { label: "Critique", emoji: "🔴", color: "var(--red)" };
}

const donneesBudgetMensuel = [
  { mois: "Jan · Revenus",   budgetPrevu: 1_100_000, realise:   980_000 },
  { mois: "Jan · Dépenses",  budgetPrevu:   750_000, realise:   720_000 },
  { mois: "Fév · Revenus",   budgetPrevu: 1_150_000, realise: 1_050_000 },
  { mois: "Fév · Dépenses",  budgetPrevu:   780_000, realise:   760_000 },
  { mois: "Mar · Revenus",   budgetPrevu: 1_200_000, realise: 1_180_000 },
  { mois: "Mar · Dépenses",  budgetPrevu:   800_000, realise:   810_000 },
  { mois: "Avr · Revenus",   budgetPrevu: 1_250_000, realise: 1_300_000 },
  { mois: "Avr · Dépenses",  budgetPrevu:   820_000, realise:   790_000 },
  { mois: "Mai · Revenus",   budgetPrevu: 1_300_000, realise: 1_250_000 },
  { mois: "Mai · Dépenses",  budgetPrevu:   850_000, realise:   870_000 },
  { mois: "Jun · Revenus",   budgetPrevu: 1_350_000, realise: 1_420_000 },
  { mois: "Jun · Dépenses",  budgetPrevu:   880_000, realise:   860_000 },
];

const donneesBeneficePrevision = [
  { mois: "Jan", prevision: 350_000, reel: 260_000 },
  { mois: "Fév", prevision: 370_000, reel: 290_000 },
  { mois: "Mar", prevision: 400_000, reel: 370_000 },
  { mois: "Avr", prevision: 430_000, reel: 510_000 },
  { mois: "Mai", prevision: 450_000, reel: 380_000 },
  { mois: "Jun", prevision: 470_000, reel: 560_000 },
  { mois: "Jul", prevision: 490_000, reel: 430_000 },
  { mois: "Aoû", prevision: 510_000, reel: 470_000 },
  { mois: "Sep", prevision: 530_000, reel: 480_000 },
  { mois: "Oct", prevision: 550_000, reel: 520_000 },
  { mois: "Nov", prevision: 580_000, reel: 540_000 },
  { mois: "Déc", prevision: 610_000, reel: 590_000 },
];

const BUDGET_ANNUEL_TOTAL = 15_000_000;
const DEPENSES_PREVUES = 9_200_000;
const REVENUS_PREVISIONNELS = 14_500_000;
const TAUX_EXECUTION = 67;

export default function PrevisionsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const anneeActuelle = new Date().getFullYear();

  const handleExportPDF = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const W = 210;
    const margin = 15;
    let y = 0;

    // ── Header Navy ──
    doc.setFillColor(10, 22, 40);
    doc.rect(0, 0, W, 48, "F");
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 48, W, 2.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55);
    doc.text("PRÉVISIONS BUDGÉTAIRES", W / 2, 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(235, 244, 255);
    doc.text(`Exercice ${anneeActuelle}`, W / 2, 31, { align: "center" });
    doc.setTextColor(139, 171, 201);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} · CompTrack`, W / 2, 39, { align: "center" });

    y = 62;

    // ── KPIs ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(212, 175, 55);
    doc.text("INDICATEURS CLÉS", margin, y);
    y += 2;
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, y, 40, 0.5, "F");
    y += 8;

    const kpis = [
      { label: "Budget annuel total",     value: formatMontant(BUDGET_ANNUEL_TOTAL) },
      { label: "Dépenses prévues",        value: formatMontant(DEPENSES_PREVUES) },
      { label: "Revenus prévisionnels",   value: formatMontant(REVENUS_PREVISIONNELS) },
      { label: "Taux d'exécution",        value: `${TAUX_EXECUTION}%` },
    ];

    kpis.forEach((kpi, i) => {
      const col = i % 2;
      const colX = margin + col * (W / 2 - margin / 2 + 2);
      const rowY = y + Math.floor(i / 2) * 24;

      doc.setFillColor(14, 31, 61);
      doc.roundedRect(colX, rowY - 5, W / 2 - margin - 4, 20, 2, 2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(139, 171, 201);
      doc.text(kpi.label, colX + 5, rowY + 1);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(235, 244, 255);
      doc.text(kpi.value, colX + 5, rowY + 11);
    });

    y += 56;

    // ── Tableau postes budgétaires ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(212, 175, 55);
    doc.text("POSTES BUDGÉTAIRES", margin, y);
    y += 2;
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, y, 45, 0.5, "F");
    y += 8;

    doc.setFillColor(10, 22, 40);
    doc.rect(margin, y, W - 2 * margin, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(212, 175, 55);
    doc.text("CATÉGORIE",  margin + 5, y + 5.5);
    doc.text("ALLOUÉ",     105, y + 5.5, { align: "right" });
    doc.text("RÉALISÉ",    145, y + 5.5, { align: "right" });
    doc.text("% EXÉC.",    W - margin - 3, y + 5.5, { align: "right" });
    y += 10;

    postesBudgetaires.forEach((poste, i) => {
      const pctExecution = poste.budgetAlloue > 0 ? Math.round((poste.realise / poste.budgetAlloue) * 100) : 0;
      if (i % 2 === 0) {
        doc.setFillColor(14, 31, 61);
        doc.rect(margin, y - 3, W - 2 * margin, 8, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(235, 244, 255);
      doc.text(poste.categorie, margin + 5, y + 2.5);
      doc.setTextColor(139, 171, 201);
      doc.text(formatMontant(poste.budgetAlloue), 105, y + 2.5, { align: "right" });
      doc.text(formatMontant(poste.realise), 145, y + 2.5, { align: "right" });
      doc.setTextColor(pctExecution > 80 ? 34 : pctExecution >= 50 ? 245 : 239, pctExecution > 80 ? 197 : pctExecution >= 50 ? 158 : 68, pctExecution > 80 ? 94 : pctExecution >= 50 ? 11 : 68);
      doc.text(`${pctExecution}%`, W - margin - 3, y + 2.5, { align: "right" });
      y += 8;
    });

    // ── Footer ──
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(139, 171, 201);
    doc.text(`Rapport généré automatiquement par CompTrack · ${new Date().toLocaleDateString("fr-FR")}`, W / 2, 285, { align: "center" });
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 288, W, 2, "F");

    doc.save("previsions-budgetaires.pdf");
  }, [anneeActuelle]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prévisions Budgétaires</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            Exercice {anneeActuelle}
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 no-print"
          style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
        >
          <Download className="w-4 h-4" />
          Exporter PDF
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Budget Annuel Total",   value: formatMontant(BUDGET_ANNUEL_TOTAL) },
          { label: "Dépenses Prévues",      value: formatMontant(DEPENSES_PREVUES) },
          { label: "Revenus Prévisionnels", value: formatMontant(REVENUS_PREVISIONNELS) },
          { label: "Taux d'Exécution",      value: `${TAUX_EXECUTION}%` },
        ].map((kpi, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border"
            style={{ background: "var(--navy)", borderColor: "var(--border)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>{kpi.label}</p>
            <p className="font-bold font-mono text-lg" style={{ color: "var(--gold)" }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* BarChart — Budget Prévu vs Réalisé */}
      <div className="p-6 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Budget Prévu vs Réalisé</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              Revenus et dépenses — Jan à Jun {anneeActuelle}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded" style={{ background: "var(--navy)", border: "1px solid var(--border2)" }} />
              Budget Prévu
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded" style={{ background: "var(--gold)" }} />
              Réalisé
            </span>
          </div>
        </div>
        {!mounted ? (
          <div className="h-72 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donneesBudgetMensuel} barGap={4} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="mois"
                tick={{ fill: "var(--text2)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "var(--text2)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budgetPrevu" name="Budget Prévu" fill="#0A1628" stroke="#2a4a72" radius={[4, 4, 0, 0]} />
              <Bar dataKey="realise" name="Réalisé" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* LineChart — bénéfice net prévision vs réel */}
      <div className="p-6 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Bénéfice Net — Prévision vs Réel</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              12 mois — {anneeActuelle}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#00D4FF" }} />
              Prévision
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#D4AF37" }} />
              Réel
            </span>
          </div>
        </div>
        {!mounted ? (
          <div className="h-48 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={donneesBeneficePrevision} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fill: "var(--text2)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "var(--text2)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) => <span style={{ color: "var(--text2)", fontSize: 11 }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="prevision"
                name="Prévision"
                stroke="#00D4FF"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                dot={{ fill: "#00D4FF", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="reel"
                name="Réel"
                stroke="#D4AF37"
                strokeWidth={2.5}
                dot={{ fill: "#D4AF37", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table — Postes Budgétaires */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Postes Budgétaires</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
            Suivi de l&apos;exécution par catégorie
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-xs font-medium uppercase tracking-wider"
                style={{ borderColor: "var(--border)", color: "var(--text2)" }}
              >
                <th className="text-left px-6 py-3">Catégorie</th>
                <th className="text-right px-6 py-3">Budget Alloué</th>
                <th className="text-right px-6 py-3">Réalisé</th>
                <th className="text-right px-6 py-3">Écart</th>
                <th className="text-right px-6 py-3">% Exécution</th>
                <th className="text-left px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {postesBudgetaires.map((poste, i) => {
                const ecart = poste.budgetAlloue - poste.realise;
                const pctExecution = poste.budgetAlloue > 0 ? Math.round((poste.realise / poste.budgetAlloue) * 100) : 0;
                const statut = getStatut(pctExecution);
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium">{poste.categorie}</td>
                    <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--text2)" }}>
                      {formatMontant(poste.budgetAlloue)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--gold)" }}>
                      {formatMontant(poste.realise)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono" style={{ color: ecart >= 0 ? "var(--green)" : "var(--red)" }}>
                      {ecart >= 0 ? "+" : ""}{formatMontant(ecart)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">{pctExecution}%</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: `${statut.color}1a`, color: statut.color }}
                      >
                        {statut.emoji} {statut.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t font-bold" style={{ borderColor: "var(--border2)", background: "var(--bg3)" }}>
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--text2)" }}>
                  {formatMontant(postesBudgetaires.reduce((s, p) => s + p.budgetAlloue, 0))}
                </td>
                <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--gold)" }}>
                  {formatMontant(postesBudgetaires.reduce((s, p) => s + p.realise, 0))}
                </td>
                <td className="px-6 py-4 text-right font-mono" style={{ color: "var(--green)" }}>
                  {formatMontant(postesBudgetaires.reduce((s, p) => s + (p.budgetAlloue - p.realise), 0))}
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {Math.round(
                    (postesBudgetaires.reduce((s, p) => s + p.realise, 0) /
                      postesBudgetaires.reduce((s, p) => s + p.budgetAlloue, 0)) *
                      100
                  )}%
                </td>
                <td className="px-6 py-4" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
