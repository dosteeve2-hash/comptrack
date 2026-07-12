import { TrendingUp, Plus } from "lucide-react";

export default function RevenusPage() {
  const mockRevenus = [
    { id: 1, desc: "Vente Boutique — Lot 1",    cat: "Ventes",     montant: 285000, date: "2026-06-03" },
    { id: 2, desc: "Prestation conseil RH",      cat: "Services",   montant: 120000, date: "2026-06-07" },
    { id: 3, desc: "Vente Boutique — Lot 2",    cat: "Ventes",     montant: 390000, date: "2026-06-12" },
    { id: 4, desc: "Commission export",          cat: "Commission", montant: 75000,  date: "2026-06-18" },
    { id: 5, desc: "Abonnement client mensuel",  cat: "Récurrent",  montant: 525000, date: "2026-06-25" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenus</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Suivi de vos revenus — Juin 2026</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Nouveau revenu
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total revenus (juin)", value: "1 395 000 FCFA" },
          { label: "Meilleure source", value: "Abonnements" },
          { label: "Croissance vs mai", value: "+21%" },
        ].map((kpi, i) => (
          <div key={i} className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--text2)" }}>{kpi.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: i === 2 ? "var(--green)" : "var(--text)" }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Historique des revenus</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {mockRevenus.map((rev) => (
            <div key={rev.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.1)" }}>
                <TrendingUp className="w-4 h-4" style={{ color: "var(--green)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{rev.desc}</p>
                <p className="text-xs" style={{ color: "var(--text2)" }}>{rev.cat} · {rev.date}</p>
              </div>
              <p className="text-sm font-bold font-mono" style={{ color: "var(--green)" }}>
                +{rev.montant.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
