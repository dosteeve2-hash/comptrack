"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Truck,
  Plus,
  X,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Package,
  Wrench,
  Briefcase,
  Tag,
  Globe,
} from "lucide-react";
import type { Fournisseur } from "./page";

type Categorie = "tous" | "intrants" | "equipements" | "services" | "transport" | "autre";

const categorieConfig: Record<
  Fournisseur["categorie"],
  { label: string; bg: string; color: string; icon: React.ElementType }
> = {
  intrants:    { label: "Intrants",    bg: "rgba(34,197,94,0.12)",   color: "#22c55e", icon: Package },
  equipements: { label: "Équipements", bg: "rgba(59,130,246,0.12)",  color: "#3b82f6", icon: Wrench },
  services:    { label: "Services",    bg: "rgba(245,158,11,0.12)",  color: "#f59e0b", icon: Briefcase },
  transport:   { label: "Transport",   bg: "rgba(249,115,22,0.12)",  color: "#f97316", icon: Truck },
  autre:       { label: "Autre",       bg: "rgba(100,116,139,0.12)", color: "#64748b", icon: Tag },
};

interface FormState {
  nom: string;
  contact_nom: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  categorie: Fournisseur["categorie"];
  numero_ifu: string;
  notes: string;
}

const defaultForm: FormState = {
  nom: "",
  contact_nom: "",
  email: "",
  telephone: "",
  ville: "",
  pays: "Burkina Faso",
  categorie: "intrants",
  numero_ifu: "",
  notes: "",
};


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const statVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

export default function FournisseursClient({
  initialFournisseurs,
}: {
  initialFournisseurs: Fournisseur[];
}) {
  const [liste, setListe] = useState<Fournisseur[]>(initialFournisseurs);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Categorie>("tous");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [formError, setFormError] = useState("");

  /* ---- Stats ---- */
  const totalFournisseurs = liste.length;
  const categoriesActives = new Set(liste.map((f) => f.categorie)).size;
  const paysCouverts = new Set(liste.map((f) => f.pays ?? "")).size;

  const stats = [
    { label: "Total fournisseurs", value: totalFournisseurs, color: "#F59E0B" },
    { label: "Catégories actives",  value: categoriesActives,  color: "#06B6D4" },
    { label: "Pays couverts",       value: paysCouverts,       color: "#a78bfa" },
  ];

  /* ---- Filtrage ---- */
  const filtered = useMemo(() => {
    return liste.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        f.nom.toLowerCase().includes(q) ||
        (f.ville ?? "").toLowerCase().includes(q);
      const matchCat = filterCat === "tous" || f.categorie === filterCat;
      return matchSearch && matchCat;
    });
  }, [liste, search, filterCat]);

  /* ---- Handlers ---- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.nom.trim()) {
      setFormError("Le nom du fournisseur est obligatoire.");
      return;
    }
    const nouveau: Fournisseur = {
      id: `f${Date.now()}`,
      nom: form.nom.trim(),
      contact_nom: form.contact_nom || null,
      email: form.email || null,
      telephone: form.telephone || null,
      ville: form.ville || null,
      pays: form.pays || "Burkina Faso",
      categorie: form.categorie,
      numero_ifu: form.numero_ifu || null,
      notes: form.notes || null,
    };
    setListe((p) => [nouveau, ...p]);
    setForm(defaultForm);
    setFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setListe((p) => p.filter((f) => f.id !== id));
  };


  const pillCats: { key: Categorie; label: string }[] = [
    { key: "tous",        label: "Tous" },
    { key: "intrants",    label: "Intrants" },
    { key: "equipements", label: "Équipements" },
    { key: "services",    label: "Services" },
    { key: "transport",   label: "Transport" },
    { key: "autre",       label: "Autre" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {filtered.length} fournisseur{filtered.length !== 1 ? "s" : ""} affiché
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setForm(defaultForm); setFormError(""); setFormOpen((p) => !p); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#F59E0B", color: "#0F172A" }}
        >
          {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formOpen ? "Fermer" : "Nouveau fournisseur"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            className="p-4 rounded-xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>{s.label}</p>
            <p className="font-bold font-mono text-2xl" style={{ color: s.color }}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Formulaire nouveau fournisseur */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-6 rounded-2xl border"
              style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}
            >
              <h2 className="text-base font-bold mb-4">Nouveau fournisseur</h2>
              <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "nom",         label: "Nom *",           placeholder: "Ex: Agri-Intrants SARL", req: true },
                  { name: "contact_nom", label: "Contact",         placeholder: "Prénom Nom", req: false },
                  { name: "email",       label: "Email",           placeholder: "contact@exemple.com", req: false },
                  { name: "telephone",   label: "Téléphone",       placeholder: "+226 70 12 34 56", req: false },
                  { name: "ville",       label: "Ville",           placeholder: "Ouagadougou", req: false },
                  { name: "pays",        label: "Pays",            placeholder: "Burkina Faso", req: false },
                  { name: "numero_ifu",  label: "N° IFU",          placeholder: "BF-2024-XXXX", req: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text2)" }}>
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      type={field.name === "email" ? "email" : "text"}
                      value={form[field.name as keyof FormState]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.req}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text2)" }}>
                    Catégorie *
                  </label>
                  <select
                    name="categorie"
                    value={form.categorie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                  >
                    <option value="intrants">Intrants</option>
                    <option value="equipements">Équipements</option>
                    <option value="services">Services</option>
                    <option value="transport">Transport</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text2)" }}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Informations supplémentaires..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                  />
                </div>
                {formError && (
                  <p
                    className="sm:col-span-2 text-xs px-3 py-2 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}
                  >
                    {formError}
                  </p>
                )}
                <div className="sm:col-span-2 flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                    style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                    style={{ background: "#F59E0B", color: "#0F172A" }}
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Barre recherche + filtres catégorie */}
      <div
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text2)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou ville..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
            }}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {pillCats.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilterCat(c.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterCat === c.key ? "#F59E0B" : "var(--bg3)",
                color: filterCat === c.key ? "#0F172A" : "var(--text2)",
                border: filterCat === c.key ? "1px solid #F59E0B" : "1px solid var(--border2)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--text2)" }}
        >
          <Truck className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium mb-1">Aucun fournisseur trouvé</p>
          <p className="text-sm">Modifiez la recherche ou ajoutez un nouveau fournisseur.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtered.map((f) => {
              const cfg = categorieConfig[f.categorie];
              const CatIcon = cfg.icon;
              return (
                <motion.div
                  key={f.id}
                  variants={cardVariants}
                  exit="exit"
                  layout
                  className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
                >
                  {/* En-tête card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: cfg.bg }}
                      >
                        <CatIcon className="w-5 h-5" style={{ color: cfg.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm leading-tight truncate">{f.nom}</p>
                        <span
                          className="inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 rounded-lg transition-all hover:opacity-70 flex-shrink-0"
                      style={{ color: "var(--red)" }}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Détails */}
                  <div className="space-y-1.5 mb-3">
                    {f.contact_nom && (
                      <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        {f.contact_nom}
                      </p>
                    )}
                    {f.email && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{f.email}</span>
                      </div>
                    )}
                    {f.telephone && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        {f.telephone}
                      </div>
                    )}
                    {f.ville && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {f.ville}
                        {f.pays && f.pays !== "Burkina Faso" && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {f.pays}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notes + IFU */}
                  {(f.notes || f.numero_ifu) && (
                    <div
                      className="pt-3 border-t space-y-1"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {f.numero_ifu && (
                        <p className="text-xs font-mono" style={{ color: "var(--text2)" }}>
                          IFU: {f.numero_ifu}
                        </p>
                      )}
                      {f.notes && (
                        <p className="text-xs italic" style={{ color: "var(--text2)" }}>
                          {f.notes}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
