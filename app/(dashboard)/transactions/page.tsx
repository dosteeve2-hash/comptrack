"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  X,
  ChevronDown,
  List,
  BookOpen,
  Download,
} from "lucide-react";
import { exportTransactions } from "@/lib/export";
import { transactions as initialTransactions, categories } from "@/lib/data";
import type { Transaction } from "@/lib/data";
import { formatMontant, formatDate } from "@/lib/utils";

interface NewTransactionForm {
  type: "revenu" | "depense";
  montant: string;
  categorie: string;
  description: string;
  date: string;
  client: string;
}

const defaultForm: NewTransactionForm = {
  type: "revenu",
  montant: "",
  categorie: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  client: "",
};

const statutLabels: Record<Transaction["statut"], { label: string; color: string }> = {
  validee: { label: "Validée", color: "var(--green)" },
  en_attente: { label: "En attente", color: "var(--amber)" },
  annulee: { label: "Annulée", color: "var(--text2)" },
};

type VueTx = "simple" | "journal";

// Mapping des catégories vers des comptes comptables (plan SYSCOHADA simplifié)
const compteParCategorie: Record<string, { debit: string; credit: string }> = {
  "Ventes produits":       { debit: "5111 - Banque",             credit: "7011 - Ventes marchandes" },
  "Prestations services":  { debit: "5111 - Banque",             credit: "7061 - Prestations services" },
  "Consultations":         { debit: "5111 - Banque",             credit: "7061 - Prestations services" },
  "Achat stock":           { debit: "3021 - Achats marchandises", credit: "5111 - Banque" },
  "Salaires":              { debit: "6611 - Salaires",           credit: "5111 - Banque" },
  "Loyer":                 { debit: "6211 - Loyers",             credit: "5111 - Banque" },
  "Transport":             { debit: "6241 - Transport",          credit: "5111 - Banque" },
  "Télécommunications":    { debit: "6261 - Télécoms",           credit: "5111 - Banque" },
  "Électricité/Eau":       { debit: "6055 - Énergie/Eau",        credit: "5111 - Banque" },
  "Fournitures bureau":    { debit: "6011 - Fournitures",        credit: "5111 - Banque" },
  "Marketing":             { debit: "6631 - Publicité",          credit: "5111 - Banque" },
  "Maintenance":           { debit: "6051 - Entretien",          credit: "5111 - Banque" },
};

export default function TransactionsPage() {
  const [txList, setTxList] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "revenu" | "depense">("all");
  const [filterCat, setFilterCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NewTransactionForm>(defaultForm);
  const [formError, setFormError] = useState("");
  const [vue, setVue] = useState<VueTx>("simple");

  // Filtered list
  const filtered = useMemo(() => {
    return txList.filter((tx) => {
      const matchSearch =
        search === "" ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.categorie.toLowerCase().includes(search.toLowerCase()) ||
        (tx.client ?? "").toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || tx.type === filterType;
      const matchCat = filterCat === "all" || tx.categorie === filterCat;
      return matchSearch && matchType && matchCat;
    });
  }, [txList, search, filterType, filterCat]);

  // Totals
  const totalRevenus = filtered
    .filter((t) => t.type === "revenu")
    .reduce((s, t) => s + t.montant, 0);
  const totalDepenses = filtered
    .filter((t) => t.type === "depense")
    .reduce((s, t) => s + t.montant, 0);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as NewTransactionForm));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.montant || !form.categorie || !form.description || !form.date) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const montant = parseFloat(form.montant.replace(/\s/g, ""));
    if (isNaN(montant) || montant <= 0) {
      setFormError("Le montant doit être un nombre positif.");
      return;
    }

    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: form.type,
      montant,
      categorie: form.categorie,
      description: form.description,
      date: form.date,
      client: form.client || undefined,
      statut: "validee",
    };

    setTxList((prev) => [newTx, ...prev]);
    setForm(defaultForm);
    setModalOpen(false);
  };

  const availableCategories = useMemo(
    () => categories.filter((c) => c.type === form.type || c.type === "les_deux"),
    [form.type]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} affichée
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Vue toggle */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
            {([
              { id: "simple", label: "Vue simple", icon: List },
              { id: "journal", label: "Journal comptable", icon: BookOpen },
            ] as const).map((v) => (
              <button
                key={v.id}
                onClick={() => setVue(v.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: vue === v.id ? "var(--bg3)" : "transparent",
                  color: vue === v.id ? "var(--text)" : "var(--text2)",
                  border: vue === v.id ? "1px solid var(--border2)" : "1px solid transparent",
                }}
              >
                <v.icon className="w-3.5 h-3.5" />
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => exportTransactions(filtered)}
            title={`Exporter ${filtered.length} transaction(s) en CSV`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ border: "1px solid var(--border2)", color: "var(--text2)", background: "var(--bg2)" }}
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
          <button
            onClick={() => {
              setForm(defaultForm);
              setFormError("");
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: "var(--green)", color: "#000" }}
          >
            <Plus className="w-4 h-4" />
            Nouvelle transaction
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total revenus", value: totalRevenus, color: "var(--green)" },
          { label: "Total dépenses", value: totalDepenses, color: "var(--red)" },
          { label: "Solde filtré", value: totalRevenus - totalDepenses, color: "var(--blue)" },
        ].map((s, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>
              {s.label}
            </p>
            <p className="font-bold font-mono" style={{ color: s.color }}>
              {formatMontant(Math.abs(s.value))}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text2)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une transaction..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
            }}
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg3)" }}>
          {(["all", "revenu", "depense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filterType === t ? "var(--bg2)" : "transparent",
                color: filterType === t ? "var(--text)" : "var(--text2)",
                border: filterType === t ? "1px solid var(--border2)" : "1px solid transparent",
              }}
            >
              {t === "all" ? "Tout" : t === "revenu" ? "Revenus" : "Dépenses"}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: "var(--text2)" }}
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-xl text-sm outline-none appearance-none"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
            }}
          >
            <option value="all">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.nom}>
                {c.nom}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "var(--text2)" }}
          />
        </div>
      </div>

      {/* Vue journal comptable */}
      {vue === "journal" && (
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          <div
            className="px-6 py-4 border-b flex items-start gap-3"
            style={{ borderColor: "var(--border)", background: "rgba(59,130,246,0.04)" }}
          >
            <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--blue)" }} />
            <div>
              <p className="text-sm font-semibold">Journal comptable — double entrée (SYSCOHADA)</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                Chaque opération génère un débit et un crédit d&apos;égale valeur. Débit = ressources utilisées. Crédit = origine des ressources.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-medium uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text2)" }}>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-4 py-3">Libellé</th>
                  <th className="text-left px-4 py-3">Compte débité</th>
                  <th className="text-left px-4 py-3">Compte crédité</th>
                  <th className="text-right px-4 py-3">Débit</th>
                  <th className="text-right px-6 py-3">Crédit</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12" style={{ color: "var(--text2)" }}>
                      Aucune transaction
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => {
                    const comptes = compteParCategorie[tx.categorie] ?? {
                      debit: tx.type === "revenu" ? "5111 - Banque" : "6099 - Charges diverses",
                      credit: tx.type === "revenu" ? "7099 - Produits divers" : "5111 - Banque",
                    };
                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3 text-xs font-mono" style={{ color: "var(--text2)" }}>
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-xs truncate max-w-xs">{tx.description}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>{tx.categorie}</p>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--green)" }}>
                          {comptes.debit}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--blue)" }}>
                          {comptes.credit}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm" style={{ color: "var(--green)" }}>
                          {tx.type === "revenu" ? formatMontant(tx.montant) : "—"}
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-sm" style={{ color: "var(--red)" }}>
                          {tx.type === "depense" ? formatMontant(tx.montant) : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="border-t font-bold" style={{ borderColor: "var(--border2)", background: "var(--bg3)" }}>
                    <td colSpan={4} className="px-6 py-3 text-xs uppercase tracking-wider" style={{ color: "var(--text2)" }}>
                      Totaux
                    </td>
                    <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--green)" }}>
                      {formatMontant(filtered.filter(t => t.type === "revenu").reduce((s, t) => s + t.montant, 0))}
                    </td>
                    <td className="px-6 py-3 text-right font-mono" style={{ color: "var(--red)" }}>
                      {formatMontant(filtered.filter(t => t.type === "depense").reduce((s, t) => s + t.montant, 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Table vue simple */}
      {vue === "simple" && (
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text2)" }}>
            <p className="text-lg font-medium mb-1">Aucune transaction trouvée</p>
            <p className="text-sm">Modifiez vos filtres ou ajoutez une nouvelle transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-xs font-medium uppercase tracking-wider"
                  style={{ borderColor: "var(--border)", color: "var(--text2)" }}
                >
                  <th className="text-left px-6 py-3">Type</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-left px-4 py-3">Catégorie</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Client/Fourn.</th>
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-right px-6 py-3">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background:
                            tx.type === "revenu"
                              ? "rgba(34,197,94,0.1)"
                              : "rgba(239,68,68,0.1)",
                        }}
                      >
                        {tx.type === "revenu" ? (
                          <ArrowUpRight className="w-4 h-4" style={{ color: "var(--green)" }} />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" style={{ color: "var(--red)" }} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium truncate max-w-xs">{tx.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-medium"
                        style={{ background: "var(--bg3)", color: "var(--text2)" }}
                      >
                        {tx.categorie}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono" style={{ color: "var(--text2)" }}>
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-4 text-xs" style={{ color: "var(--text2)" }}>
                      {tx.client ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-xs font-medium font-mono"
                        style={{ color: statutLabels[tx.statut].color }}
                      >
                        ● {statutLabels[tx.statut].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className="font-bold font-mono"
                        style={{
                          color: tx.type === "revenu" ? "var(--green)" : "var(--red)",
                        }}
                      >
                        {tx.type === "revenu" ? "+" : "-"}
                        {formatMontant(tx.montant)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 animate-slide-up"
            style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Nouvelle transaction</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg transition-all hover:opacity-70"
                style={{ color: "var(--text2)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <div className="flex gap-2">
                  {(["revenu", "depense"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, type: t, categorie: "" }))}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background:
                          form.type === t
                            ? t === "revenu"
                              ? "rgba(34,197,94,0.15)"
                              : "rgba(239,68,68,0.15)"
                            : "var(--bg3)",
                        border:
                          form.type === t
                            ? `1px solid ${t === "revenu" ? "var(--green)" : "var(--red)"}`
                            : "1px solid var(--border2)",
                        color:
                          form.type === t
                            ? t === "revenu"
                              ? "var(--green)"
                              : "var(--red)"
                            : "var(--text2)",
                      }}
                    >
                      {t === "revenu" ? "↑ Revenu" : "↓ Dépense"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Montant */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="montant">
                  Montant (FCFA) *
                </label>
                <input
                  id="montant"
                  name="montant"
                  type="number"
                  min="0"
                  step="100"
                  value={form.montant}
                  onChange={handleFormChange}
                  placeholder="Ex: 150000"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
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
                <label className="block text-sm font-medium mb-2" htmlFor="categorie">
                  Catégorie *
                </label>
                <div className="relative">
                  <select
                    id="categorie"
                    name="categorie"
                    value={form.categorie}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 pr-8 rounded-xl text-sm outline-none appearance-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: form.categorie ? "var(--text)" : "var(--text2)",
                    }}
                    required
                  >
                    <option value="">Choisir une catégorie</option>
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.nom}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "var(--text2)" }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="description">
                  Description *
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Ex: Vente tissus wax — client Aminata"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border2)",
                    color: "var(--text)",
                  }}
                  required
                />
              </div>

              {/* Date + Client row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="date">
                    Date *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleFormChange}
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
                  <label className="block text-sm font-medium mb-2" htmlFor="client">
                    Client / Fournisseur
                  </label>
                  <input
                    id="client"
                    name="client"
                    type="text"
                    value={form.client}
                    onChange={handleFormChange}
                    placeholder="Optionnel"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs px-4 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}>
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                  style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: "var(--green)", color: "#000" }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
