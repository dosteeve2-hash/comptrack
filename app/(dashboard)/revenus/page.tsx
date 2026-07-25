"use client";

import Link from "next/link";
import { TrendingUp, Plus } from "lucide-react";
import { useTransactions } from "@/lib/store";
import { formatMontant, formatDate, calcVariation } from "@/lib/utils";

export default function RevenusPage() {
  const [txList] = useTransactions();

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const prev = new Date(y, m - 1, 1);

  const sameMonth = (dateStr: string, year: number, month: number) => {
    const d = new Date(dateStr);
    return d.getFullYear() === year && d.getMonth() === month;
  };

  const revenus = txList
    .filter((t) => t.type === "revenu")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const revenusMois = revenus.filter((t) => sameMonth(t.date, y, m));
  const revenusMoisPrecedent = revenus.filter((t) => sameMonth(t.date, prev.getFullYear(), prev.getMonth()));

  const totalMois = revenusMois.reduce((s, t) => s + t.montant, 0);
  const totalMoisPrecedent = revenusMoisPrecedent.reduce((s, t) => s + t.montant, 0);
  const croissance = totalMoisPrecedent > 0 ? calcVariation(totalMois, totalMoisPrecedent) : null;

  const parCategorie = new Map<string, number>();
  for (const t of revenusMois) {
    parCategorie.set(t.categorie, (parCategorie.get(t.categorie) ?? 0) + t.montant);
  }
  const meilleureSource = Array.from(parCategorie.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const moisLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(now);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenus</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Suivi de vos revenus — {moisLabel}</p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Nouveau revenu
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: `Total revenus (${moisLabel})`, value: formatMontant(totalMois) },
          { label: "Meilleure source", value: meilleureSource },
          { label: "Croissance vs mois dernier", value: croissance === null ? "—" : `${croissance > 0 ? "+" : ""}${croissance}%` },
        ].map((kpi, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>{kpi.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: i === 2 && croissance !== null && croissance > 0 ? "var(--green)" : "var(--text)" }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Historique des revenus</h3>
        </div>
        {revenus.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text2)" }}>
            <p className="text-lg font-medium mb-1">Aucun revenu pour le moment</p>
            <p className="text-sm">Ajoutez votre premier revenu pour commencer.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {revenus.map((rev) => (
              <div key={rev.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.1)" }}>
                  <TrendingUp className="w-4 h-4" style={{ color: "var(--green)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{rev.description}</p>
                  <p className="text-xs" style={{ color: "var(--text2)" }}>{rev.categorie} · {formatDate(rev.date)}</p>
                </div>
                <p className="text-sm font-bold font-mono" style={{ color: "var(--green)" }}>
                  +{formatMontant(rev.montant)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
