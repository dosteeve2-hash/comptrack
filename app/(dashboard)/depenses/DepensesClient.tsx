"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Plus, X, TrendingDown, Calendar, Package, Users } from "lucide-react";
import { formatMontant, formatDate } from "@/lib/utils";
import type { Depense } from "./page";

// ── Catégories ──────────────────────────────────────────────────────────────
type Categorie =
  | "intrants"
  | "main_oeuvre"
  | "transport"
  | "equipement"
  | "certification"
  | "frais_admin"
  | "autre";

const CATEGORIES: { value: Categorie; label: string; color: string }[] = [
  { value: "intrants",      label: "Intrants",       color: "#22c55e" },
  { value: "main_oeuvre",   label: "Main d'œuvre",   color: "#f59e0b" },
  { value: "transport",     label: "Transport",      color: "#f97316" },
  { value: "equipement",    label: "Équipement",     color: "#06b6d4" },
  { value: "certification", label: "Certification",  color: "#a855f7" },
  { value: "frais_admin",   label: "Frais admin",    color: "#64748b" },
  { value: "autre",         label: "Autre",          color: "#6b7280" },
];

const getCatConfig = (cat: string) =>
  CATEGORIES.find((c) => c.value === cat) ?? { label: cat, color: "#6b7280" };

// ── Formulaire ───────────────────────────────────────────────────────────────
interface DepenseForm {
  libelle: string;
  categorie: Categorie | "";
  montant: string;
  fournisseur_nom: string;
  date_depense: string;
  notes: string;
}

const defaultForm: DepenseForm = {
  libelle: "",
  categorie: "",
  montant: "",
  fournisseur_nom: "",
  date_depense: new Date().toISOString().split("T")[0],
  notes: "",
};

// ── Composant principal ───────────────────────────────────────────────────────
export default function DepensesClient({ depenses: initialDepenses }: { depenses: Depense[] }) {
  const [depenses, setDepenses] = useState<Depense[]>(initialDepenses);
  const [filterCat, setFilterCat] = useState<Categorie | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DepenseForm>(defaultForm);
  const [formError, setFormError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = depenses.filter((d) => {
      const date = new Date(d.date_depense);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const total = depenses.reduce((s, d) => s + d.montant, 0);
    const totalMois = thisMonth.reduce((s, d) => s + d.montant, 0);

    const catCounts: Record<string, number> = {};
    depenses.forEach((d) => {
      catCounts[d.categorie] = (catCounts[d.categorie] ?? 0) + d.montant;
    });
    const catPrincipale = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const moisSet = new Set(depenses.map((d) => d.date_depense.slice(0, 7)));
    const moyenne = moisSet.size > 0 ? Math.round(total / moisSet.size) : 0;

    return { total, totalMois, catPrincipale, moyenne };
  }, [depenses]);

  // ── PieChart data ─────────────────────────────────────────────────────────
  const pieData = useMemo(() => {
    const bycat: Record<string, number> = {};
    depenses.forEach((d) => {
      bycat[d.categorie] = (bycat[d.categorie] ?? 0) + d.montant;
    });
    return Object.entries(bycat).map(([cat, value]) => ({
      name: getCatConfig(cat).label,
      value,
      color: getCatConfig(cat).color,
    }));
  }, [depenses]);

  // ── Filtre ────────────────────────────────────────────────────────────────
  const filtered = useMemo(
    () => (filterCat === "all" ? depenses : depenses.filter((d) => d.categorie === filterCat)),
    [depenses, filterCat]
  );

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.libelle || !form.categorie || !form.montant || !form.date_depense) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const montant = parseFloat(form.montant);
    if (isNaN(montant) || montant <= 0) {
      setFormError("Le montant doit être un nombre positif.");
      return;
    }
    const newDep: Depense = {
      id: `local-${Date.now()}`,
      libelle: form.libelle,
      categorie: form.categorie as Categorie,
      montant,
      fournisseur_nom: form.fournisseur_nom || null,
      date_depense: form.date_depense,
      notes: form.notes || null,
    };
    setDepenses((prev) => [newDep, ...prev]);
    setForm(defaultForm);
    setShowForm(false);
  };

  // ── Stats cards config ────────────────────────────────────────────────────
  const statCards = [
    {
      label: "Total dépenses",
      value: formatMontant(stats.total),
      icon: TrendingDown,
      color: "#ef4444",
    },
    {
      label: "Ce mois",
      value: formatMontant(stats.totalMois),
      icon: Calendar,
      color: "#f59e0b",
    },
    {
      label: "Catégorie principale",
      value: getCatConfig(stats.catPrincipale).label,
      icon: Package,
      color: "#06b6d4",
    },
    {
      label: "Moyenne / mois",
      value: formatMontant(stats.moyenne),
      icon: Users,
      color: "#a855f7",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {filtered.length} dépense{filtered.length !== 1 ? "s" : ""} affichée
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setFormError(""); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#F59E0B", color: "#000" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle dépense
        </button>
      </div>

      {/* Stats stagger */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="p-4 rounded-2xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}1a` }}
              >
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span className="text-xs" style={{ color: "var(--text2)" }}>{s.label}</span>
            </div>
            <p className="font-bold font-mono text-sm">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* PieChart + Filters row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PieChart */}
        <div
          className="lg:col-span-1 p-4 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <p className="text-sm font-semibold mb-3">Répartition par catégorie</p>
          {mounted ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatMontant(value), "Montant"]}
                  contentStyle={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        {/* Filtres catégorie pills */}
        <div
          className="lg:col-span-2 p-4 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <p className="text-sm font-semibold mb-3">Filtrer par catégorie</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCat("all")}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filterCat === "all" ? "#F59E0B" : "var(--bg3)",
                color: filterCat === "all" ? "#000" : "var(--text2)",
                border: filterCat === "all" ? "1px solid #F59E0B" : "1px solid var(--border2)",
              }}
            >
              Toutes ({depenses.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = depenses.filter((d) => d.categorie === cat.value).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.value}
                  onClick={() => setFilterCat(cat.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: filterCat === cat.value ? `${cat.color}22` : "var(--bg3)",
                    color: filterCat === cat.value ? cat.color : "var(--text2)",
                    border:
                      filterCat === cat.value
                        ? `1px solid ${cat.color}`
                        : "1px solid var(--border2)",
                  }}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Formulaire toggle */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="p-5 rounded-2xl border"
              style={{ background: "var(--bg2)", borderColor: "#F59E0B" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold">Nouvelle dépense</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg hover:opacity-70 transition-all"
                  style={{ color: "var(--text2)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Libellé */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Libellé *</label>
                    <input
                      name="libelle"
                      value={form.libelle}
                      onChange={handleChange}
                      placeholder="Ex: Engrais NPK 50kg"
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                      required
                    />
                  </div>
                  {/* Catégorie */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Catégorie *</label>
                    <select
                      name="categorie"
                      value={form.categorie}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none appearance-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: form.categorie ? "var(--text)" : "var(--text2)",
                      }}
                      required
                    >
                      <option value="">Choisir une catégorie</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* Montant */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Montant (FCFA) *</label>
                    <input
                      name="montant"
                      type="number"
                      min="0"
                      step="100"
                      value={form.montant}
                      onChange={handleChange}
                      placeholder="Ex: 45000"
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                      required
                    />
                  </div>
                  {/* Fournisseur */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Fournisseur</label>
                    <input
                      name="fournisseur_nom"
                      value={form.fournisseur_nom}
                      onChange={handleChange}
                      placeholder="Optionnel"
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                  {/* Date */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Date *</label>
                    <input
                      name="date_depense"
                      type="date"
                      value={form.date_depense}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                      required
                    />
                  </div>
                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Notes</label>
                    <input
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Optionnel"
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                </div>
                {formError && (
                  <p
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}
                  >
                    {formError}
                  </p>
                )}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-70 transition-all"
                    style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
                    style={{ background: "#F59E0B", color: "#000" }}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards dépenses */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ color: "var(--text2)" }}>
              <TrendingDown className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucune dépense dans cette catégorie</p>
            </div>
          ) : (
            filtered.map((dep, i) => {
              const cat = getCatConfig(dep.categorie);
              return (
                <motion.div
                  key={dep.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="p-4 rounded-2xl border flex items-start gap-4"
                  style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
                >
                  {/* Icône catégorie */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${cat.color}1a` }}
                  >
                    <TrendingDown className="w-4 h-4" style={{ color: cat.color }} />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm truncate">{dep.libelle}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                        style={{ background: `${cat.color}20`, color: cat.color }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {dep.fournisseur_nom && (
                        <span className="text-xs" style={{ color: "var(--text2)" }}>
                          🏪 {dep.fournisseur_nom}
                        </span>
                      )}
                      <span className="text-xs font-mono" style={{ color: "var(--text2)" }}>
                        📅 {formatDate(dep.date_depense)}
                      </span>
                    </div>
                    {dep.notes && (
                      <p
                        className="text-xs mt-1 italic truncate"
                        style={{ color: "var(--text2)" }}
                      >
                        {dep.notes}
                      </p>
                    )}
                  </div>

                  {/* Montant */}
                  <span
                    className="font-bold font-mono text-sm flex-shrink-0"
                    style={{ color: "#F59E0B" }}
                  >
                    {formatMontant(dep.montant)}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
