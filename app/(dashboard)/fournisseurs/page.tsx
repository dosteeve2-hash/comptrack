"use client";

import Link from "next/link";
import { Truck, Plus } from "lucide-react";
import { useClients, useTransactions } from "@/lib/store";
import { formatMontant } from "@/lib/utils";

export default function FournisseursPage() {
  const [clients] = useClients();
  const [txList] = useTransactions();

  const fournisseurs = clients
    .filter((c) => c.type === "fournisseur")
    .map((f) => {
      const encours = txList
        .filter((t) => t.type === "depense" && t.statut === "en_attente" && t.client === f.nom)
        .reduce((s, t) => s + t.montant, 0);
      return { ...f, encours, statut: encours > 0 ? "À jour" : "Soldé" };
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Gérez vos fournisseurs et encours</p>
        </div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Ajouter fournisseur
        </Link>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        {fournisseurs.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text2)" }}>
            <p className="text-lg font-medium mb-1">Aucun fournisseur pour le moment</p>
            <p className="text-sm">Ajoutez un contact de type « fournisseur » dans Clients &amp; Fournisseurs.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Fournisseur", "Pays", "Encours (FCFA)", "Statut"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "var(--text2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((f) => (
                <tr key={f.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,188,212,0.1)" }}>
                      <Truck className="w-4 h-4" style={{ color: "var(--cyan)" }} />
                    </div>
                    <span className="font-medium">{f.nom}</span>
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--text2)" }}>{f.pays}</td>
                  <td className="px-6 py-4 font-mono font-semibold">{formatMontant(f.encours)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                      background: f.statut === "Soldé" ? "rgba(100,116,139,0.1)" : "rgba(34,197,94,0.1)",
                      color: f.statut === "Soldé" ? "var(--text2)" : "var(--green)",
                    }}>
                      {f.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
