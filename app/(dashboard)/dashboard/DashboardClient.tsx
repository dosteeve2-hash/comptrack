"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { LucideIcon } from "lucide-react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  X,
  Building2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  donneesMensuelles,
  transactions,
  topCategoriesDepenses,
  kpisMoisActuel,
} from "@/lib/data";
import { formatMontant, formatDate, calcVariation } from "@/lib/utils";

// ─── Types onboarding ─────────────────────────────────────────────────────────

interface EntrepriseConfig {
  nom: string;
  secteur: string;
  pays: string;
  devise: string;
  type: string;
}

const defaultConfig: EntrepriseConfig = {
  nom: "",
  secteur: "",
  pays: "Burkina Faso",
  devise: "FCFA",
  type: "SARL",
};

const secteurs = [
  "Commerce général", "Textile / Mode", "Restauration / Alimentation",
  "BTP / Construction", "Services / Conseil", "Tech / Numérique",
  "Agriculture / Élevage", "Transport / Logistique", "Santé / Pharma", "Autre",
];

const pays = [
  "Burkina Faso", "Côte d'Ivoire", "Sénégal", "Mali", "Niger",
  "Guinée", "Togo", "Bénin", "Cameroun", "Ghana", "Nigeria", "Autre",
];

// ─── Tooltip custom ───────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
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

interface DashboardClientProps {
  monthlySummary?: React.ReactNode;
  revenueChart?: React.ReactNode;
}

export default function DashboardClient({ monthlySummary, revenueChart }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [entrepriseConfig, setEntrepriseConfig] = useState<EntrepriseConfig>(defaultConfig);
  const [entrepriseNom, setEntrepriseNom] = useState("Mon Commerce");

  useEffect(() => {
    setMounted(true);
    const done = localStorage.getItem("ct_onboarding_done");
    if (!done) {
      setTimeout(() => setOnboardingOpen(true), 500);
    } else {
      const nom = localStorage.getItem("ct_entreprise_nom");
      if (nom) setEntrepriseNom(nom);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("ct_onboarding_done", "1");
    localStorage.setItem("ct_entreprise_nom", entrepriseConfig.nom || "Mon Commerce");
    setEntrepriseNom(entrepriseConfig.nom || "Mon Commerce");
    setOnboardingOpen(false);
  };

  const onboardingSteps = [
    {
      titre: "Votre entreprise",
      desc: "Comment s'appelle votre entreprise ?",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de l&apos;entreprise *</label>
            <input
              type="text"
              value={entrepriseConfig.nom}
              onChange={(e) => setEntrepriseConfig(p => ({ ...p, nom: e.target.value }))}
              placeholder="Ex: Boutique Aminata SARL"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type d&apos;entreprise</label>
            <div className="flex flex-wrap gap-2">
              {["Auto-entrepreneur", "SARL", "SAS", "SA", "GIE", "Autre"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEntrepriseConfig(p => ({ ...p, type: t }))}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{
                    background: entrepriseConfig.type === t ? "rgba(34,197,94,0.15)" : "var(--bg3)",
                    border: `1px solid ${entrepriseConfig.type === t ? "var(--green)" : "var(--border2)"}`,
                    color: entrepriseConfig.type === t ? "var(--green)" : "var(--text2)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      titre: "Votre secteur",
      desc: "Dans quel secteur exercez-vous ?",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {secteurs.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setEntrepriseConfig(p => ({ ...p, secteur: s }))}
                className="px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                style={{
                  background: entrepriseConfig.secteur === s ? "rgba(34,197,94,0.12)" : "var(--bg3)",
                  border: `1px solid ${entrepriseConfig.secteur === s ? "var(--green)" : "var(--border)"}`,
                  color: entrepriseConfig.secteur === s ? "var(--green)" : "var(--text2)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      titre: "Pays & Devise",
      desc: "Où opérez-vous principalement ?",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pays</label>
            <div className="grid grid-cols-2 gap-2">
              {pays.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEntrepriseConfig(prev => ({ ...prev, pays: p }))}
                  className="px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: entrepriseConfig.pays === p ? "rgba(34,197,94,0.12)" : "var(--bg3)",
                    border: `1px solid ${entrepriseConfig.pays === p ? "var(--green)" : "var(--border)"}`,
                    color: entrepriseConfig.pays === p ? "var(--green)" : "var(--text2)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Devise principale</label>
            <div className="flex flex-wrap gap-2">
              {["FCFA", "EUR", "USD", "GHS", "NGN", "KES"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setEntrepriseConfig(p => ({ ...p, devise: d }))}
                  className="px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all"
                  style={{
                    background: entrepriseConfig.devise === d ? "rgba(34,197,94,0.15)" : "var(--bg3)",
                    border: `1px solid ${entrepriseConfig.devise === d ? "var(--green)" : "var(--border2)"}`,
                    color: entrepriseConfig.devise === d ? "var(--green)" : "var(--text2)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const revVariation = calcVariation(
    kpisMoisActuel.revenusMois,
    kpisMoisActuel.revenusMoisPrecedent
  );
  const depVariation = calcVariation(
    kpisMoisActuel.depensesMois,
    kpisMoisActuel.depensesMoisPrecedent
  );
  const benVariation = calcVariation(
    kpisMoisActuel.beneficeNet,
    kpisMoisActuel.beneficeNetPrecedent
  );

  interface KPIItem {
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
    change: number | null;
    up?: boolean;
  }

  const kpis: KPIItem[] = [
    {
      label: "Solde total",
      value: kpisMoisActuel.solde,
      icon: Wallet,
      color: "var(--blue)",
      change: null,
    },
    {
      label: "Revenus juin",
      value: kpisMoisActuel.revenusMois,
      icon: TrendingUp,
      color: "var(--green)",
      change: revVariation,
      up: true,
    },
    {
      label: "Dépenses juin",
      value: kpisMoisActuel.depensesMois,
      icon: TrendingDown,
      color: "var(--red)",
      change: depVariation,
      up: false,
    },
    {
      label: "Bénéfice net",
      value: kpisMoisActuel.beneficeNet,
      icon: TrendingUp,
      color: "var(--amber)",
      change: benVariation,
      up: true,
    },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ─── Modal Onboarding ─────────────────────────────────────────────── */}
      {onboardingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden animate-slide-up"
            style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
          >
            <div
              className="px-6 py-5 border-b"
              style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.06))" }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" style={{ color: "var(--green)" }} />
                  <span className="font-bold">Configurons votre entreprise</span>
                </div>
                <button
                  onClick={() => setOnboardingOpen(false)}
                  className="p-1.5 rounded-lg hover:opacity-70"
                  style={{ color: "var(--text2)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs" style={{ color: "var(--text2)" }}>
                Étape {onboardingStep + 1} sur {onboardingSteps.length} — {onboardingSteps[onboardingStep].desc}
              </p>
              <div className="mt-3 h-1.5 rounded-full" style={{ background: "var(--bg3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%`,
                    background: "var(--green)",
                  }}
                />
              </div>
            </div>
            <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
              {onboardingSteps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setOnboardingStep(i)}
                  className="flex-1 px-3 py-2.5 text-xs font-medium transition-colors"
                  style={{
                    color: onboardingStep === i ? "var(--green)" : i < onboardingStep ? "var(--text2)" : "var(--text3)",
                    borderBottom: onboardingStep === i ? "2px solid var(--green)" : "2px solid transparent",
                  }}
                >
                  {i < onboardingStep ? "✓ " : `${i + 1}. `}{step.titre}
                </button>
              ))}
            </div>
            <div className="p-6">
              {onboardingSteps[onboardingStep].fields}
            </div>
            <div
              className="px-6 py-4 border-t flex items-center justify-between"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setOnboardingStep(p => Math.max(0, p - 1))}
                disabled={onboardingStep === 0}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70 disabled:opacity-30"
                style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
              >
                ← Précédent
              </button>
              {onboardingStep < onboardingSteps.length - 1 ? (
                <button
                  onClick={() => setOnboardingStep(p => p + 1)}
                  disabled={onboardingStep === 0 && !entrepriseConfig.nom.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
                  style={{ background: "var(--green)", color: "#000" }}
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleOnboardingComplete}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: "var(--green)", color: "#000" }}
                >
                  Commencer →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {entrepriseNom} — Juin 2026
          </p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--green)", color: "#000" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle transaction
        </Link>
      </div>

      {/* ─── Widget Résumé du mois (Server Component) ────────────────────── */}
      {monthlySummary}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>
                {kpi.label}
              </p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${kpi.color}18` }}
              >
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="text-xl font-bold font-mono mb-1">{formatMontant(kpi.value)}</p>
            {kpi.change !== null && (
              <div
                className="flex items-center gap-1 text-xs font-mono"
                style={{ color: kpi.up ? "var(--green)" : "var(--red)" }}
              >
                {kpi.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {kpi.change > 0 ? "+" : ""}
                {kpi.change}% vs mois dernier
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Évolution mensuelle (Server Component via Suspense) ──────────── */}
      {revenueChart && (
        <div
          className="p-6 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Évolution mensuelle</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                Revenus vs Dépenses — 6 derniers mois
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#22c55e" }}
                />
                Revenus
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#ef4444" }}
                />
                Dépenses
              </span>
            </div>
          </div>
          {revenueChart}
        </div>
      )}

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 p-6 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Revenus vs Dépenses</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                6 derniers mois
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
                Revenus
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--red)" }} />
                Dépenses
              </span>
            </div>
          </div>
          {mounted ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={donneesMensuelles} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="revenus"
                  name="Revenus"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#gradGreen)"
                />
                <Area
                  type="monotone"
                  dataKey="depenses"
                  name="Dépenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#gradRed)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="h-56 rounded-xl animate-pulse"
              style={{ background: "var(--bg3)" }}
            />
          )}
        </div>

        <div
          className="p-6 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="mb-4">
            <h3 className="font-semibold">Dépenses par catégorie</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              Juin 2026
            </p>
          </div>
          {mounted ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={topCategoriesDepenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="montant"
                    strokeWidth={0}
                  >
                    {topCategoriesDepenses.map((entry, i) => (
                      <Cell key={i} fill={entry.couleur} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {topCategoriesDepenses.slice(0, 4).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: cat.couleur }}
                      />
                      <span style={{ color: "var(--text2)" }}>{cat.nom}</span>
                    </div>
                    <span className="font-mono font-medium">
                      {formatMontant(cat.montant)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div
        className="rounded-2xl border"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Transactions récentes</h3>
          <Link
            href="/transactions"
            className="text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--green)" }}
          >
            Voir tout →
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: tx.type === "revenu" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                }}
              >
                {tx.type === "revenu" ? (
                  <ArrowUpRight className="w-4 h-4" style={{ color: "var(--green)" }} />
                ) : (
                  <ArrowDownRight className="w-4 h-4" style={{ color: "var(--red)" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description}</p>
                <p className="text-xs truncate" style={{ color: "var(--text2)" }}>
                  {tx.categorie} · {formatDate(tx.date)}
                </p>
              </div>
              <p
                className="text-sm font-bold font-mono flex-shrink-0"
                style={{ color: tx.type === "revenu" ? "var(--green)" : "var(--red)" }}
              >
                {tx.type === "revenu" ? "+" : "-"}
                {formatMontant(tx.montant)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
