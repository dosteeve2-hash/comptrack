"use client";

import { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Package,
  X,
  ChevronDown,
} from "lucide-react";
import { clients as initialClients } from "@/lib/data";
import type { Client } from "@/lib/data";
import { formatMontant, formatDate } from "@/lib/utils";

interface NewClientForm {
  nom: string;
  type: "client" | "fournisseur";
  email: string;
  telephone: string;
  ville: string;
  pays: string;
}

const defaultForm: NewClientForm = {
  nom: "",
  type: "client",
  email: "",
  telephone: "",
  ville: "",
  pays: "Burkina Faso",
};

export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "client" | "fournisseur">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NewClientForm>(defaultForm);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    return clientList.filter((c) => {
      const matchSearch =
        search === "" ||
        c.nom.toLowerCase().includes(search.toLowerCase()) ||
        c.ville.toLowerCase().includes(search.toLowerCase()) ||
        (c.email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || c.type === filterType;
      return matchSearch && matchType;
    });
  }, [clientList, search, filterType]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as NewClientForm));
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.nom || !form.ville) {
      setFormError("Le nom et la ville sont obligatoires.");
      return;
    }
    const newClient: Client = {
      id: `cl${Date.now()}`,
      nom: form.nom,
      type: form.type,
      email: form.email || undefined,
      telephone: form.telephone || undefined,
      ville: form.ville,
      pays: form.pays,
      totalTransactions: 0,
      dernierContact: new Date().toISOString().split("T")[0],
    };
    setClientList((prev) => [newClient, ...prev]);
    setForm(defaultForm);
    setModalOpen(false);
  };

  const nbClients = clientList.filter((c) => c.type === "client").length;
  const nbFournisseurs = clientList.filter((c) => c.type === "fournisseur").length;
  const volTotal = clientList.reduce((s, c) => s + c.totalTransactions, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients &amp; Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            {filtered.length} contact{filtered.length !== 1 ? "s" : ""} affiché
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setForm(defaultForm);
            setFormError("");
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--green)", color: "#000" }}
        >
          <UserPlus className="w-4 h-4" />
          Nouveau contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Clients", value: nbClients, icon: TrendingUp, color: "var(--green)" },
          { label: "Fournisseurs", value: nbFournisseurs, icon: Package, color: "var(--blue)" },
          { label: "Volume total", value: formatMontant(volTotal), icon: TrendingUp, color: "var(--amber)", isText: true },
        ].map((s, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text2)" }}>
              {s.label}
            </p>
            <p className="font-bold font-mono text-xl" style={{ color: s.color }}>
              {s.isText ? s.value : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
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
            placeholder="Rechercher un client ou fournisseur..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
            }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg3)" }}>
          {(["all", "client", "fournisseur"] as const).map((t) => (
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
              {t === "all" ? "Tous" : t === "client" ? "Clients" : "Fournisseurs"}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--text2)" }}
        >
          <p className="text-lg font-medium mb-1">Aucun contact trouvé</p>
          <p className="text-sm">Modifiez la recherche ou ajoutez un nouveau contact.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background:
                        client.type === "client"
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(59,130,246,0.15)",
                      color: client.type === "client" ? "var(--green)" : "var(--blue)",
                    }}
                  >
                    {client.nom
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{client.nom}</p>
                    <span
                      className="text-xs font-mono font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        background:
                          client.type === "client"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(59,130,246,0.1)",
                        color: client.type === "client" ? "var(--green)" : "var(--blue)",
                      }}
                    >
                      {client.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {client.ville}, {client.pays}
                </div>
                {client.telephone && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {client.telephone}
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-xs truncate" style={{ color: "var(--text2)" }}>
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
              </div>

              <div
                className="flex items-center justify-between pt-3 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <p className="text-xs" style={{ color: "var(--text2)" }}>
                    Volume total
                  </p>
                  <p className="text-sm font-bold font-mono" style={{ color: "var(--green)" }}>
                    {formatMontant(client.totalTransactions)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--text2)" }}>
                    Dernier contact
                  </p>
                  <p className="text-xs font-mono">{formatDate(client.dernierContact)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 animate-slide-up"
            style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Nouveau contact</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg transition-all hover:opacity-70"
                style={{ color: "var(--text2)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <div className="flex gap-2">
                  {(["client", "fournisseur"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, type: t }))}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize"
                      style={{
                        background:
                          form.type === t
                            ? t === "client"
                              ? "rgba(34,197,94,0.15)"
                              : "rgba(59,130,246,0.15)"
                            : "var(--bg3)",
                        border:
                          form.type === t
                            ? `1px solid ${t === "client" ? "var(--green)" : "var(--blue)"}`
                            : "1px solid var(--border2)",
                        color:
                          form.type === t
                            ? t === "client"
                              ? "var(--green)"
                              : "var(--blue)"
                            : "var(--text2)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { name: "nom", label: "Nom *", placeholder: "Ex: Boutique Aminata", required: true },
                { name: "email", label: "Email", placeholder: "contact@exemple.com", required: false },
                { name: "telephone", label: "Téléphone", placeholder: "+226 70 12 34 56", required: false },
                { name: "ville", label: "Ville *", placeholder: "Ouagadougou", required: true },
                { name: "pays", label: "Pays *", placeholder: "Burkina Faso", required: true },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.name === "email" ? "email" : "text"}
                    value={form[field.name as keyof NewClientForm]}
                    onChange={handleFormChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }}
                  />
                </div>
              ))}

              {formError && (
                <p
                  className="text-xs px-4 py-2 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)" }}
                >
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
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
