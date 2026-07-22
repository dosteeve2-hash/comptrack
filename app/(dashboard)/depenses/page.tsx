import { TrendingDown, Plus } from "lucide-react";

export default function DepensesPage() {
  const mockDepenses = [
    { id: 1, desc: "Loyer local commercial", cat: "Immobilier", montant: 150000, date: "2026-06-01" },
    { id: 2, desc: "Achat marchandises",      cat: "Stock",       montant: 320000, date: "2026-06-05" },
    { id: 3, desc: "Salaires employés",       cat: "RH",         montant: 480000, date: "2026-06-10" },
    { id: 4, desc: "Facture électricité",     cat: "Charges",    montant: 18000,  date: "2026-06-15" },
    { id: 5, desc: "Abonnement internet",     cat: "Charges",    montant: 25000,  date: "2026-06-20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Suivi de vos dépenses — Juin 2026</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle dépense
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total dépenses (juin)", value: "993 000 FCFA" },
          { label: "Plus grosse dépense", value: "Salaires" },
          { label: "Nb transactions", value: "24" },
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
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {mockDepenses.map((dep) => (
            <div key={dep.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
                <TrendingDown className="w-4 h-4" style={{ color: "var(--red)" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{dep.desc}</p>
                <p className="text-xs" style={{ color: "var(--text2)" }}>{dep.cat} · {dep.date}</p>
              </div>
              <p className="text-sm font-bold font-mono" style={{ color: "var(--red)" }}>
                -{dep.montant.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
