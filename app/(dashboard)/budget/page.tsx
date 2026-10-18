"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, X, Edit2, AlertCircle, CheckCircle, TrendingDown, Plus } from "lucide-react";
import { usePersistedList } from "@/lib/store";
import { formatMontant } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Enveloppe {
  id: string;
  categorie: string;
  alloue: number;
  depense: number;
}

const STORAGE_KEY = "comptrack_budget_enveloppes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(depense: number, alloue: number): number {
  if (alloue <= 0) return 0;
  return Math.min(Math.round((depense / alloue) * 100), 100);
}

function couleurBarre(p: number): string {
  if (p >= 90) return "var(--red)";
  if (p >= 70) return "#f59e0b";
  return "#22c55e";
}

// ─── Statut pill ──────────────────────────────────────────────────────────────

function StatutPill({ p }: { p: number }) {
  if (p >= 90) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
        style={{ background: "rgba(239,68,68,0.12)", color: "var(--red)" }}
      >
        <AlertCircle style={{ width: 10, height: 10 }} />
        Dépassé
      </span>
    );
  }
  if (p >= 70) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
        style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
      >
        Attention
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
      style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
    >
      <CheckCircle style={{ width: 10, height: 10 }} />
      OK
    </span>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

const moisLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date());

export default function BudgetPage() {
  const [enveloppes, setEnveloppes] = usePersistedList<Enveloppe>(STORAGE_KEY);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Enveloppe | null>(null);
  const [form, setForm] = useState({ categorie: "", alloue: "", depense: "" });
  const [formError, setFormError] = useState("");

  // ── Totaux ────────────────────────────────────────────────────────────────
  const totalAlloue  = enveloppes.reduce((s, e) => s + e.alloue, 0);
  const totalDepense = enveloppes.reduce((s, e) => s + e.depense, 0);
  const totalPct     = pct(totalDepense, totalAlloue);

  // ── Modal ─────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm({ categorie: "", alloue: "", depense: "0" });
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (e: Enveloppe) => {
    setEditTarget(e);
    setForm({ categorie: e.categorie, alloue: String(e.alloue), depense: String(e.depense) });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSave = (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError("");
    const categorie = form.categorie.trim();
    const alloue  = parseFloat(form.alloue.replace(/\s/g, ""));
    const depense = parseFloat(form.depense.replace(/\s/g, ""));
    if (!categorie) {
      setFormError("Donnez un nom à l'enveloppe.");
      return;
    }
    if (isNaN(alloue) || alloue < 0 || isNaN(depense) || depense < 0) {
      setFormError("Saisissez des montants positifs.");
      return;
    }
    if (editTarget) {
      setEnveloppes((prev) =>
        prev.map((e) => (e.id === editTarget.id ? { ...e, categorie, alloue, depense } : e))
      );
    } else {
      setEnveloppes((prev) => [...prev, { id: `env_${Date.now()}`, categorie, alloue, depense }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* ── En-tête ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
        >
          <Wallet className="w-5 h-5" style={{ color: "var(--gold)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">Enveloppes budgétaires</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {moisLabel} · {enveloppes.length} {enveloppes.length > 1 ? "enveloppes" : "enveloppe"}
          </p>
        </div>
        {enveloppes.length > 0 && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 min-h-10 rounded-xl transition-all hover:brightness-110"
            style={{ background: "var(--gold)", color: "var(--navy)" }}
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        )}
      </div>

      {enveloppes.length === 0 && (
        <div
          className="p-8 rounded-2xl border text-center"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <p className="text-base font-semibold mb-1">Aucune enveloppe pour le moment</p>
          <p className="text-sm mb-5 mx-auto max-w-md" style={{ color: "var(--text2)" }}>
            Une enveloppe fixe un plafond de dépenses pour une catégorie (loyer, transport, personnel…).
            Créez la première avec vos propres montants.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 min-h-10 rounded-xl transition-all hover:brightness-110"
            style={{ background: "var(--gold)", color: "var(--navy)" }}
          >
            <Plus className="w-4 h-4" />
            Ajouter une enveloppe
          </button>
        </div>
      )}

      {/* ── Synthèse globale ─────────────────────────────────────────────────── */}
      {enveloppes.length > 0 && (
      <div
        className="p-5 rounded-2xl border"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Budget global du mois</span>
          <span
            className="text-xs font-mono"
            style={{ color: totalPct >= 90 ? "var(--red)" : "var(--text2)" }}
          >
            {formatMontant(totalDepense)} / {formatMontant(totalAlloue)}
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalPct}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ background: couleurBarre(totalPct) }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-xs font-semibold"
            style={{ color: couleurBarre(totalPct) }}
          >
            {totalPct}% consommé
          </span>
          <span className="text-xs" style={{ color: "var(--text3)" }}>
            Reste :{" "}
            <span className="font-mono font-semibold" style={{ color: "var(--text)" }}>
              {formatMontant(Math.max(totalAlloue - totalDepense, 0))}
            </span>
          </span>
        </div>
      </div>
      )}

      {/* ── Grille enveloppes ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {enveloppes.map((env, i) => {
          const p = pct(env.depense, env.alloue);
          const couleur = couleurBarre(p);
          return (
            <motion.div
              key={env.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 280, damping: 26 }}
              className="p-5 rounded-2xl border"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-center gap-2.5">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      {env.categorie}
                    </p>
                    <div className="mt-0.5">
                      <StatutPill p={p} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(env)}
                  className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg transition-all hover:brightness-110 flex-shrink-0"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    color: "var(--gold)",
                  }}
                >
                  <Edit2 style={{ width: 11, height: 11 }} />
                  Modifier
                </button>
              </div>

              {/* Barre de progression */}
              <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: "var(--bg3)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${p}%` }}
                  transition={{ duration: 0.7, delay: i * 0.06 + 0.15, ease: "easeOut" }}
                  style={{ background: couleur }}
                />
              </div>

              {/* Chiffres */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold" style={{ color: couleur }}>
                  {p}%
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text2)" }}>
                  {formatMontant(env.depense)}{" "}
                  <span style={{ color: "var(--text3)" }}>/ {formatMontant(env.alloue)}</span>
                </span>
              </div>

              {/* Ligne restant */}
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-1.5">
                  <TrendingDown style={{ width: 13, height: 13, color: "var(--text3)" }} />
                  <span className="text-xs" style={{ color: "var(--text3)" }}>Restant</span>
                </div>
                <span
                  className="text-xs font-semibold font-mono"
                  style={{ color: env.depense > env.alloue ? "var(--red)" : "var(--text)" }}
                >
                  {env.depense > env.alloue
                    ? `−${formatMontant(env.depense - env.alloue)}`
                    : formatMontant(env.alloue - env.depense)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Modal Modifier budget ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.72)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
              initial={{ scale: 0.93, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold">
                  {editTarget ? `Modifier — ${editTarget.categorie}` : "Nouvelle enveloppe"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg transition-all hover:opacity-70"
                  style={{ color: "var(--text2)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Nom de l&apos;enveloppe
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={form.categorie}
                    onChange={(e) => setForm((p) => ({ ...p, categorie: e.target.value }))}
                    placeholder="Ex. Transport"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Budget alloué (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.alloue}
                    onChange={(e) => setForm((p) => ({ ...p, alloue: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Montant dépensé (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.depense}
                    onChange={(e) => setForm((p) => ({ ...p, depense: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                    required
                  />
                </div>

                {formError && (
                  <p
                    className="text-xs px-4 py-2 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}
                  >
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                    style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                    style={{ background: "var(--gold)", color: "var(--navy)" }}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
