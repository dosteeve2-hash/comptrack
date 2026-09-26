"use client";

import { useState, useEffect, useCallback } from "react";
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
  LineChart,
  Line,
} from "recharts";
import type { LucideIcon } from "lucide-react";
import { Download, BookOpen, Scale, TrendingUp } from "lucide-react";
import EcheancierPaiements from "@/components/EcheancierPaiements";
import { categories } from "@/lib/data";
import {
  computeDonneesMensuelles,
  computeKpisMoisActuel,
  computeTopCategoriesDepenses,
  useFactures,
  useTransactions,
} from "@/lib/store";
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
type VueRapport = "apercu" | "bilan" | "resultat";

interface LigneBilan {
  libelle: string;
  montant: number;
  info?: string;
}

interface LigneResultat {
  libelle: string;
  montant: number;
  type: "produit" | "charge" | "resultat" | "sous-total";
  info?: string;
}

export default function RapportsPage() {
  const [txList] = useTransactions();
  const [facturesList] = useFactures();
  const [periode, setPeriode] = useState<Periode>("mensuel");
  const [vueRapport, setVueRapport] = useState<VueRapport>("apercu");
  const [mounted, setMounted] = useState(false);
  const [tooltipActif, setTooltipActif] = useState<string | null>(null);
  const [tooltipPassif, setTooltipPassif] = useState<string | null>(null);
  const [tooltipResultat, setTooltipResultat] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const donneesMensuelles = computeDonneesMensuelles(txList);
  const topCategoriesDepenses = computeTopCategoriesDepenses(txList, categories);
  const kpisMoisActuel = computeKpisMoisActuel(txList);

  // ─── Données Bilan ──────────────────────────────────────────────────────────
  const creancesClients = facturesList
    .filter((f) => f.statut === "en_attente" || f.statut === "envoyee")
    .reduce((s, f) => s + f.montant, 0);
  const tresorerie = kpisMoisActuel.solde;
  const immobilisations = 0; // pas de suivi des immobilisations pour le moment
  const totalActif = tresorerie + creancesClients + immobilisations;

  const detteFournisseurs = txList
    .filter((t) => t.type === "depense" && t.statut === "en_attente")
    .reduce((s, t) => s + t.montant, 0);
  const chargesConstater = 0; // pas de suivi des charges à payer pour le moment
  const capitauxPropres = totalActif - detteFournisseurs - chargesConstater;
  const totalPassif = detteFournisseurs + chargesConstater + capitauxPropres;

  const lignesActif: LigneBilan[] = [
    { libelle: "Trésorerie (solde bancaire)", montant: tresorerie, info: "Argent disponible immédiatement sur vos comptes." },
    { libelle: "Créances clients", montant: creancesClients, info: "Factures émises mais pas encore payées par vos clients." },
    { libelle: "Immobilisations", montant: immobilisations, info: "Valeur de votre matériel, mobilier, équipements." },
  ];

  const lignesPassif: LigneBilan[] = [
    { libelle: "Dettes fournisseurs", montant: detteFournisseurs, info: "Ce que vous devez encore à vos fournisseurs." },
    { libelle: "Charges à payer", montant: chargesConstater, info: "Loyers, abonnements et autres charges dues." },
    { libelle: "Capitaux propres", montant: capitauxPropres, info: "La valeur nette de votre entreprise (Actif − Dettes)." },
  ];

  // ─── Données Compte de résultat ─────────────────────────────────────────────
  const totalRevenus6M = donneesMensuelles.reduce((s, m) => s + m.revenus, 0);
  const totalDepenses6M = donneesMensuelles.reduce((s, m) => s + m.depenses, 0);
  const resultatExploit = totalRevenus6M - totalDepenses6M;
  const chargesFinancieres = 0; // pas de suivi des frais financiers pour le moment
  const resultatNet = resultatExploit - chargesFinancieres;
  const tauxMarge = totalRevenus6M > 0 ? Math.round((resultatNet / totalRevenus6M) * 100) : 0;

  const sixMoisAgo = new Date();
  sixMoisAgo.setDate(1);
  sixMoisAgo.setMonth(sixMoisAgo.getMonth() - 5);
  const chargesPersonnel = txList
    .filter(
      (t) =>
        t.type === "depense" &&
        t.statut === "validee" &&
        t.categorie === "Salaires" &&
        new Date(t.date) >= sixMoisAgo
    )
    .reduce((s, t) => s + t.montant, 0);
  const autresCharges = totalDepenses6M - chargesPersonnel;

  const lignesResultat: LigneResultat[] = [
    { libelle: "Ventes et prestations", montant: totalRevenus6M, type: "produit", info: "Total de tous vos revenus sur la période." },
    { libelle: "Total Produits d'exploitation", montant: totalRevenus6M, type: "sous-total" },
    { libelle: "Charges de personnel", montant: chargesPersonnel, type: "charge", info: "Salaires et charges sociales." },
    { libelle: "Achats et autres charges externes", montant: autresCharges, type: "charge", info: "Achat stock, sous-traitance, loyer, télécoms…" },
    { libelle: "Total Charges d'exploitation", montant: totalDepenses6M, type: "sous-total" },
    { libelle: "Résultat d'exploitation (EBIT)", montant: resultatExploit, type: "resultat", info: "Produits − Charges. C'est votre bénéfice opérationnel." },
    { libelle: "Charges financières", montant: chargesFinancieres, type: "charge", info: "Intérêts d'emprunt, frais bancaires." },
    { libelle: "Résultat net", montant: resultatNet, type: "resultat", info: "Le bénéfice final après toutes les charges. C'est ce que vous avez vraiment gagné." },
  ];

  const totalRevenus = totalRevenus6M;
  const totalDepenses = totalDepenses6M;
  const beneficeNet = totalRevenus - totalDepenses;
  const margeNette = totalRevenus > 0 ? Math.round((beneficeNet / totalRevenus) * 100) : 0;

  // Données fictives de démo quand aucune transaction n'existe
  const DONNEES_DEMO = [
    { mois: "Mar", revenus: 850000, depenses: 320000, benefice: 530000 },
    { mois: "Avr", revenus: 920000, depenses: 410000, benefice: 510000 },
    { mois: "Mai", revenus: 1100000, depenses: 380000, benefice: 720000 },
    { mois: "Jun", revenus: 980000, depenses: 450000, benefice: 530000 },
    { mois: "Jul", revenus: 1250000, depenses: 520000, benefice: 730000 },
    { mois: "Aoû", revenus: 1180000, depenses: 490000, benefice: 690000 },
  ];
  const donneesEffectives = donneesMensuelles.length > 0 ? donneesMensuelles : DONNEES_DEMO;

  // Export PDF jsPDF A4 — header Navy/Gold + données mensuelles
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

    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55);
    doc.text("RAPPORT FINANCIER", W / 2, 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(235, 244, 255);
    const periodeLabel =
      donneesEffectives.length > 0
        ? `${donneesEffectives[0].mois} – ${donneesEffectives[donneesEffectives.length - 1].mois} ${new Date().getFullYear()}`
        : "6 derniers mois";
    doc.text(`Période : ${periodeLabel}`, W / 2, 31, { align: "center" });
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
      { label: "Chiffre d'affaires", value: formatMontant(totalRevenus) + " FCFA" },
      { label: "Dépenses totales",    value: formatMontant(totalDepenses) + " FCFA" },
      { label: "Bénéfice net",        value: formatMontant(beneficeNet) + " FCFA" },
      { label: "Taux de marge",       value: margeNette + "%" },
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

    // ── Tableau mensuel ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(212, 175, 55);
    doc.text("ÉVOLUTION MENSUELLE", margin, y);
    y += 2;
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, y, 45, 0.5, "F");
    y += 8;

    // En-tête tableau
    doc.setFillColor(10, 22, 40);
    doc.rect(margin, y, W - 2 * margin, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(212, 175, 55);
    doc.text("MOIS",      margin + 5, y + 5.5);
    doc.text("REVENUS",   105, y + 5.5, { align: "right" });
    doc.text("DÉPENSES",  145, y + 5.5, { align: "right" });
    doc.text("BÉNÉFICE",  W - margin - 3, y + 5.5, { align: "right" });
    y += 10;

    donneesEffectives.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(14, 31, 61);
        doc.rect(margin, y - 3, W - 2 * margin, 8, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(235, 244, 255);
      doc.text(row.mois, margin + 5, y + 2.5);
      doc.setTextColor(34, 197, 94);
      doc.text(formatMontant(row.revenus), 105, y + 2.5, { align: "right" });
      doc.setTextColor(239, 68, 68);
      doc.text(formatMontant(row.depenses), 145, y + 2.5, { align: "right" });
      if (row.benefice >= 0) doc.setTextColor(34, 197, 94);
      else doc.setTextColor(239, 68, 68);
      doc.text(formatMontant(row.benefice), W - margin - 3, y + 2.5, { align: "right" });
      y += 8;
    });

    // ── Footer ──
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(139, 171, 201);
    doc.text(`Rapport généré automatiquement par CompTrack · ${new Date().toLocaleDateString("fr-FR")}`, W / 2, 285, { align: "center" });
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 288, W, 2, "F");

    doc.save("rapport-financier.pdf");
  }, [totalRevenus, totalDepenses, beneficeNet, margeNette, donneesEffectives]);

  const anneeActuelle = new Date().getFullYear();

  const donneesTrimestre = [
    {
      mois: donneesMensuelles.length >= 3 ? `${donneesMensuelles[0].mois}–${donneesMensuelles[2].mois}` : "T1",
      revenus: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.revenus, 0),
      depenses: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.depenses, 0),
      benefice: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.benefice, 0),
    },
    {
      mois: donneesMensuelles.length >= 6 ? `${donneesMensuelles[3].mois}–${donneesMensuelles[5].mois}` : "T2",
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
            mois: `Année ${anneeActuelle}`,
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
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 no-print"
          style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
        >
          <Download className="w-4 h-4" />
          Exporter PDF
        </button>
      </div>

      {/* Vue tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
        {([
          { id: "apercu", label: "Aperçu", icon: TrendingUp },
          { id: "bilan", label: "Bilan", icon: Scale },
          { id: "resultat", label: "Compte de résultat", icon: BookOpen },
        ] as Array<{ id: VueRapport; label: string; icon: LucideIcon }>).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setVueRapport(tab.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: vueRapport === tab.id ? "var(--bg3)" : "transparent",
              color: vueRapport === tab.id ? "var(--text)" : "var(--text2)",
              border: vueRapport === tab.id ? "1px solid var(--border2)" : "1px solid transparent",
            }}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── VUE BILAN ─────────────────────────────────────────────────────── */}
      {vueRapport === "bilan" && (
        <div className="space-y-6">
          {/* Info card */}
          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--blue)" }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--blue)" }}>Qu&apos;est-ce que le bilan ?</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text2)" }}>
                  Le bilan est une photo de la santé financière de votre entreprise à un instant T.
                  Il compare ce que vous <strong style={{ color: "var(--text)" }}>possédez</strong> (l&apos;Actif) à ce que vous
                  <strong style={{ color: "var(--text)" }}> devez</strong> (le Passif).
                  La règle d&apos;or : <strong style={{ color: "var(--green)" }}>Actif = Passif</strong> toujours.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Actif */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "var(--border)", background: "rgba(34,197,94,0.05)" }}
              >
                <div>
                  <h3 className="font-bold" style={{ color: "var(--green)" }}>ACTIF</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>Ce que vous possédez</p>
                </div>
                <span className="font-bold font-mono text-lg" style={{ color: "var(--green)" }}>
                  {formatMontant(totalActif)}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {lignesActif.map((ligne, i) => (
                  <div
                    key={i}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setTooltipActif(tooltipActif === ligne.libelle ? null : ligne.libelle)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ligne.libelle}</p>
                      {tooltipActif === ligne.libelle && ligne.info && (
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--blue)" }}>
                          💡 {ligne.info}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-sm ml-4 flex-shrink-0" style={{ color: "var(--green)" }}>
                      {formatMontant(ligne.montant)}
                    </span>
                  </div>
                ))}
                <div
                  className="px-6 py-4 flex items-center justify-between font-bold"
                  style={{ background: "rgba(34,197,94,0.08)" }}
                >
                  <span>Total Actif</span>
                  <span className="font-mono" style={{ color: "var(--green)" }}>{formatMontant(totalActif)}</span>
                </div>
              </div>
            </div>

            {/* Passif */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "var(--border)", background: "rgba(59,130,246,0.05)" }}
              >
                <div>
                  <h3 className="font-bold" style={{ color: "var(--blue)" }}>PASSIF</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>Ce que vous devez + vos capitaux</p>
                </div>
                <span className="font-bold font-mono text-lg" style={{ color: "var(--blue)" }}>
                  {formatMontant(totalPassif)}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {lignesPassif.map((ligne, i) => (
                  <div
                    key={i}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setTooltipPassif(tooltipPassif === ligne.libelle ? null : ligne.libelle)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ligne.libelle}</p>
                      {tooltipPassif === ligne.libelle && ligne.info && (
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--blue)" }}>
                          💡 {ligne.info}
                        </p>
                      )}
                    </div>
                    <span
                      className="font-mono font-semibold text-sm ml-4 flex-shrink-0"
                      style={{ color: ligne.libelle.includes("Capitaux") ? "var(--green)" : "var(--red)" }}
                    >
                      {formatMontant(ligne.montant)}
                    </span>
                  </div>
                ))}
                <div
                  className="px-6 py-4 flex items-center justify-between font-bold"
                  style={{ background: "rgba(59,130,246,0.08)" }}
                >
                  <span>Total Passif</span>
                  <span className="font-mono" style={{ color: "var(--blue)" }}>{formatMontant(totalPassif)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Équilibre */}
          <div
            className="p-5 rounded-2xl text-center"
            style={{
              background: totalActif === totalPassif ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
              border: `1px solid ${totalActif === totalPassif ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}
          >
            <p className="text-sm font-semibold">
              Équilibre du bilan :{" "}
              <span style={{ color: totalActif === totalPassif ? "var(--green)" : "var(--red)" }}>
                Actif {formatMontant(totalActif)} = Passif {formatMontant(totalPassif)} ✓
              </span>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text2)" }}>
              Cliquez sur chaque ligne pour afficher l&apos;explication
            </p>
          </div>
        </div>
      )}

      {/* ─── VUE COMPTE DE RÉSULTAT ─────────────────────────────────────────── */}
      {vueRapport === "resultat" && (
        <div className="space-y-6">
          {/* Info card */}
          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--green)" }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--green)" }}>Qu&apos;est-ce que le compte de résultat ?</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text2)" }}>
                  Le compte de résultat mesure votre performance sur une <strong style={{ color: "var(--text)" }}>période</strong>.
                  Il liste tous vos <strong style={{ color: "var(--green)" }}>Produits</strong> (revenus) puis toutes vos{" "}
                  <strong style={{ color: "var(--red)" }}>Charges</strong> (dépenses).
                  La différence = votre <strong style={{ color: "var(--amber)" }}>Résultat net</strong> (bénéfice ou perte).
                </p>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Produits totaux", value: totalRevenus6M, color: "var(--green)" },
              { label: "Charges totales", value: totalDepenses6M, color: "var(--red)" },
              { label: "Résultat net", value: resultatNet, color: resultatNet >= 0 ? "var(--amber)" : "var(--red)" },
              { label: "Taux de marge", value: null, pct: tauxMarge, color: "var(--blue)" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>{s.label}</p>
                <p className="font-bold font-mono text-lg" style={{ color: s.color }}>
                  {s.value !== null ? formatMontant(s.value) : `${s.pct}%`}
                </p>
              </div>
            ))}
          </div>

          {/* Tableau */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-bold">
                Compte de résultat
                {donneesMensuelles.length > 0 && ` — ${donneesMensuelles[0].mois} à ${donneesMensuelles[donneesMensuelles.length - 1].mois} ${anneeActuelle}`}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>Cliquez sur une ligne pour l&apos;explication</p>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {lignesResultat.map((ligne, i) => {
                const isSousTotal = ligne.type === "sous-total";
                const isResultat = ligne.type === "resultat";
                const isCharge = ligne.type === "charge";
                const montantColor = isResultat
                  ? ligne.montant >= 0 ? "var(--amber)" : "var(--red)"
                  : isCharge ? "var(--red)" : "var(--green)";

                if (isSousTotal) {
                  return (
                    <div
                      key={i}
                      className="px-6 py-3 flex items-center justify-between font-bold text-sm"
                      style={{ background: "var(--bg3)" }}
                    >
                      <span style={{ color: "var(--text2)" }}>{ligne.libelle}</span>
                      <span className="font-mono" style={{ color: montantColor }}>
                        {formatMontant(ligne.montant)}
                      </span>
                    </div>
                  );
                }

                if (isResultat) {
                  return (
                    <div
                      key={i}
                      className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                      style={{
                        background: "rgba(245,158,11,0.06)",
                        borderTop: "2px solid rgba(245,158,11,0.3)",
                        borderBottom: "2px solid rgba(245,158,11,0.3)",
                      }}
                      onClick={() => setTooltipResultat(tooltipResultat === ligne.libelle ? null : ligne.libelle)}
                    >
                      <div>
                        <p className="font-bold text-sm">{ligne.libelle}</p>
                        {tooltipResultat === ligne.libelle && ligne.info && (
                          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--amber)" }}>
                            💡 {ligne.info}
                          </p>
                        )}
                      </div>
                      <span className="font-bold font-mono ml-4 flex-shrink-0" style={{ color: montantColor }}>
                        {formatMontant(ligne.montant)}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className="px-6 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setTooltipResultat(tooltipResultat === ligne.libelle ? null : ligne.libelle)}
                  >
                    <div className="flex-1 pl-4">
                      <p className="text-sm">{ligne.libelle}</p>
                      {tooltipResultat === ligne.libelle && ligne.info && (
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--blue)" }}>
                          💡 {ligne.info}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-sm ml-4 flex-shrink-0" style={{ color: montantColor }}>
                      {formatMontant(ligne.montant)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── VUE APERÇU (ancienne vue) ──────────────────────────────────────── */}
      {vueRapport === "apercu" && (
        <div className="space-y-6">
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
          { label: "Chiffre d'affaires", value: totalRevenus, color: "var(--green)" },
          { label: "Dépenses", value: totalDepenses, color: "var(--red)" },
          { label: "Bénéfice net", value: beneficeNet, color: "var(--blue)" },
          { label: "Taux de marge", value: null, pct: margeNette, color: "var(--amber)" },
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
          {!mounted ? (
            <div className="h-64 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
          ) : donneesAffichees.length === 0 || donneesAffichees.every((d) => d.revenus === 0 && d.depenses === 0) ? (
            <div
              className="h-64 rounded-xl flex items-center justify-center text-sm"
              style={{ background: "var(--bg3)", color: "var(--text2)" }}
            >
              Pas encore de données à afficher
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* LineChart — évolution du bénéfice net */}
      <div
        className="p-6 rounded-2xl border"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Évolution du bénéfice net</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
              6 derniers mois
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#00D4FF" }} />
            Bénéfice net
          </span>
        </div>
        {!mounted ? (
          <div className="h-48 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={donneesEffectives} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
              <Line
                type="monotone"
                dataKey="benefice"
                name="Bénéfice"
                stroke="#00D4FF"
                strokeWidth={2.5}
                dot={{ fill: "#00D4FF", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
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
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12" style={{ color: "var(--text2)" }}>
                    Aucune donnée pour le moment
                  </td>
                </tr>
              ) : (
              tableData.map((row, i) => {
                const marge = row.revenus > 0 ? Math.round((row.benefice / row.revenus) * 100) : 0;
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
              })
              )}
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
      )}

      {/* Échéancier paiements */}
      {vueRapport === "apercu" && <EcheancierPaiements />}
    </div>
  );
}
