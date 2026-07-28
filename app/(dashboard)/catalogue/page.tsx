"use client";

import { useState, useMemo } from "react";
import { Package, PackagePlus, Search, X, Pencil, Trash2, Tag } from "lucide-react";
import type { ProduitCatalogue } from "@/lib/data";
import { useCatalogue } from "@/lib/store";
import { formatMontant, formatDate } from "@/lib/utils";

const categorieConfig: Record<
  ProduitCatalogue["categorie"],
  { label: string; bg: string; color: string }
> = {
  produit: { label: "Produit physique", bg: "rgba(34,197,94,0.1)", color: "var(--green)" },
  service: { label: "Service", bg: "rgba(59,130,246,0.1)", color: "var(--blue)" },
  immobilier: { label: "Immobilier", bg: "rgba(245,158,11,0.1)", color: "var(--amber)" },
  autre: { label: "Autre", bg: "rgba(139,148,158,0.1)", color: "var(--text2)" },
};

interface ProduitForm {
  nom: string;
  description: string;
  categorie: ProduitCatalogue["categorie"];
  prixUnitaire: string;
  unite: string;
  stock: string;
}

const defaultForm: ProduitForm = {
  nom: "",
  description: "",
  categorie: "produit",
  prixUnitaire: "",
  unite: "pièce",
  stock: "",
};

export default function CataloguePage() {
  const [catalogue, setCatalogue] = useCatalogue();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<"all" | ProduitCatalogue["categorie"]>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProduitForm>(defaultForm);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    return catalogue.filter((p) => {
      const matchSearch =
        search === "" ||
        p.nom.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === "all" || p.categorie === filterCat;
      return matchSearch && matchCat;
    });
  }, [catalogue, search, filterCat]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (p: ProduitCatalogue) => {
    setEditingId(p.id);
    setForm({
      nom: p.nom,
      description: p.description ?? "",
      categorie: p.categorie,
      prixUnitaire: String(p.prixUnitaire),
      unite: p.unite,
      stock: p.stock != null ? String(p.stock) : "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCatalogue((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const prix = parseFloat(form.prixUnitaire);
    if (!form.nom.trim() || !form.unite.trim() || isNaN(prix) || prix <= 0) {
      setFormError("Le nom, l'unité et un prix unitaire valide sont obligatoires.");
      return;
    }
    const stock = form.stock.trim() === "" ? undefined : parseInt(form.stock, 10);

    if (editingId) {
      setCatalogue((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, nom: form.nom, description: form.description || undefined, categorie: form.categorie, prixUnitaire: prix, unite: form.unite, stock }
            : p
        )
      );
    } else {
      const newProduit: ProduitCatalogue = {
        id: `pc${Date.now()}`,
        nom: form.nom,
        description: form.description || undefined,
        categorie: form.categorie,
        prixUnitaire: prix,
        unite: form.unite,
        stock,
        dateCreation: new Date().toISOString().split("T")[0],
      };
      setCatalogue((prev) => [newProduit, ...prev]);
    }
    setModalOpen(false);
  };

  const nbProduits = catalogue.length;
  const valeurStock = catalogue.reduce((s, p) => s + (p.stock != null ? p.stock * p.prixUnitaire : 0), 0);
  const prixMoyen = catalogue.length > 0 ? catalogue.reduce((s, p) => s + p.prixUnitaire, 0) / catalogue.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catalogue</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {filtered.length} produit{filtered.length !== 1 ? "s" : ""}/service{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--green)", color: "#000" }}
        >
          <PackagePlus className="w-4 h-4" />
          Nouveau produit / service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Références", value: String(nbProduits), color: "var(--green)" },
          { label: "Prix moyen", value: formatMontant(Math.round(prixMoyen)), color: "var(--blue)" },
          { label: "Valeur du stock", value: formatMontant(Math.round(valeurStock)), color: "var(--amber)" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>{s.label}</p>
            <p className="font-bold font-mono text-xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text2)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit ou service..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: "var(--bg3)" }}>
          {(["all", "produit", "service", "immobilier", "autre"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background: filterCat === c ? "var(--bg2)" : "transparent",
                color: filterCat === c ? "var(--text)" : "var(--text2)",
                border: filterCat === c ? "1px solid var(--border2)" : "1px solid transparent",
              }}
            >
              {c === "all" ? "Tous" : categorieConfig[c].label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--text2)" }}>
          <Package className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text3)" }} />
          <p className="text-lg font-medium mb-1">Catalogue vide</p>
          <p className="text-sm">Ajoutez vos produits ou services pour créer des ventes rapidement</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: categorieConfig[p.categorie].bg }}>
                    <Tag className="w-4 h-4" style={{ color: categorieConfig[p.categorie].color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">{p.nom}</p>
                    <span
                      className="text-xs font-mono font-medium px-1.5 py-0.5 rounded-full inline-block mt-1"
                      style={{ background: categorieConfig[p.categorie].bg, color: categorieConfig[p.categorie].color }}
                    >
                      {categorieConfig[p.categorie].label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--text2)" }} title="Modifier">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--red)" }} title="Supprimer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {p.description && (
                <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--text2)" }}>{p.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-xs" style={{ color: "var(--text2)" }}>Prix unitaire</p>
                  <p className="text-sm font-bold font-mono" style={{ color: "var(--green)" }}>
                    {formatMontant(p.prixUnitaire)} <span className="text-xs font-normal" style={{ color: "var(--text2)" }}>/ {p.unite}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--text2)" }}>Stock</p>
                  <p className="text-xs font-mono">{p.stock != null ? p.stock : "—"}</p>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text3)" }}>Ajouté le {formatDate(p.dateCreation)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-slide-up" style={{ background: "var(--bg2)", border: "1px solid var(--border2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editingId ? "Modifier le produit" : "Nouveau produit / service"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--text2)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["produit", "service", "immobilier", "autre"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, categorie: c }))}
                      className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: form.categorie === c ? categorieConfig[c].bg : "var(--bg3)",
                        border: `1px solid ${form.categorie === c ? categorieConfig[c].color : "var(--border2)"}`,
                        color: form.categorie === c ? categorieConfig[c].color : "var(--text2)",
                      }}
                    >
                      {categorieConfig[c].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="nom">Nom *</label>
                <input
                  id="nom"
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                  placeholder="Ex: Sac de riz 25kg"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Détails optionnels..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="prixUnitaire">Prix unitaire (FCFA) *</label>
                  <input
                    id="prixUnitaire"
                    type="number"
                    min="0"
                    value={form.prixUnitaire}
                    onChange={(e) => setForm((p) => ({ ...p, prixUnitaire: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="unite">Unité *</label>
                  <input
                    id="unite"
                    type="text"
                    list="unites-suggestions"
                    value={form.unite}
                    onChange={(e) => setForm((p) => ({ ...p, unite: e.target.value }))}
                    placeholder="pièce, kg, heure..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  />
                  <datalist id="unites-suggestions">
                    <option value="pièce" />
                    <option value="kg" />
                    <option value="heure" />
                    <option value="m²" />
                    <option value="forfait" />
                    <option value="litre" />
                    <option value="mois" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="stock">Stock (optionnel)</label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                  placeholder="Laisser vide si non applicable"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                />
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
                  {editingId ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
