"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Save, Plus, Trash2, Building2, User, Bell, Shield } from "lucide-react";
import { categories as initialCategories } from "@/lib/data";
import type { Categorie } from "@/lib/data";

type TabId = "entreprise" | "compte" | "categories" | "notifications";

const tabs: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "entreprise", label: "Entreprise", icon: Building2 },
  { id: "compte", label: "Mon compte", icon: User },
  { id: "categories", label: "Catégories", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<TabId>("entreprise");
  const [saved, setSaved] = useState(false);
  const [catList, setCatList] = useState<Categorie[]>(initialCategories);
  const [newCatNom, setNewCatNom] = useState("");
  const [newCatType, setNewCatType] = useState<"revenu" | "depense">("depense");

  const [entreprise, setEntreprise] = useState({
    nom: "Mon Commerce",
    secteur: "Commerce général",
    adresse: "Quartier Zogona, Ouagadougou",
    telephone: "+226 70 00 00 00",
    email: "contact@moncommerce.bf",
    devise: "FCFA",
    pays: "Burkina Faso",
  });

  const [compte, setCompte] = useState({
    nom: "Steve Donald Compaoré",
    email: "docompaore2@gmail.com",
    langue: "Français",
    fuseau: "Africa/Ouagadougou (UTC+0)",
  });

  const [notifs, setNotifs] = useState({
    facturesRetard: true,
    rapportMensuel: true,
    objectifAtteint: false,
    nouvelleDep: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddCat = () => {
    if (!newCatNom.trim()) return;
    const newCat: Categorie = {
      id: `c${Date.now()}`,
      nom: newCatNom.trim(),
      type: newCatType,
      couleur: newCatType === "revenu" ? "#22c55e" : "#ef4444",
    };
    setCatList((prev) => [...prev, newCat]);
    setNewCatNom("");
  };

  const handleDeleteCat = (id: string) => {
    setCatList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            Configurez votre espace CompTrack
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{
            background: saved ? "rgba(34,197,94,0.2)" : "var(--green)",
            color: saved ? "var(--green)" : "#000",
            border: saved ? "1px solid var(--green)" : "none",
          }}
        >
          <Save className="w-4 h-4" />
          {saved ? "Sauvegardé ✓" : "Sauvegarder"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs sidebar */}
        <div
          className="md:w-52 flex-shrink-0 rounded-2xl border p-2 h-fit"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1"
              style={{
                background: activeTab === tab.id ? "rgba(34,197,94,0.1)" : "transparent",
                color: activeTab === tab.id ? "var(--green)" : "var(--text2)",
                border: activeTab === tab.id ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Entreprise tab */}
          {activeTab === "entreprise" && (
            <div
              className="rounded-2xl border p-6 space-y-5"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              <h2 className="font-bold text-lg">Informations entreprise</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: "nom", label: "Nom de l'entreprise", placeholder: "Mon Commerce SARL" },
                  { key: "secteur", label: "Secteur d'activité", placeholder: "Commerce, Services, BTP..." },
                  { key: "telephone", label: "Téléphone", placeholder: "+226 70 00 00 00" },
                  { key: "email", label: "Email professionnel", placeholder: "contact@entreprise.bf" },
                  { key: "adresse", label: "Adresse", placeholder: "Quartier, Ville" },
                  { key: "pays", label: "Pays", placeholder: "Burkina Faso" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <input
                      type="text"
                      value={entreprise[field.key as keyof typeof entreprise]}
                      onChange={(e) =>
                        setEntreprise((p) => ({ ...p, [field.key]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Devise principale</label>
                <select
                  value={entreprise.devise}
                  onChange={(e) => setEntreprise((p) => ({ ...p, devise: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border2)",
                    color: "var(--text)",
                  }}
                >
                  {["FCFA", "XOF", "GHS", "NGN", "KES", "USD", "EUR"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Compte tab */}
          {activeTab === "compte" && (
            <div
              className="rounded-2xl border p-6 space-y-5"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              <h2 className="font-bold text-lg">Mon compte</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl"
                  style={{ background: "var(--blue)", color: "#fff" }}
                >
                  SD
                </div>
                <div>
                  <p className="font-semibold">{compte.nom}</p>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>{compte.email}</p>
                  <button className="text-xs mt-1 transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
                    Changer la photo
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: "nom", label: "Nom complet", type: "text" },
                  { key: "email", label: "Email", type: "email" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      value={compte[field.key as keyof typeof compte]}
                      onChange={(e) =>
                        setCompte((p) => ({ ...p, [field.key]: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
              >
                <h3 className="font-semibold text-sm mb-3">Changer le mot de passe</h3>
                <div className="space-y-3">
                  {["Mot de passe actuel", "Nouveau mot de passe", "Confirmer"].map((label) => (
                    <input
                      key={label}
                      type="password"
                      placeholder={label}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--bg2)",
                        border: "1px solid var(--border2)",
                        color: "var(--text)",
                      }}
                    />
                  ))}
                  <button
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                    style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
                  >
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Catégories tab */}
          {activeTab === "categories" && (
            <div
              className="rounded-2xl border p-6 space-y-5"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              <h2 className="font-bold text-lg">Gérer les catégories</h2>

              {/* Add new */}
              <div
                className="flex gap-3 p-4 rounded-xl"
                style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
              >
                <input
                  type="text"
                  value={newCatNom}
                  onChange={(e) => setNewCatNom(e.target.value)}
                  placeholder="Nom de la nouvelle catégorie"
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border2)",
                    color: "var(--text)",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCat()}
                />
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg2)" }}>
                  {(["revenu", "depense"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewCatType(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                      style={{
                        background: newCatType === t ? "var(--bg3)" : "transparent",
                        color: newCatType === t
                          ? t === "revenu" ? "var(--green)" : "var(--red)"
                          : "var(--text2)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddCat}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: "var(--green)", color: "#000" }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* List */}
              <div className="space-y-2">
                {catList.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: cat.couleur }}
                      />
                      <span className="text-sm font-medium">{cat.nom}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-full capitalize"
                        style={{
                          background: cat.type === "revenu" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: cat.type === "revenu" ? "var(--green)" : "var(--red)",
                        }}
                      >
                        {cat.type}
                      </span>
                      <button
                        onClick={() => handleDeleteCat(cat.id)}
                        className="p-1.5 rounded-lg transition-all hover:opacity-70"
                        style={{ color: "var(--text3)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <div
              className="rounded-2xl border p-6 space-y-5"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              <h2 className="font-bold text-lg">Préférences notifications</h2>
              <div className="space-y-3">
                {(
                  [
                    {
                      key: "facturesRetard",
                      label: "Factures en retard",
                      desc: "Alertes quand une facture dépasse son échéance",
                    },
                    {
                      key: "rapportMensuel",
                      label: "Rapport mensuel",
                      desc: "Résumé automatique en début de mois",
                    },
                    {
                      key: "objectifAtteint",
                      label: "Objectif atteint",
                      desc: "Notification quand l'objectif mensuel est atteint",
                    },
                    {
                      key: "nouvelleDep",
                      label: "Nouvelles dépenses importantes",
                      desc: "Alertes pour les dépenses > 500 000 FCFA",
                    },
                  ] as Array<{ key: keyof typeof notifs; label: string; desc: string }>
                ).map((n) => (
                  <div
                    key={n.key}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
                  >
                    <div>
                      <p className="font-medium text-sm">{n.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>
                        {n.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifs((p) => ({ ...p, [n.key]: !p[n.key] }))}
                      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                      style={{
                        background: notifs[n.key] ? "var(--green)" : "var(--border2)",
                      }}
                    >
                      <span
                        className="absolute top-1 w-4 h-4 rounded-full transition-all"
                        style={{
                          background: "#fff",
                          left: notifs[n.key] ? "calc(100% - 20px)" : "4px",
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
