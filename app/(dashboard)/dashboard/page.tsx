"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LabelList,
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
  Zap,
  Trophy,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data";
import {
  computeDonneesMensuelles,
  computeKpisMoisActuel,
  computeTopCategoriesDepenses,
  computeTopClients,
  computeTopProduits,
  useFactures,
  useTransactions,
} from "@/lib/store";
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

// ─── Données mock — PME africaine 12 mois (XOF) ──────────────────────────────
const MOCK_12_MOIS = [
  { mois: 'Aoû', revenus: 2_850_000, depenses: 1_420_000, benefice: 1_430_000 },
  { mois: 'Sep', revenus: 3_120_000, depenses: 1_680_000, benefice: 1_440_000 },
  { mois: 'Oct', revenus: 2_960_000, depenses: 1_540_000, benefice: 1_420_000 },
  { mois: 'Nov', revenus: 3_480_000, depenses: 1_920_000, benefice: 1_560_000 },
  { mois: 'Déc', revenus: 4_250_000, depenses: 2_100_000, benefice: 2_150_000 },
  { mois: 'Jan', revenus: 2_680_000, depenses: 1_380_000, benefice: 1_300_000 },
  { mois: 'Fév', revenus: 2_940_000, depenses: 1_560_000, benefice: 1_380_000 },
  { mois: 'Mar', revenus: 3_200_000, depenses: 1_640_000, benefice: 1_560_000 },
  { mois: 'Avr', revenus: 3_560_000, depenses: 1_780_000, benefice: 1_780_000 },
  { mois: 'Mai', revenus: 3_890_000, depenses: 1_950_000, benefice: 1_940_000 },
  { mois: 'Jun', revenus: 4_100_000, depenses: 2_050_000, benefice: 2_050_000 },
  { mois: 'Jul', revenus: 3_750_000, depenses: 1_820_000, benefice: 1_930_000 },
]

const MOCK_TOP_DEP = [
  { nom: 'Matières 1ères', montant: 820_000, couleur: '#ef4444' },
  { nom: 'Transport',      montant: 340_000, couleur: '#f59e0b' },
  { nom: 'Salaires',       montant: 280_000, couleur: '#8b5cf6' },
  { nom: 'Loyer & charges',montant: 185_000, couleur: '#3b82f6' },
  { nom: 'Marketing',      montant: 125_000, couleur: '#ec4899' },
]

export default function DashboardPage() {
  const [txList] = useTransactions();
  const [facturesList] = useFactures();
  const [mounted, setMounted] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [entrepriseConfig, setEntrepriseConfig] = useState<EntrepriseConfig>(defaultConfig);
  const [entrepriseNom, setEntrepriseNom] = useState("Mon Commerce");

  useEffect(() => {
    setMounted(true);
    // Afficher onboarding si pas encore configuré
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

  const moisActuelLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date());
  const moisActuelCourt = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(new Date());

  const kpisMoisActuel = computeKpisMoisActuel(txList);
  const donneesMensuelles = computeDonneesMensuelles(txList);
  const topCategoriesDepenses = computeTopCategoriesDepenses(txList, categories);

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

  const hasHistorique = kpisMoisActuel.revenusMoisPrecedent > 0 || kpisMoisActuel.depensesMoisPrecedent > 0;

  const kpis: KPIItem[] = [
    {
      label: "Solde total",
      value: kpisMoisActuel.solde,
      icon: Wallet,
      color: "var(--blue)",
      change: null,
    },
    {
      label: `Revenus ${moisActuelCourt}`,
      value: kpisMoisActuel.revenusMois,
      icon: TrendingUp,
      color: "var(--green)",
      change: hasHistorique ? revVariation : null,
      up: true,
    },
    {
      label: `Dépenses ${moisActuelCourt}`,
      value: kpisMoisActuel.depensesMois,
      icon: TrendingDown,
      color: "var(--red)",
      change: hasHistorique ? depVariation : null,
      up: false,
    },
    {
      label: "Bénéfice net",
      value: kpisMoisActuel.beneficeNet,
      icon: TrendingUp,
      color: "var(--amber)",
      change: hasHistorique ? benVariation : null,
      up: true,
    },
  ];

  const recentTransactions = txList.slice(0, 5);
  const topClients = computeTopClients(facturesList, 3);
  const topProduits = computeTopProduits(facturesList, 5);

  // ── Analytics avancés ──────────────────────────────────────────────────────
  const caMonth = kpisMoisActuel.revenusMois
  const tauxBenefice = caMonth > 0 ? Math.round((kpisMoisActuel.beneficeNet / caMonth) * 100) : 49
  const facturesEnAttente = facturesList.filter(f => ['en_attente', 'envoyee'].includes(f.statut))
  const montantEnAttente = facturesEnAttente.reduce((s, f) => s + f.montant, 0)
  const depensesCritiques = kpisMoisActuel.depensesMois || MOCK_TOP_DEP.reduce((s, c) => s + c.montant, 0)
  const chartData12 = donneesMensuelles.length >= 3 ? computeDonneesMensuelles(txList, 12) : MOCK_12_MOIS
  const barData = topCategoriesDepenses.length >= 2 ? topCategoriesDepenses : MOCK_TOP_DEP
  const pieRevDep = (() => {
    const rev = kpisMoisActuel.revenusMois || MOCK_12_MOIS[11].revenus
    const dep = kpisMoisActuel.depensesMois || MOCK_12_MOIS[11].depenses
    const ben = Math.max(0, rev - dep)
    return [
      { name: 'Recettes', value: rev, color: '#22d98a' },
      { name: 'Dépenses', value: dep, color: '#ef4444' },
      { name: 'Bénéfice', value: ben, color: '#f0a832' },
    ]
  })()

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
            {/* Header */}
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
              {/* Progress */}
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

            {/* Étape steps nav */}
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

            {/* Contenu étape */}
            <div className="p-6">
              {onboardingSteps[onboardingStep].fields}
            </div>

            {/* Footer */}
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
            {entrepriseNom} — {moisActuelLabel}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/vente-rapide"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "var(--navy)" }}
          >
            <Zap className="w-4 h-4" />
            Nouvelle vente
          </Link>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: "var(--green)", color: "#000" }}
          >
            <Plus className="w-4 h-4" />
            Nouvelle transaction
          </Link>
        </div>
      </div>

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

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Revenus vs Dépenses</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                12 derniers mois
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
          {!mounted ? (
            <div
              className="h-56 rounded-xl animate-pulse"
              style={{ background: "var(--bg3)" }}
            />
          ) : donneesMensuelles.length === 0 ? (
            <div
              className="h-56 rounded-xl flex items-center justify-center text-sm"
              style={{ background: "var(--bg3)", color: "var(--text2)" }}
            >
              Pas encore de données à afficher
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData12} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
          )}
        </div>

        {/* Pie chart */}
        <div
          className="p-6 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="mb-4">
            <h3 className="font-semibold">Dépenses par catégorie</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              {moisActuelLabel}
            </p>
          </div>
          {!mounted ? (
            <div className="h-48 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
          ) : topCategoriesDepenses.length === 0 ? (
            <div
              className="h-48 rounded-xl flex items-center justify-center text-sm text-center px-4"
              style={{ background: "var(--bg3)", color: "var(--text2)" }}
            >
              Pas encore de dépenses ce mois-ci
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* ── Analytics KPI cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'CA du mois',
            value: formatMontant(caMonth || MOCK_12_MOIS[11].revenus),
            sub: 'Chiffre d\'affaires',
            color: 'var(--gold)',
            icon: '💰',
          },
          {
            label: 'Taux bénéfice',
            value: `${tauxBenefice} %`,
            sub: 'Marge nette',
            color: tauxBenefice >= 30 ? 'var(--green)' : tauxBenefice >= 10 ? 'var(--amber)' : 'var(--red)',
            icon: '📈',
          },
          {
            label: 'Factures en attente',
            value: facturesEnAttente.length > 0 ? formatMontant(montantEnAttente) : '—',
            sub: `${facturesEnAttente.length} facture${facturesEnAttente.length !== 1 ? 's' : ''}`,
            color: 'var(--cyan)',
            icon: '📋',
          },
          {
            label: 'Dépenses ce mois',
            value: formatMontant(depensesCritiques),
            sub: kpisMoisActuel.depensesMois > kpisMoisActuel.revenusMois * 0.7 ? '⚠ Niveau élevé' : 'Sous contrôle',
            color: kpisMoisActuel.depensesMois > kpisMoisActuel.revenusMois * 0.7 ? 'var(--red)' : 'var(--green)',
            icon: '💸',
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: 'var(--text2)' }}>{kpi.label}</p>
              <span className="text-base">{kpi.icon}</span>
            </div>
            <p className="text-xl font-bold font-mono mb-1" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs" style={{ color: 'var(--text2)' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── BarChart top 5 catégories + PieChart Recettes/Dépenses/Bénéfice ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* BarChart horizontal — top 5 catégories dépenses */}
        <div
          className="lg:col-span-3 p-6 rounded-2xl border"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
        >
          <div className="mb-5">
            <h3 className="font-semibold">Top 5 catégories de dépenses</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Répartition mensuelle</p>
          </div>
          {!mounted ? (
            <div className="h-52 rounded-xl animate-pulse" style={{ background: 'var(--bg3)' }} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: 'var(--text2)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="nom"
                  width={110}
                  tick={{ fill: 'var(--text2)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="montant" name="Dépenses" radius={[0, 6, 6, 0]} barSize={18}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.couleur} />
                  ))}
                  <LabelList
                    dataKey="montant"
                    position="right"
                    formatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    style={{ fill: 'var(--text2)', fontSize: 10 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PieChart Recettes / Dépenses / Bénéfice net */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl border"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
        >
          <div className="mb-4">
            <h3 className="font-semibold">Vue d&apos;ensemble mensuelle</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>Recettes / Dépenses / Bénéfice</p>
          </div>
          {!mounted ? (
            <div className="h-40 rounded-xl animate-pulse" style={{ background: 'var(--bg3)' }} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={pieRevDep}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={62}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieRevDep.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => formatMontant(v)}
                    contentStyle={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border2)',
                      borderRadius: 8,
                      color: 'var(--text)',
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {pieRevDep.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span style={{ color: 'var(--text2)' }}>{item.name}</span>
                    </div>
                    <span className="font-mono font-semibold">{formatMontant(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
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
        {recentTransactions.length === 0 ? (
          <div className="text-center py-12" style={{ color: "var(--text2)" }}>
            <p className="text-sm font-medium mb-1">Aucune transaction pour le moment</p>
            <p className="text-xs">Ajoutez votre première transaction pour commencer.</p>
          </div>
        ) : (
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
        )}
      </div>

      {/* Meilleurs clients / Produits les plus vendus */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="w-4 h-4" style={{ color: "var(--gold)" }} />
              Meilleurs clients
            </h3>
            <Link href="/clients" className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
              Voir tout →
            </Link>
          </div>
          {topClients.length === 0 ? (
            <div className="text-center py-10" style={{ color: "var(--text2)" }}>
              <p className="text-sm font-medium mb-1">Pas encore de ventes</p>
              <p className="text-xs">Vos meilleurs clients apparaîtront ici.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {topClients.map((c, i) => (
                <div key={c.nom} className="flex items-center gap-4 px-6 py-3.5">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: "rgba(212,175,55,0.12)", color: "var(--gold)" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.nom}</p>
                    <p className="text-xs" style={{ color: "var(--text2)" }}>{c.nbFactures} facture{c.nbFactures !== 1 ? "s" : ""}</p>
                  </div>
                  <p className="text-sm font-bold font-mono flex-shrink-0" style={{ color: "var(--green)" }}>
                    {formatMontant(c.montant)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" style={{ color: "var(--cyan)" }} />
              Produits les plus vendus
            </h3>
            <Link href="/catalogue" className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
              Voir tout →
            </Link>
          </div>
          {topProduits.length === 0 ? (
            <div className="text-center py-10" style={{ color: "var(--text2)" }}>
              <p className="text-sm font-medium mb-1">Pas encore de ventes</p>
              <p className="text-xs">Utilisez la vente rapide pour voir apparaître vos meilleurs produits.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {topProduits.map((p) => (
                <div key={p.nom} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.nom}</p>
                    <p className="text-xs" style={{ color: "var(--text2)" }}>{p.quantite} vendu{p.quantite !== 1 ? "s" : ""}</p>
                  </div>
                  <p className="text-sm font-bold font-mono flex-shrink-0" style={{ color: "var(--cyan)" }}>
                    {formatMontant(p.montant)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
