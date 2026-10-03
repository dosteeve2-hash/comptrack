"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Zap,
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Printer,
  RotateCcw,
  FileText,
  CheckCircle2,
  Sparkles,
  User,
  UserCircle2,
} from "lucide-react";
import type { Client, Facture, FactureArticle, ProduitCatalogue, Transaction } from "@/lib/data";
import { useCatalogue, useClients, useFactures, useTransactions } from "@/lib/store";
import { formatMontant, formatDate } from "@/lib/utils";

type Etape = 1 | 2 | 3;
type ModePaiement = "virement" | "especes" | "mobile_money" | "cheque";

const modePaiementLabels: Record<ModePaiement, string> = {
  especes: "Espèces",
  mobile_money: "Mobile Money",
  virement: "Virement",
  cheque: "Chèque",
};

interface CartItem {
  produitId: string;
  nom: string;
  prixUnitaire: number;
  unite: string;
  quantite: number;
}

interface VenteRecapitulatif {
  facture: Facture;
  subtotal: number;
  remisePercent: number;
  montantRemise: number;
  tvaActive: boolean;
  montantTva: number;
  modePaiement: ModePaiement;
  notes: string;
}

const TVA_TAUX = 0.18;

export default function VenteRapidePage() {
  const [catalogue] = useCatalogue();
  const [clients, setClients] = useClients();
  const [factures, setFactures] = useFactures();
  const [, setTransactions] = useTransactions();

  const [etape, setEtape] = useState<Etape>(1);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [remisePercent, setRemisePercent] = useState(0);
  const [tvaActive, setTvaActive] = useState(false);
  const [modePaiement, setModePaiement] = useState<ModePaiement>("especes");
  const [notes, setNotes] = useState("");

  const [recap, setRecap] = useState<VenteRecapitulatif | null>(null);

  const clientsMatch = useMemo(() => {
    if (clientSearch.trim() === "") return [];
    return clients.filter((c) => c.type === "client" && c.nom.toLowerCase().includes(clientSearch.toLowerCase())).slice(0, 6);
  }, [clients, clientSearch]);

  const suggestions = useMemo(() => {
    if (!selectedClient) return [];
    const factsClient = factures
      .filter((f) => f.client === selectedClient.nom && f.statut === "payee")
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
    const vues = new Map<string, FactureArticle>();
    for (const f of factsClient) {
      for (const a of f.articles) {
        if (!vues.has(a.description)) vues.set(a.description, a);
      }
    }
    return Array.from(vues.values()).slice(0, 3);
  }, [selectedClient, factures]);

  const addToCart = (produit: ProduitCatalogue, qte = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.produitId === produit.id);
      if (existing) {
        return prev.map((c) => (c.produitId === produit.id ? { ...c, quantite: c.quantite + qte } : c));
      }
      return [...prev, { produitId: produit.id, nom: produit.nom, prixUnitaire: produit.prixUnitaire, unite: produit.unite, quantite: qte }];
    });
  };

  const addSuggestionToCart = (article: FactureArticle) => {
    const match = catalogue.find((p) => p.nom === article.description);
    if (match) {
      addToCart(match, 1);
    } else {
      setCart((prev) => {
        const existing = prev.find((c) => c.nom === article.description);
        if (existing) return prev.map((c) => (c.nom === article.description ? { ...c, quantite: c.quantite + 1 } : c));
        return [...prev, { produitId: `libre-${article.description}`, nom: article.description, prixUnitaire: article.prixUnitaire, unite: "unité", quantite: 1 }];
      });
    }
  };

  const updateQuantite = (produitId: string, quantite: number) => {
    if (quantite <= 0) {
      setCart((prev) => prev.filter((c) => c.produitId !== produitId));
      return;
    }
    setCart((prev) => prev.map((c) => (c.produitId === produitId ? { ...c, quantite } : c)));
  };

  const removeFromCart = (produitId: string) => {
    setCart((prev) => prev.filter((c) => c.produitId !== produitId));
  };

  const subtotal = cart.reduce((s, c) => s + c.quantite * c.prixUnitaire, 0);
  const montantRemise = subtotal * (remisePercent / 100);
  const baseApresRemise = subtotal - montantRemise;
  const montantTva = tvaActive ? baseApresRemise * TVA_TAUX : 0;
  const totalTTC = baseApresRemise + montantTva;

  const resetVente = () => {
    setEtape(1);
    setClientSearch("");
    setSelectedClient(null);
    setCart([]);
    setRemisePercent(0);
    setTvaActive(false);
    setModePaiement("especes");
    setNotes("");
    setRecap(null);
  };

  const handleConfirmerVente = () => {
    const clientNom = selectedClient ? selectedClient.nom : "Client occasionnel";
    const numero = `FAC-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, "0")}`;
    const dateVente = new Date().toISOString().split("T")[0];
    const articles: FactureArticle[] = cart.map((c) => ({
      description: c.nom,
      quantite: c.quantite,
      prixUnitaire: c.prixUnitaire,
      total: c.quantite * c.prixUnitaire,
    }));

    const newFacture: Facture = {
      id: `f${Date.now()}`,
      numero,
      client: clientNom,
      montant: totalTTC,
      dateCreation: dateVente,
      dateEcheance: dateVente,
      statut: "payee",
      articles,
    };
    setFactures((prev) => [newFacture, ...prev]);

    const newTx: Transaction = {
      id: `tx-vr-${Date.now()}`,
      type: "revenu",
      montant: totalTTC,
      categorie: "Ventes produits",
      description: `Vente rapide ${numero} — ${clientNom}`,
      date: dateVente,
      client: clientNom,
      statut: "validee",
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (selectedClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === selectedClient.id ? { ...c, totalTransactions: c.totalTransactions + totalTTC, dernierContact: dateVente } : c
        )
      );
    }

    setRecap({ facture: newFacture, subtotal, remisePercent, montantRemise, tvaActive, montantTva, modePaiement, notes });
    setEtape(3);
  };

  const handlePrint = () => {
    setTimeout(() => window.print(), 200);
  };

  const etapesConfig = [
    { n: 1 as Etape, label: "Client & produits" },
    { n: 2 as Etape, label: "Récapitulatif" },
    { n: 3 as Etape, label: "Facture" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" style={{ color: "var(--gold)" }} />
            Vente rapide
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            Encaissez un client en quelques secondes
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 no-print">
        {etapesConfig.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium flex-1"
              style={{
                background: etape === s.n ? "rgba(34,197,94,0.12)" : etape > s.n ? "rgba(34,197,94,0.06)" : "var(--bg2)",
                border: `1px solid ${etape >= s.n ? "var(--green)" : "var(--border)"}`,
                color: etape >= s.n ? "var(--green)" : "var(--text2)",
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: etape >= s.n ? "var(--green)" : "var(--bg3)", color: etape >= s.n ? "#000" : "var(--text2)" }}
              >
                {etape > s.n ? "✓" : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < etapesConfig.length - 1 && <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text3)" }} />}
          </div>
        ))}
      </div>

      {/* ─── Étape 1 : Client + produits ─────────────────────────────────── */}
      {etape === 1 && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Client */}
            <div className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-3">Client</h3>
              {selectedClient ? (
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" style={{ color: "var(--green)" }} />
                    <div>
                      <p className="text-sm font-semibold">{selectedClient.nom}</p>
                      <p className="text-xs" style={{ color: "var(--text2)" }}>{selectedClient.ville}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClient(null)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text2)" }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text2)" }} />
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Rechercher un client existant..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                    />
                  </div>
                  {clientsMatch.length > 0 && (
                    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      {clientsMatch.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedClient(c);
                            setClientSearch("");
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-white/[0.03] transition-colors"
                          style={{ borderBottom: "1px solid var(--border)" }}
                        >
                          <span>{c.nom}</span>
                          <span style={{ color: "var(--text2)" }} className="text-xs">{c.ville}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedClient({ id: "occasionnel", nom: "Client occasionnel", type: "client", ville: "", pays: "", totalTransactions: 0, dernierContact: "" })}
                    className="inline-flex items-center gap-2 text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--cyan)" }}
                  >
                    <UserCircle2 className="w-3.5 h-3.5" />
                    Continuer avec un client occasionnel
                  </button>
                </div>
              )}

              {selectedClient && selectedClient.id !== "occasionnel" && suggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "var(--text2)" }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
                    Achats habituels de ce client
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => addSuggestionToCart(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
                        style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "var(--gold)" }}
                      >
                        <Plus className="w-3 h-3" />
                        {s.description}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Catalogue grid */}
            <div className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-3">Produits &amp; services</h3>
              {catalogue.length === 0 ? (
                <div className="text-center py-10" style={{ color: "var(--text2)" }}>
                  <p className="text-sm font-medium mb-1">Votre catalogue est vide</p>
                  <Link href="/catalogue" className="text-xs font-medium" style={{ color: "var(--green)" }}>
                    Ajouter des produits →
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {catalogue.map((p) => {
                    const inCart = cart.find((c) => c.produitId === p.id);
                    return (
                      <div key={p.id} className="p-3 rounded-xl" style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{p.nom}</p>
                            <p className="text-xs font-mono" style={{ color: "var(--green)" }}>
                              {formatMontant(p.prixUnitaire)} / {p.unite}
                            </p>
                          </div>
                        </div>
                        {inCart ? (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantite(p.id, inCart.quantite - 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                                style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-mono font-semibold w-6 text-center">{inCart.quantite}</span>
                              <button
                                onClick={() => updateQuantite(p.id, inCart.quantite + 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                                style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-mono" style={{ color: "var(--text2)" }}>
                              {formatMontant(inCart.quantite * inCart.prixUnitaire)}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(p)}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
                            style={{ background: "var(--green)", color: "#000" }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Ajouter
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cart sidebar */}
          <div className="lg:col-span-1">
            <div className="p-5 rounded-2xl border sticky top-6" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-3">Panier</h3>
              {cart.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "var(--text2)" }}>
                  Aucun article sélectionné
                </p>
              ) : (
                <div className="space-y-2 mb-4">
                  {cart.map((c) => (
                    <div key={c.produitId} className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate">{c.nom}</p>
                        <p className="text-xs" style={{ color: "var(--text2)" }}>{c.quantite} × {formatMontant(c.prixUnitaire)}</p>
                      </div>
                      <span className="font-mono font-semibold flex-shrink-0">{formatMontant(c.quantite * c.prixUnitaire)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t mb-4" style={{ borderColor: "var(--border)" }}>
                <span className="font-semibold">Total</span>
                <span className="font-bold font-mono text-lg" style={{ color: "var(--green)" }}>{formatMontant(subtotal)}</span>
              </div>
              <button
                onClick={() => setEtape(2)}
                disabled={cart.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
                style={{ background: "var(--green)", color: "#000" }}
              >
                Suivant <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Étape 2 : Récapitulatif ─────────────────────────────────────── */}
      {etape === 2 && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-semibold">Articles</h3>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {cart.map((c) => (
                  <div key={c.produitId} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.nom}</p>
                      <p className="text-xs font-mono" style={{ color: "var(--text2)" }}>{formatMontant(c.prixUnitaire)} / {c.unite}</p>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={c.quantite}
                      onChange={(e) => updateQuantite(c.produitId, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 rounded-lg text-sm text-center outline-none"
                      style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                    />
                    <span className="w-24 text-right text-sm font-mono font-semibold">{formatMontant(c.quantite * c.prixUnitaire)}</span>
                    <button onClick={() => removeFromCart(c.produitId)} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--red)" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border space-y-4" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div>
                <label className="block text-sm font-medium mb-2">Mode de paiement</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(modePaiementLabels) as ModePaiement[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setModePaiement(m)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: modePaiement === m ? "rgba(34,197,94,0.12)" : "var(--bg3)",
                        border: `1px solid ${modePaiement === m ? "var(--green)" : "var(--border2)"}`,
                        color: modePaiement === m ? "var(--green)" : "var(--text2)",
                      }}
                    >
                      {modePaiementLabels[m]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Remarques optionnelles..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                />
              </div>
            </div>
          </div>

          {/* Totals sidebar */}
          <div className="lg:col-span-1">
            <div className="p-5 rounded-2xl border sticky top-6 space-y-4" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold">Totaux</h3>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text2)" }}>Remise (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={remisePercent}
                  onChange={(e) => setRemisePercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                />
              </div>

              <label className="flex items-center justify-between text-sm cursor-pointer">
                <span style={{ color: "var(--text2)" }}>Appliquer la TVA (18%)</span>
                <input type="checkbox" checked={tvaActive} onChange={(e) => setTvaActive(e.target.checked)} className="w-4 h-4 accent-green-500" />
              </label>

              <div className="space-y-2 pt-3 border-t text-sm" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text2)" }}>Sous-total</span>
                  <span className="font-mono">{formatMontant(subtotal)}</span>
                </div>
                {remisePercent > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text2)" }}>Remise ({remisePercent}%)</span>
                    <span className="font-mono" style={{ color: "var(--red)" }}>-{formatMontant(montantRemise)}</span>
                  </div>
                )}
                {tvaActive && (
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text2)" }}>TVA (18%)</span>
                    <span className="font-mono">{formatMontant(montantTva)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "var(--border2)" }}>
                  <span className="font-semibold">Total TTC</span>
                  <span className="font-bold font-mono text-lg" style={{ color: "var(--green)" }}>{formatMontant(totalTTC)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEtape(1)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                  style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
                >
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
                <button
                  onClick={handleConfirmerVente}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: "var(--green)", color: "#000" }}
                >
                  Confirmer <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Étape 3 : Confirmation + Facture ────────────────────────────── */}
      {etape === 3 && recap && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-xl no-print" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--green)" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--green)" }}>Vente enregistrée avec succès</p>
              <p className="text-xs" style={{ color: "var(--text2)" }}>La facture et la transaction ont été créées automatiquement.</p>
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden print-facture" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
            <div className="p-6">
              <div className="flex justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono" style={{ background: "var(--green)", color: "#000" }}>
                      CT
                    </div>
                    <span className="font-bold">CompTrack</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg">{recap.facture.numero}</p>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "var(--green)" }}>
                    Payée
                  </span>
                  <p className="text-xs mt-2" style={{ color: "var(--text2)" }}>Émise le {formatDate(recap.facture.dateCreation)}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl mb-6" style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--text2)" }}>Facturé à</p>
                <p className="font-semibold">{recap.facture.client}</p>
              </div>

              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                    <th className="text-left py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Description</th>
                    <th className="text-right py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Qté</th>
                    <th className="text-right py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Prix unit.</th>
                    <th className="text-right py-2 text-xs font-medium uppercase" style={{ color: "var(--text2)" }}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {recap.facture.articles.map((art, i) => (
                    <tr key={i}>
                      <td className="py-3">{art.description}</td>
                      <td className="py-3 text-right font-mono">{art.quantite}</td>
                      <td className="py-3 text-right font-mono">{formatMontant(art.prixUnitaire)}</td>
                      <td className="py-3 text-right font-mono font-semibold">{formatMontant(art.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-3 text-right text-xs" style={{ color: "var(--text2)" }}>Sous-total</td>
                    <td className="pt-3 text-right font-mono text-xs">{formatMontant(recap.subtotal)}</td>
                  </tr>
                  {recap.remisePercent > 0 && (
                    <tr>
                      <td colSpan={3} className="pt-1 text-right text-xs" style={{ color: "var(--text2)" }}>Remise ({recap.remisePercent}%)</td>
                      <td className="pt-1 text-right font-mono text-xs" style={{ color: "var(--red)" }}>-{formatMontant(recap.montantRemise)}</td>
                    </tr>
                  )}
                  {recap.tvaActive && (
                    <tr>
                      <td colSpan={3} className="pt-1 text-right text-xs" style={{ color: "var(--text2)" }}>TVA (18%)</td>
                      <td className="pt-1 text-right font-mono text-xs">{formatMontant(recap.montantTva)}</td>
                    </tr>
                  )}
                  <tr className="border-t" style={{ borderColor: "var(--border2)" }}>
                    <td colSpan={3} className="py-3 font-bold text-right">TOTAL TTC</td>
                    <td className="py-3 text-right font-bold font-mono text-lg" style={{ color: "var(--green)" }}>{formatMontant(recap.facture.montant)}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="flex justify-between text-xs" style={{ color: "var(--text2)" }}>
                <span>Paiement : {modePaiementLabels[recap.modePaiement]}</span>
                {recap.notes && <span>Note : {recap.notes}</span>}
              </div>
              <p className="text-xs text-center mt-6" style={{ color: "var(--text2)" }}>
                Merci pour votre confiance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 no-print">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: "var(--green)", color: "#000" }}
            >
              <Printer className="w-4 h-4" /> Imprimer / PDF
            </button>
            <button
              onClick={resetVente}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
              style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
            >
              <RotateCcw className="w-4 h-4" /> Nouvelle vente
            </button>
            <Link
              href="/factures"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
              style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
            >
              <FileText className="w-4 h-4" /> Voir la facture
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
