"use client";

import Link from "next/link";
import { TrendingDown, Plus } from "lucide-react";
import { useTransactions } from "@/lib/store";
import { formatMontant, formatDate } from "@/lib/utils";

export default function DepensesPage() {
  const [txList] = useTransactions();

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const sameMonth = (dateStr: string, year: number, month: number) => {
    const d = new Date(dateStr);
    return d.getFullYear() === year && d.getMonth() === month;
  };

  const depenses = txList
    .filter((t) => t.type === "depense")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const depensesMois = depenses.filter((t) => sameMonth(t.date, y, m));
  const totalMois = depensesMois.reduce((s, t) => s + t.montant, 0);

  const parCategorie = new Map<string, number>();
  for (const t of depensesMois) {
    parCategorie.set(t.categorie, (parCategorie.get(t.categorie) ?? 0) + t.montant);
  }
  const plusGrosseCategorie = Array.from(parCategorie.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const moisLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(now);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Suivi de vos dépenses — {moisLabel}</p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle dépense
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: `Total dépenses (${moisLabel})`, value: formatMontant(totalMois) },
          { label: "Plus grosse catégorie", value: plusGrosseCategorie },
          { label: "Nb transactions", value: String(depensesMois.length) },
        ].map((kpi, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>{kpi.label}</p>
            <p className="text-xl font-bold font-mono">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Historique des dépenses</h3>
        </div>
        {depenses.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--text2)" }}>
            <p className="text-lg font-medium mb-1">Aucune dépense pour le moment</p>
            <p className="text-sm">Ajoutez votre première dépense pour commencer.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {depenses.map((dep) => (
              <div key={dep.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <TrendingDown className="w-4 h-4" style={{ color: "var(--red)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{dep.description}</p>
                  <p className="text-xs" style={{ color: "var(--text2)" }}>{dep.categorie} · {formatDate(dep.date)}</p>
                </div>
                <p className="text-sm font-bold font-mono" style={{ color: "var(--red)" }}>
                  -{formatMontant(dep.montant)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
