"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Search,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Users,
  Globe,
  Briefcase,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ClientRecord } from "./page";

const SECTEURS = [
  "Commerce",
  "Agriculture",
  "Service",
  "Transport",
  "Artisanat",
  "Autre",
] as const;

type Secteur = (typeof SECTEURS)[number];

const SECTEUR_COLORS: Record<string, string> = {
  Commerce: "rgba(34,197,94,0.15)",
  Agriculture: "rgba(134,239,172,0.2)",
  Service: "rgba(59,130,246,0.15)",
  Transport: "rgba(245,158,11,0.15)",
  Artisanat: "rgba(168,85,247,0.15)",
  Autre: "rgba(107,114,128,0.15)",
};

const SECTEUR_TEXT: Record<string, string> = {
  Commerce: "var(--green)",
  Agriculture: "#16a34a",
  Service: "var(--blue)",
  Transport: "var(--amber)",
  Artisanat: "#a855f7",
  Autre: "var(--text2)",
};

interface NewClientForm {
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  secteur: Secteur | "";
  notes: string;
}

const defaultForm: NewClientForm = {
  nom: "",
  email: "",
  telephone: "",
  ville: "",
  secteur: "",
  notes: "",
};

interface Props {
  clients: ClientRecord[];
  userId: string;
}

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
  );
}

export default function ClientsClient({ clients: initialClients, userId }: Props) {
  const [clientList, setClientList] = useState<ClientRecord[]>(initialClients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewClientForm>(defaultForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Statistiques
  const totalClients = clientList.length;
  const villesUniques = new Set(clientList.map((c) => c.ville).filter(Boolean)).size;
  const secteursUniques = new Set(clientList.map((c) => c.secteur).filter(Boolean)).size;

  // Filtrage temps réel
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clientList;
    return clientList.filter(
      (c) =>
        c.nom.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.ville ?? "").toLowerCase().includes(q)
    );
  }, [clientList, search]);

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.nom.trim()) {
      setFormError("Le nom est obligatoire.");
      return;
    }
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const newRecord = {
        user_id: userId,
        nom: form.nom.trim(),
        email: form.email.trim() || null,
        telephone: form.telephone.trim() || null,
        ville: form.ville.trim() || null,
        secteur: form.secteur || null,
        notes: form.notes.trim() || null,
      };
      const { data, error } = await supabase
        .from("clients")
        .insert(newRecord)
        .select()
        .single();
      if (error) throw error;
      setClientList((prev) =>
        [data as ClientRecord, ...prev].sort((a, b) => a.nom.localeCompare(b.nom))
      );
      setForm(defaultForm);
      setShowForm(false);
    } catch {
      // Fallback local si Supabase indisponible
      const localRecord: ClientRecord = {
        id: `local-${Date.now()}`,
        user_id: userId,
        nom: form.nom.trim(),
        email: form.email.trim() || null,
        telephone: form.telephone.trim() || null,
        ville: form.ville.trim() || null,
        secteur: form.secteur || null,
        notes: form.notes.trim() || null,
        created_at: new Date().toISOString(),
      };
      setClientList((prev) =>
        [localRecord, ...prev].sort((a, b) => a.nom.localeCompare(b.nom))
      );
      setForm(defaultForm);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer ce client ?")) return;
    try {
      const supabase = getSupabase();
      await supabase.from("clients").delete().eq("id", id);
    } catch {
      // ignore
    }
    setClientList((prev) => prev.filter((c) => c.id !== id));
  }

  function getInitials(nom: string) {
    return nom
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {filtered.length} client{filtered.length !== 1 ? "s" : ""} affiché
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setForm(defaultForm);
            setFormError("");
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--green)", color: "#000" }}
        >
          <UserPlus className="w-4 h-4" />
          {showForm ? "Annuler" : "+ Nouveau client"}
          {showForm ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total clients", value: totalClients, icon: Users, color: "var(--green)" },
          { label: "Villes", value: villesUniques, icon: Globe, color: "var(--blue)" },
          { label: "Secteurs", value: secteursUniques, icon: Briefcase, color: "var(--amber)" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs" style={{ color: "var(--text2)" }}>
                {stat.label}
              </p>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}18` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Formulaire inline */}
      {showForm && (
        <div
          className="rounded-2xl border p-5"
          style={{ background: "var(--bg2)", borderColor: "var(--border2)" }}
        >
          <h2 className="font-semibold mb-4">Nouveau client</h2>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" htmlFor="nom">
                  Nom <span style={{ color: "var(--red)" }}>*</span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleFormChange}
                  placeholder="Ex: Aminata Konaté"
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border2)",
                    color: "var(--text)",
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="contact@exemple.com"
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border2)",
                    color: "var(--text)",
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" htmlFor="telephone">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="text"
                  value={form.telephone}
                  onChange={handleFormChange}
                  placeholder="+226 70 12 34 56"
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border2)",
                    color: "var(--text)",
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" htmlFor="ville">
                  Ville
                </label>
                <input
                  id="ville"
                  name="ville"
                  type="text"
                  value={form.ville}
                  onChange={handleFormChange}
                  placeholder="Ouagadougou"
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border2)",
                    color: "var(--text)",
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" htmlFor="secteur">
                Secteur
              </label>
              <select
                id="secteur"
                name="secteur"
                value={form.secteur}
                onChange={handleFormChange}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  color: form.secteur ? "var(--text)" : "var(--text2)",
                }}
              >
                <option value="">— Choisir un secteur —</option>
                {SECTEURS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                placeholder="Informations complémentaires..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>
            {formError && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}
              >
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                style={{ background: "var(--green)", color: "#000" }}
              >
                {submitting ? "Ajout…" : "Ajouter le client"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barre de recherche */}
      <div
        className="flex items-center gap-3 p-4 rounded-2xl border"
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
            placeholder="Rechercher par nom, email ou ville…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      {/* Liste des clients */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{
            background: "var(--bg2)",
            borderColor: "var(--border)",
            color: "var(--text2)",
          }}
        >
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium mb-1">Aucun client trouvé</p>
          <p className="text-sm">
            {search
              ? "Modifiez la recherche ou ajoutez un nouveau client."
              : "Commencez par ajouter votre premier client."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5 group"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              {/* En-tête card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background: client.secteur
                        ? SECTEUR_COLORS[client.secteur] ?? "rgba(107,114,128,0.15)"
                        : "rgba(107,114,128,0.15)",
                      color: client.secteur
                        ? SECTEUR_TEXT[client.secteur] ?? "var(--text2)"
                        : "var(--text2)",
                    }}
                  >
                    {getInitials(client.nom)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{client.nom}</p>
                    {client.secteur && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: SECTEUR_COLORS[client.secteur] ?? "rgba(107,114,128,0.15)",
                          color: SECTEUR_TEXT[client.secteur] ?? "var(--text2)",
                        }}
                      >
                        {client.secteur}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:opacity-70"
                  style={{ color: "var(--red)" }}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Infos */}
              <div className="space-y-1.5">
                {client.ville && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {client.ville}
                  </div>
                )}
                {client.telephone && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {client.telephone}
                  </div>
                )}
                {client.email && (
                  <div
                    className="flex items-center gap-2 text-xs truncate"
                    style={{ color: "var(--text2)" }}
                  >
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {client.notes && (
                <p
                  className="mt-3 pt-3 border-t text-xs line-clamp-2"
                  style={{ borderColor: "var(--border)", color: "var(--text3)" }}
                >
                  {client.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
