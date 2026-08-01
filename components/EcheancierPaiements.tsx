"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { CalendarClock, CheckCircle2 } from "lucide-react";

export interface Echeance {
  id: string;
  libelle: string;
  montant: number;
  dateLimite: string; // ISO YYYY-MM-DD
  statut: "En attente" | "En retard" | "Payé";
}

const ECHEANCES_INITIALES: Echeance[] = [
  {
    id: "1",
    libelle: "Loyer bureau",
    montant: 150000,
    dateLimite: "2026-07-28",
    statut: "En retard",
  },
  {
    id: "2",
    libelle: "Abonnement Orange Money",
    montant: 25000,
    dateLimite: "2026-08-06",
    statut: "En attente",
  },
  {
    id: "3",
    libelle: "Facture Fournisseur Keita",
    montant: 320000,
    dateLimite: "2026-08-10",
    statut: "En attente",
  },
  {
    id: "4",
    libelle: "Remboursement prêt bancaire",
    montant: 200000,
    dateLimite: "2026-08-15",
    statut: "En attente",
  },
  {
    id: "5",
    libelle: "Prestation consultant web",
    montant: 80000,
    dateLimite: "2026-07-20",
    statut: "Payé",
  },
];

function getBadgeStyle(echeance: Echeance): { bg: string; text: string; label: string } {
  if (echeance.statut === "Payé") {
    return { bg: "rgba(34,197,94,0.15)", text: "#22c55e", label: "Payé" };
  }
  if (echeance.statut === "En retard") {
    return { bg: "rgba(239,68,68,0.15)", text: "#ef4444", label: "En retard" };
  }
  // En attente — vérifier urgence (<= 7 jours)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limite = new Date(echeance.dateLimite);
  const diffJours = Math.ceil((limite.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffJours <= 7) {
    return { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", label: "Urgent" };
  }
  return { bg: "rgba(59,130,246,0.15)", text: "#3b82f6", label: "En attente" };
}

function formatMontantFCFA(n: number): string {
  return Math.round(n).toLocaleString("fr-FR") + " FCFA";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EcheancierPaiements() {
  const [echeances, setEcheances] = useState<Echeance[]>(ECHEANCES_INITIALES);

  const marquerPaye = (id: string) => {
    setEcheances((prev) =>
      prev.map((e) => (e.id === id ? { ...e, statut: "Payé" as const } : e))
    );
    const libelle = echeances.find((e) => e.id === id)?.libelle ?? "Échéance";
    toast.success(`"${libelle}" marquée comme payée ✓`, {
      style: {
        background: "#0e1f3d",
        color: "#EBF4FF",
        border: "1px solid #22c55e",
      },
    });
  };

  const total = echeances
    .filter((e) => e.statut !== "Payé")
    .reduce((s, e) => s + e.montant, 0);

  return (
    <>
      <Toaster position="bottom-center" />
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" style={{ color: "var(--gold)" }} />
            <h3 className="font-semibold">Échéancier des paiements</h3>
          </div>
          <span className="text-xs font-mono font-semibold" style={{ color: "var(--red)" }}>
            Restant : {formatMontantFCFA(total)}
          </span>
        </div>

        {/* Liste */}
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {echeances.map((e) => {
            const badge = getBadgeStyle(e);
            const estPaye = e.statut === "Payé";
            return (
              <div
                key={e.id}
                className="px-6 py-4 flex items-center gap-4 transition-colors hover:bg-white/[0.02]"
                data-testid={`echeance-${e.id}`}
              >
                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: estPaye ? "var(--text3)" : "var(--text)", textDecoration: estPaye ? "line-through" : "none" }}
                  >
                    {e.libelle}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
                    Échéance : {formatDate(e.dateLimite)}
                  </p>
                </div>

                {/* Montant */}
                <span
                  className="text-sm font-mono font-semibold flex-shrink-0"
                  style={{ color: estPaye ? "var(--text3)" : "var(--text)" }}
                >
                  {formatMontantFCFA(e.montant)}
                </span>

                {/* Badge statut */}
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: badge.bg, color: badge.text }}
                  data-testid={`badge-${e.id}`}
                >
                  {badge.label}
                </span>

                {/* Bouton Marquer payé */}
                {!estPaye && (
                  <button
                    onClick={() => marquerPaye(e.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "#22c55e",
                      border: "1px solid rgba(34,197,94,0.25)",
                    }}
                    data-testid={`btn-payer-${e.id}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Marquer payé
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
