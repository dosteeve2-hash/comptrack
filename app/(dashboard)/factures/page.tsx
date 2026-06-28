"use client";

import { useState } from "react";
import { Plus, Download, X, Printer, Eye, ChevronDown, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { factures as initialFactures, clients } from "@/lib/data";
import type { Facture, FactureArticle, Transaction } from "@/lib/data";
import { formatMontant, formatDate } from "@/lib/utils";

const statutConfig: Record<
  Facture["statut"],
  { label: string; bg: string; color: string }
> = {
  brouillon: { label: "Brouillon", bg: "rgba(139,148,158,0.1)", color: "var(--text2)" },
  envoyee: { label: "Envoyée", bg: "rgba(59,130,246,0.1)", color: "var(--blue)" },
  en_attente: { label: "En attente", bg: "rgba(245,158,11,0.1)", color: "var(--amber)" },
  payee: { label: "Payée", bg: "rgba(34,197,94,0.1)", color: "var(--green)" },
  retard: { label: "En retard", bg: "rgba(239,68,68,0.1)", color: "var(--red)" },
};

// Ordre des statuts pour le flux
const statutSuivant: Partial<Record<Facture["statut"], Facture["statut"]>> = {
  brouillon: "envoyee",
  envoyee: "en_attente",
  en_attente: "payee",
};

interface NewFactureForm {
  client: string;
  dateEcheance: string;
  articles: FactureArticle[];
}

const defaultArticle = (): FactureArticle => ({
  description: "",
  quantite: 1,
  prixUnitaire: 0,
  total: 0,
});

export default function FacturesPage() {
  const [factureList, setFactureList] = useState<Facture[]>(initialFactures);
  const [txCreees, setTxCreees] = useState<Transaction[]>([]); // transactions auto-créées via "Marquer payée"
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterStatut, setFilterStatut] = useState<"all" | Facture["statut"]>("all");
  const [form, setForm] = useState<NewFactureForm>({
    client: "",
    dateEcheance: "",
    articles: [defaultArticle()],
  });
  const [formError, setFormError] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAvancerStatut = (id: string) => {
    setFactureList((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const next = statutSuivant[f.statut];
        if (!next) return f;
        const updated = { ...f, statut: next };
        if (next === "payee") {
          // Créer une transaction revenu automatiquement
          const newTx: Transaction = {
            id: `tx-fac-${Date.now()}`,
            type: "revenu",
            montant: f.montant,
            categorie: "Prestations services",
            description: `Paiement ${f.numero} — ${f.client}`,
            date: new Date().toISOString().split("T")[0],
            client: f.client,
            statut: "validee",
          };
          setTxCreees((prev) => [newTx, ...prev]);
          showToast(`✓ Facture marquée payée · Transaction revenu créée automatiquement`);
          // Mettre à jour selectedFacture si c'est celle-là
          setSelectedFacture((sel) => sel?.id === id ? updated : sel);
        }
        return updated;
      })
    );
  };

  const filtered = factureList.filter(
    (f) => filterStatut === "all" || f.statut === filterStatut
  );

  const totalPayee = factureList
    .filter((f) => f.statut === "payee")
    .reduce((s, f) => s + f.montant, 0);
  const totalEnCours = factureList
    .filter((f) => ["envoyee", "en_attente"].includes(f.statut))
    .reduce((s, f) => s + f.montant, 0);
  const totalRetard = factureList
    .filter((f) => f.statut === "retard")
    .reduce((s, f) => s + f.montant, 0);

  const updateArticle = (
    idx: number,
    field: keyof FactureArticle,
    value: string | number
  ) => {
    setForm((prev) => {
      const arts = [...prev.articles];
      arts[idx] = { ...arts[idx], [field]: value } as FactureArticle;
      if (field === "quantite" || field === "prixUnitaire") {
        arts[idx].total = arts[idx].quantite * arts[idx].prixUnitaire;
      }
      return { ...prev, articles: arts };
    });
  };

  const handleCreateFacture = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.client || !form.dateEcheance) {
      setFormError("Client et date d'échéance obligatoires.");
      return;
    }
    if (form.articles.some((a) => !a.description || a.prixUnitaire <= 0)) {
      setFormError("Tous les articles doivent avoir une description et un prix.");
      return;
    }

    const montantTotal = form.articles.reduce((s, a) => s + a.total, 0);
    const newFacture: Facture = {
      id: `f${Date.now()}`,
      numero: `FAC-2026-${String(factureList.length + 1).padStart(3, "0")}`,
      client: form.client,
      montant: montantTotal,
      dateCreation: new Date().toISOString().split("T")[0],
      dateEcheance: form.dateEcheance,
      statut: "brouillon",
      articles: form.articles,
    };

    setFactureList((prev) => [newFacture, ...prev]);
    setForm({ client: "", dateEcheance: "", articles: [defaultArticle()] });
    setCreateOpen(false);
  };

  const handlePrint = (facture: Facture) => {
    setSelectedFacture(facture);
    setTimeout(() => window.print(), 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Factures</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {filtered.length} facture{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ client: "", dateEcheance: "", articles: [defaultArticle()] });
            setFormError("");
            setCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--green)", color: "#000" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Encaissé", value: totalPayee, color: "var(--green)" },
          { label: "En cours", value: totalEnCours, color: "var(--amber)" },
          { label: "En retard", value: totalRetard, color: "var(--red)" },
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
              {formatMontant(s.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Flux info */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
        style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", color: "var(--text2)" }}
      >
        <span style={{ color: "var(--blue)" }}>Flux :</span>
        {(["brouillon", "envoyee", "en_attente", "payee"] as const).map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span style={{ color: statutConfig[s].color }}>{statutConfig[s].label}</span>
            {i < 3 && <ArrowRight className="w-3 h-3" />}
          </span>
        ))}
        <span className="ml-2">· Utilisez le bouton ▶ sur chaque facture pour avancer le statut</span>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
        {(["all", "brouillon", "envoyee", "en_attente", "payee", "retard"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatut(s)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filterStatut === s ? "var(--bg3)" : "transparent",
              color: filterStatut === s ? "var(--text)" : "var(--text2)",
              border: filterStatut === s ? "1px solid var(--border2)" : "1px solid transparent",
            }}
          >
            {s === "all" ? "Toutes" : statutConfig[s].label}
          </button>
        ))}
      </div>

      {/* Transactions auto-créées */}
      {txCreees.length > 0 && (
        <div
          className="p-4 rounded-xl text-sm"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: "var(--green)" }}>
            ✓ {txCreees.length} transaction{txCreees.length > 1 ? "s" : ""} revenu créée{txCreees.length > 1 ? "s" : ""} automatiquement
          </p>
          <p className="text-xs" style={{ color: "var(--text2)" }}>
            Ces transactions sont disponibles dans l&apos;onglet Transactions.
          </p>
        </div>
      )}

      {/* Toast notification */}
      {toastMsg && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg animate-slide-up"
          style={{ background: "var(--green)", color: "#000" }}
        >
          {toastMsg}
        </div>
      )}

      {/* Factures list */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-xs font-medium uppercase tracking-wider"
                style={{ borderColor: "var(--border)", color: "var(--text2)" }}
              >
                <th className="text-left px-6 py-3">N° Facture</th>
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3">Émise le</th>
                <th className="text-left px-4 py-3">Échéance</th>
                <th className="text-left px-4 py-3">Statut</th>
                <th className="text-right px-4 py-3">Montant</th>
                <th className="text-center px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map((f) => {
                const statut = statutConfig[f.statut];
                return (
                  <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold">{f.numero}</span>
                    </td>
                    <td className="px-4 py-4 font-medium">{f.client}</td>
                    <td className="px-4 py-4 text-xs font-mono" style={{ color: "var(--text2)" }}>
                      {formatDate(f.dateCreation)}
                    </td>
                    <td className="px-4 py-4 text-xs font-mono" style={{ color: "var(--text2)" }}>
                      {formatDate(f.dateEcheance)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: statut.bg, color: statut.color }}
                      >
                        {statut.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold font-mono">
                      {formatMontant(f.montant)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedFacture(f)}
                          className="p-1.5 rounded-lg transition-all hover:opacity-70"
                          style={{ color: "var(--blue)" }}
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrint(f)}
                          className="p-1.5 rounded-lg transition-all hover:opacity-70"
                          style={{ color: "var(--text2)" }}
                          title="Imprimer / PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {statutSuivant[f.statut] && (
                          <button
                            onClick={() => handleAvancerStatut(f.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
                            style={{
                              background: statutSuivant[f.statut] === "payee"
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(59,130,246,0.1)",
                              color: statutSuivant[f.statut] === "payee"
                                ? "var(--green)"
                                : "var(--blue)",
                              border: `1px solid ${statutSuivant[f.statut] === "payee" ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`,
                            }}
                            title={`Passer à : ${statutConfig[statutSuivant[f.statut]!].label}`}
                          >
                            {statutSuivant[f.statut] === "payee" ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" />&nbsp;Payée</>
                            ) : statutSuivant[f.statut] === "en_attente" ? (
                              <><Send className="w-3.5 h-3.5" />&nbsp;Envoyer</>
                            ) : (
                              <><ArrowRight className="w-3.5 h-3.5" />&nbsp;{statutConfig[statutSuivant[f.statut]!].label}</>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facture detail modal */}
      {selectedFacture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl overflow-hidden animate-slide-up"
            style={{ background: "var(--bg2)", border: "1px solid var(--border2)", maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="font-bold">{selectedFacture.numero}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(selectedFacture)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
                  style={{ background: "var(--green)", color: "#000" }}
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => setSelectedFacture(null)}
                  className="p-1.5 rounded-lg hover:opacity-70"
                  style={{ color: "var(--text2)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Facture content */}
            <div className="p-6 print-facture">
              {/* Header facture */}
              <div className="flex justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono"
                      style={{ background: "var(--green)", color: "#000" }}
                    >
                      CT
                    </div>
                    <span className="font-bold">CompTrack</span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>Mon Commerce</p>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>Ouagadougou, Burkina Faso</p>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>contact@moncommerce.bf</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg">{selectedFacture.numero}</p>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: statutConfig[selectedFacture.statut].bg,
                      color: statutConfig[selectedFacture.statut].color,
                    }}
                  >
                    {statutConfig[selectedFacture.statut].label}
                  </span>
                  <p className="text-xs mt-2" style={{ color: "var(--text2)" }}>
                    Émise le {formatDate(selectedFacture.dateCreation)}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text2)" }}>
                    Échéance {formatDate(selectedFacture.dateEcheance)}
                  </p>
                </div>
              </div>

              {/* Client */}
              <div
                className="p-4 rounded-xl mb-6"
                style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--text2)" }}>
                  Facturé à
                </p>
                <p className="font-semibold">{selectedFacture.client}</p>
              </div>

              {/* Articles */}
              <table className="w-full text-sm mb-6">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <th className="text-left py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Description</th>
                    <th className="text-right py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Qté</th>
                    <th className="text-right py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Prix unit.</th>
                    <th className="text-right py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {selectedFacture.articles.map((art, i) => (
                    <tr key={i}>
                      <td className="py-3">{art.description}</td>
                      <td className="py-3 text-right font-mono">{art.quantite}</td>
                      <td className="py-3 text-right font-mono">{formatMontant(art.prixUnitaire)}</td>
                      <td className="py-3 text-right font-mono font-semibold">{formatMontant(art.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t" style={{ borderColor: "var(--border2)" }}>
                    <td colSpan={3} className="py-3 font-bold text-right">TOTAL</td>
                    <td className="py-3 text-right font-bold font-mono text-lg" style={{ color: "var(--green)" }}>
                      {formatMontant(selectedFacture.montant)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <p className="text-xs text-center" style={{ color: "var(--text2)" }}>
                Merci pour votre confiance · Paiement par virement ou mobile money
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create facture modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 animate-slide-up overflow-y-auto"
            style={{ background: "var(--bg2)", border: "1px solid var(--border2)", maxHeight: "90vh" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Nouvelle facture</h2>
              <button
                onClick={() => setCreateOpen(false)}
                className="p-1.5 rounded-lg hover:opacity-70"
                style={{ color: "var(--text2)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFacture} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Client *</label>
                  <div className="relative">
                    <select
                      value={form.client}
                      onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-8 rounded-xl text-sm outline-none appearance-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: form.client ? "var(--text)" : "var(--text2)",
                      }}
                      required
                    >
                      <option value="">Choisir un client</option>
                      {clients
                        .filter((c) => c.type === "client")
                        .map((c) => (
                          <option key={c.id} value={c.nom}>
                            {c.nom}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text2)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Échéance *</label>
                  <input
                    type="date"
                    value={form.dateEcheance}
                    onChange={(e) => setForm((p) => ({ ...p, dateEcheance: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Articles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Articles *</label>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, articles: [...p.articles, defaultArticle()] }))}
                    className="text-xs transition-opacity hover:opacity-70"
                    style={{ color: "var(--green)" }}
                  >
                    + Ajouter un article
                  </button>
                </div>
                <div className="space-y-3">
                  {form.articles.map((art, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl space-y-2"
                      style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
                    >
                      <input
                        type="text"
                        value={art.description}
                        onChange={(e) => updateArticle(i, "description", e.target.value)}
                        placeholder="Description de l'article"
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{
                          background: "var(--bg2)",
                          border: "1px solid var(--border2)",
                          color: "var(--text)",
                        }}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>Quantité</p>
                          <input
                            type="number"
                            min="1"
                            value={art.quantite}
                            onChange={(e) => updateArticle(i, "quantite", parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{
                              background: "var(--bg2)",
                              border: "1px solid var(--border2)",
                              color: "var(--text)",
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>Prix unit. (FCFA)</p>
                          <input
                            type="number"
                            min="0"
                            value={art.prixUnitaire}
                            onChange={(e) => updateArticle(i, "prixUnitaire", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{
                              background: "var(--bg2)",
                              border: "1px solid var(--border2)",
                              color: "var(--text)",
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>Total</p>
                          <p
                            className="px-3 py-2 rounded-lg text-sm font-mono font-semibold"
                            style={{ background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--green)" }}
                          >
                            {formatMontant(art.total)}
                          </p>
                        </div>
                      </div>
                      {form.articles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, articles: p.articles.filter((_, j) => j !== i) }))}
                          className="text-xs transition-opacity hover:opacity-70"
                          style={{ color: "var(--red)" }}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div
                className="flex justify-between items-center p-3 rounded-xl"
                style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
              >
                <span className="font-semibold">Total facture</span>
                <span className="font-bold font-mono text-lg" style={{ color: "var(--green)" }}>
                  {formatMontant(form.articles.reduce((s, a) => s + a.total, 0))}
                </span>
              </div>

              {formError && (
                <p className="text-xs px-4 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}>
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-70"
                  style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110"
                  style={{ background: "var(--green)", color: "#000" }}
                >
                  Créer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
