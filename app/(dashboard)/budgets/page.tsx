"use client";

import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { categories } from "@/lib/data";
import { STORAGE_KEYS, usePersistedList, useTransactions } from "@/lib/store";
import { formatMontant } from "@/lib/utils";

interface Budget {
  id: string;
  categorie: string;
  limite: number;
}

const categoriesDepense = categories.filter((c) => c.type === "depense" || c.type === "les_deux");

export default function BudgetsPage() {
  const [budgets, setBudgets] = usePersistedList<Budget>(STORAGE_KEYS.budgets);
  const [txList] = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ categorie: "", limite: "" });
  const [formError, setFormError] = useState("");

  const now = new Date();
  const depensePourCategorie = (categorie: string) =>
    txList
      .filter(
        (t) =>
          t.type === "depense" &&
          t.statut === "validee" &&
          t.categorie === categorie &&
          new Date(t.date).getFullYear() === now.getFullYear() &&
          new Date(t.date).getMonth() === now.getMonth()
      )
      .reduce((s, t) => s + t.montant, 0);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const limite = parseFloat(form.limite.replace(/\s/g, ""));
    if (!form.categorie || isNaN(limite) || limite <= 0) {
      setFormError("Choisissez une catégorie et un montant positif.");
      return;
    }
    if (budgets.some((b) => b.categorie === form.categorie)) {
      setFormError("Un budget existe déjà pour cette catégorie.");
      return;
    }
    setBudgets((prev) => [...prev, { id: `bud${Date.now()}`, categorie: form.categorie, limite }]);
    setForm({ categorie: "", limite: "" });
    setModalOpen(false);
  };

  const moisLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(now);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Suivi budgétaire — {moisLabel}</p>
        </div>
        <button
          onClick={() => { setForm({ categorie: "", limite: "" }); setFormError(""); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <ShoppingCart className="w-4 h-4" />
          Définir un budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--text2)" }}>
          <p className="text-lg font-medium mb-1">Aucun budget défini</p>
          <p className="text-sm">Définissez un budget par catégorie pour suivre vos dépenses.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map((b) => {
            const depense = depensePourCategorie(b.categorie);
            const pct = Math.min(Math.round((depense / b.limite) * 100), 100);
            const overBudget = pct >= 90;
            return (
              <div key={b.id} className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm">{b.categorie}</span>
                  <span className="text-xs font-mono" style={{ color: overBudget ? "var(--red)" : "var(--text2)" }}>
                    {formatMontant(depense)} / {formatMontant(b.limite)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: "var(--bg3)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: overBudget ? "var(--red)" : pct > 70 ? "var(--amber)" : "var(--cyan)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs" style={{ color: "var(--text3)" }}>{pct}% utilisé</span>
                  <span className="text-xs" style={{ color: "var(--text3)" }}>
                    Reste : {formatMontant(Math.max(b.limite - depense, 0))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-slide-up" style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Définir un budget</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--text2)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie *</label>
                <select
                  value={form.categorie}
                  onChange={(e) => setForm((p) => ({ ...p, categorie: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  required
                >
                  <option value="">Choisir une catégorie</option>
                  {categoriesDepense.map((c) => (
                    <option key={c.id} value={c.nom}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Montant limite (FCFA) *</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.limite}
                  onChange={(e) => setForm((p) => ({ ...p, limite: e.target.value }))}
                  placeholder="Ex: 300000"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  required
                />
              </div>
              {formError && (
                <p className="text-xs px-4 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}>
                  {formError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70" style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}>
                  Annuler
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110" style={{ background: "var(--gold)", color: "var(--navy)" }}>
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
