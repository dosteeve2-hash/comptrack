"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Gauge, ArrowRight, Calendar, Wallet,
} from "lucide-react";

// ─── Constantes de style ────────────────────────────────────────────────────
const GOLD   = "#D4AF37";
const CYAN   = "#00BCD4";
const GREEN  = "#10B981";
const RED    = "#EF4444";
const ORANGE = "#F59E0B";

// ─── Données historiques (12 derniers mois) ─────────────────────────────────
const HISTORIQUE = [
  { mois: "Aoû 25", revenus: 2_850_000, depenses: 1_420_000 },
  { mois: "Sep 25", revenus: 3_120_000, depenses: 1_680_000 },
  { mois: "Oct 25", revenus: 2_960_000, depenses: 1_540_000 },
  { mois: "Nov 25", revenus: 3_480_000, depenses: 1_920_000 },
  { mois: "Déc 25", revenus: 4_250_000, depenses: 2_100_000 },
  { mois: "Jan 26", revenus: 2_680_000, depenses: 1_380_000 },
  { mois: "Fév 26", revenus: 2_940_000, depenses: 1_560_000 },
  { mois: "Mar 26", revenus: 3_200_000, depenses: 1_640_000 },
  { mois: "Avr 26", revenus: 3_560_000, depenses: 1_780_000 },
  { mois: "Mai 26", revenus: 3_890_000, depenses: 1_950_000 },
  { mois: "Jun 26", revenus: 4_100_000, depenses: 2_050_000 },
  { mois: "Jul 26", revenus: 3_750_000, depenses: 1_820_000 },
];

// ─── Scénarios de croissance ────────────────────────────────────────────────
const SCENARIOS = [
  { id: "pessimiste", label: "Pessimiste",  revCroiss: -0.03, depCroiss: 0.04,  color: RED    },
  { id: "realiste",   label: "Réaliste",    revCroiss: 0.04,  depCroiss: 0.02,  color: GOLD   },
  { id: "optimiste",  label: "Optimiste",   revCroiss: 0.09,  depCroiss: 0.01,  color: GREEN  },
];

const MOIS_FUTURS = ["Aoû 26", "Sep 26", "Oct 26", "Nov 26", "Déc 26", "Jan 27"];

// ─── Utilitaires ────────────────────────────────────────────────────────────
function fcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

function projeter(scenarioId: string, tresoActuelle: number) {
  const sc = SCENARIOS.find(s => s.id === scenarioId)!;
  const lastRev = HISTORIQUE.at(-1)!.revenus;
  const lastDep = HISTORIQUE.at(-1)!.depenses;

  return MOIS_FUTURS.map((mois, i) => {
    const rev = lastRev * Math.pow(1 + sc.revCroiss, i + 1);
    const dep = lastDep * Math.pow(1 + sc.depCroiss, i + 1);
    const net = rev - dep;
    tresoActuelle += net;
    return {
      mois,
      revenus: Math.round(rev),
      depenses: Math.round(dep),
      net: Math.round(net),
      tresorerie: Math.round(tresoActuelle),
      projected: true,
    };
  });
}

// ─── Tooltip custom ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl text-xs shadow-lg"
      style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)", minWidth: 160 }}>
      <p className="font-bold mb-2">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }} className="mb-0.5">
          {e.name}: {fcfa(e.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function PrevisionsPage() {
  const [scenario, setScenario] = useState<string>("realiste");
  const [tresoActuelle] = useState(5_800_000); // FCFA de tréso actuelle (mock)

  const projections = useMemo(() => projeter(scenario, tresoActuelle), [scenario, tresoActuelle]);
  const scConfig = SCENARIOS.find(s => s.id === scenario)!;

  // KPIs de projection
  const revTotal    = projections.reduce((s, m) => s + m.revenus, 0);
  const depTotal    = projections.reduce((s, m) => s + m.depenses, 0);
  const beneficeNet = revTotal - depTotal;
  const tresoFinale = projections.at(-1)!.tresorerie;
  const tresoNeg    = projections.findIndex(m => m.tresorerie < 0);
  const runway      = tresoNeg === -1 ? "6+ mois" : `${tresoNeg} mois`;
  const sante       = tresoNeg === -1 ? "Sain" : "Risqué";

  // Données combinées pour le graphe principal
  const avgRevHist = HISTORIQUE.reduce((s, m) => s + m.revenus, 0) / HISTORIQUE.length;
  const avgDepHist = HISTORIQUE.reduce((s, m) => s + m.depenses, 0) / HISTORIQUE.length;
  const historique6 = HISTORIQUE.slice(-6).map(m => ({ ...m, projected: false }));
  const combined = [...historique6, ...projections];

  // Données bénéfice mensuel projeté
  const benefData = projections.map(m => ({
    mois: m.mois,
    net: m.net,
    color: m.net >= 0 ? GREEN : RED,
  }));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Prévisions de trésorerie</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
          Projection automatique sur 6 mois · Basé sur votre historique
        </p>
      </div>

      {/* Sélecteur scénario */}
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map(sc => (
          <button
            key={sc.id}
            onClick={() => setScenario(sc.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={scenario === sc.id
              ? { background: sc.color, color: "#0A1628" }
              : { background: "var(--bg3)", color: "var(--text2)", border: "1px solid var(--border)" }}
          >
            {scenario === sc.id && "▶ "}{sc.label}
          </button>
        ))}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text3)" }}>
          <Calendar className="w-3.5 h-3.5" />
          Aoû – Jan 2027
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenus projetés",    value: fcfa(revTotal),    icon: TrendingUp,    color: GREEN,  sub: "6 prochains mois" },
          { label: "Dépenses projetées",  value: fcfa(depTotal),    icon: TrendingDown,  color: RED,    sub: "6 prochains mois" },
          { label: "Bénéfice net",        value: fcfa(beneficeNet), icon: Wallet,        color: GOLD,   sub: beneficeNet > 0 ? "Positif ✓" : "Déficitaire !" },
          { label: "Trésorerie finale",   value: fcfa(tresoFinale), icon: Gauge,         color: CYAN,   sub: `Runway : ${runway}` },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="rounded-2xl p-5"
            style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 120, damping: 20, delay: i * 0.06 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${kpi.color}18` }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${scConfig.color}18`, color: scConfig.color }}>
                {scConfig.label}
              </span>
            </div>
            <p className="text-lg font-black leading-tight" style={{ color: "var(--text)" }}>{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text3)" }}>{kpi.label}</p>
            <p className="text-xs mt-0.5" style={{ color: kpi.color }}>{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerte runway */}
      {sante !== "Sain" && (
        <motion.div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: RED }} />
          <div>
            <p className="text-sm font-bold" style={{ color: RED }}>Risque de trésorerie en {tresoNeg} mois</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              En scénario {scenario}, la trésorerie devient négative. Envisagez de réduire les dépenses ou d'augmenter vos revenus.
            </p>
          </div>
        </motion.div>
      )}

      {sante === "Sain" && (
        <motion.div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GREEN }} />
          <div>
            <p className="text-sm font-bold" style={{ color: GREEN }}>Trésorerie saine sur 6 mois</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              En scénario {scenario}, votre trésorerie reste positive sur toute la période. Continuez à surveiller vos dépenses.
            </p>
          </div>
        </motion.div>
      )}

      {/* Graphe principal : revenus / dépenses historique + projection */}
      <div className="rounded-2xl p-5" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Flux financiers — 6 mois réels + 6 mois projetés</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>La zone hachurée représente les projections</p>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: GREEN }} /> Revenus</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: RED }} /> Dépenses</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: ORANGE }} /> Projection</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={combined} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={GREEN} stopOpacity={0.15} />
                <stop offset="95%" stopColor={GREEN} stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gDep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={RED}   stopOpacity={0.15} />
                <stop offset="95%" stopColor={RED}   stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="mois" tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v: any) => (v / 1_000_000).toFixed(1) + "M"} tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="Aoû 26" stroke={ORANGE} strokeDasharray="4 2" label={{ value: "Projection →", position: "insideTopRight", fontSize: 9, fill: ORANGE }} />
            <Area type="monotone" dataKey="revenus"  name="Revenus"  stroke={GREEN} fill="url(#gRev)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="depenses" name="Dépenses" stroke={RED}   fill="url(#gDep)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bénéfice mensuel projeté */}
      <div className="rounded-2xl p-5" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text)" }}>Bénéfice mensuel projeté</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={benefData} barCategoryGap="30%" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="mois" tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v: any) => (v / 1_000_000).toFixed(1) + "M"} tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip formatter={(v: any) => [fcfa(v), "Bénéfice net"]} />
            <ReferenceLine y={0} stroke="var(--border2)" />
            <Bar dataKey="net" name="Bénéfice net" radius={[4, 4, 0, 0]}>
              {benefData.map((d, i) => (
                <Cell key={i} fill={d.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau détaillé */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--border)" }}>
              {["Mois", "Revenus proj.", "Dépenses proj.", "Bénéfice net", "Trésorerie cumulée"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projections.map((m, i) => (
              <motion.tr
                key={m.mois}
                style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "var(--bg2)" : "var(--bg3)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{m.mois}</td>
                <td className="px-4 py-3 tabular-nums" style={{ color: GREEN }}>{fcfa(m.revenus)}</td>
                <td className="px-4 py-3 tabular-nums" style={{ color: RED }}>{fcfa(m.depenses)}</td>
                <td className="px-4 py-3 tabular-nums font-semibold" style={{ color: m.net >= 0 ? GREEN : RED }}>
                  {m.net >= 0 ? "+" : ""}{fcfa(m.net)}
                </td>
                <td className="px-4 py-3 tabular-nums" style={{ color: m.tresorerie >= 0 ? "var(--text)" : RED }}>
                  {fcfa(m.tresorerie)}
                  {m.tresorerie < 0 && <span className="ml-1.5 text-xs">⚠️</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center" style={{ color: "var(--text3)" }}>
        Les projections sont basées sur la tendance des 12 derniers mois et le scénario sélectionné.
        Elles ne constituent pas une garantie financière.
      </p>
    </div>
  );
}
