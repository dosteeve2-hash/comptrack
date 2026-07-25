"use client";

import { useState } from "react";
import { Target, Plus, CheckCircle2, X } from "lucide-react";
import { STORAGE_KEYS, usePersistedList } from "@/lib/store";
import { formatMontant } from "@/lib/utils";

type Unite = "fcfa" | "pourcent" | "nombre";

interface Objectif {
  id: string;
  titre: string;
  cible: number;
  actuel: number;
  echeance: string;
  unite: Unite;
}

const formatValeur = (v: number, unite: Unite) =>
  unite === "pourcent" ? `${v}%` : unite === "nombre" ? `${v}` : formatMontant(v);

export default function ObjectifsPage() {
  const [objectifs, setObjectifs] = usePersistedList<Objectif>(STORAGE_KEYS.objectifs);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ titre: "", cible: "", echeance: "", unite: "fcfa" as Unite });
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddObjectif = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const cible = parseFloat(form.cible.replace(/\s/g, ""));
    if (!form.titre || !form.echeance || isNaN(cible) || cible <= 0) {
      setFormError("Titre, échéance et cible (nombre positif) sont obligatoires.");
      return;
    }
    setObjectifs((prev) => [
      ...prev,
      { id: `obj${Date.now()}`, titre: form.titre, cible, actuel: 0, echeance: form.echeance, unite: form.unite },
    ]);
    setForm({ titre: "", cible: "", echeance: "", unite: "fcfa" });
    setModalOpen(false);
  };

  const startEdit = (obj: Objectif) => {
    setEditing(obj.id);
    setEditValue(String(obj.actuel));
  };

  const saveEdit = (id: string) => {
    const val = parseFloat(editValue.replace(/\s/g, ""));
    if (!isNaN(val) && val >= 0) {
      setObjectifs((prev) => prev.map((o) => (o.id === id ? { ...o, actuel: val } : o)));
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Objectifs financiers</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Fixez et suivez vos ambitions</p>
        </div>
        <button
          onClick={() => { setForm({ titre: "", cible: "", echeance: "", unite: "fcfa" }); setFormError(""); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvel objectif
        </button>
      </div>

      {objectifs.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--text2)" }}>
          <p className="text-lg font-medium mb-1">Aucun objectif pour le moment</p>
          <p className="text-sm">Créez votre premier objectif financier.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {objectifs.map((obj) => {
            const pct = Math.min(Math.round((obj.actuel / obj.cible) * 100), 100);
            const done = pct >= 100;
            return (
              <div key={obj.id} className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: done ? "rgba(34,197,94,0.3)" : "var(--border)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {done
                      ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--green)" }} />
                      : <Target className="w-5 h-5 flex-shrink-0" style={{ color: "var(--gold)" }} />
                    }
                    <span className="font-medium">{obj.titre}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{
                    background: done ? "rgba(34,197,94,0.1)" : "rgba(212,175,55,0.1)",
                    color: done ? "var(--green)" : "var(--gold)",
                  }}>
                    {done ? "✓ Atteint" : `Avant ${obj.echeance}`}
                  </span>
                </div>
                <div className="h-2.5 rounded-full mb-2" style={{ background: "var(--bg3)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: done ? "var(--green)" : "linear-gradient(90deg, var(--gold), var(--cyan))" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: "var(--text2)" }}>
                  {editing === obj.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(obj.id)}
                        autoFocus
                        className="w-28 px-2 py-1 rounded-lg text-xs outline-none"
                        style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                      />
                      <button onClick={() => saveEdit(obj.id)} className="text-xs font-medium" style={{ color: "var(--green)" }}>OK</button>
                      <button onClick={() => setEditing(null)} className="text-xs" style={{ color: "var(--text2)" }}>Annuler</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(obj)} className="hover:opacity-70 transition-opacity">
                      {formatValeur(obj.actuel, obj.unite)} / {formatValeur(obj.cible, obj.unite)} · Mettre à jour
                    </button>
                  )}
                  <span className="font-semibold" style={{ color: pct >= 100 ? "var(--green)" : "var(--gold)" }}>{pct}%</span>
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
              <h2 className="text-lg font-bold">Nouvel objectif</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--text2)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddObjectif} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))}
                  placeholder="Ex: Chiffre d'affaires du mois"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Cible *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.cible}
                    onChange={(e) => setForm((p) => ({ ...p, cible: e.target.value }))}
                    placeholder="Ex: 2000000"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unité</label>
                  <select
                    value={form.unite}
                    onChange={(e) => setForm((p) => ({ ...p, unite: e.target.value as Unite }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  >
                    <option value="fcfa">FCFA</option>
                    <option value="pourcent">%</option>
                    <option value="nombre">Nombre</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Échéance *</label>
                <input
                  type="date"
                  value={form.echeance}
                  onChange={(e) => setForm((p) => ({ ...p, echeance: e.target.value }))}
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
