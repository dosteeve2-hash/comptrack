import { ShoppingCart } from "lucide-react";

export default function BudgetsPage() {
  const budgets = [
    { cat: "Charges fixes",     budget: 300000, depense: 193000 },
    { cat: "Stock & marchandises", budget: 500000, depense: 320000 },
    { cat: "Marketing",         budget: 100000, depense: 45000 },
    { cat: "RH / Salaires",    budget: 500000, depense: 480000 },
    { cat: "Équipements",      budget: 200000, depense: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Suivi budgétaire — Juin 2026</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <ShoppingCart className="w-4 h-4" />
          Définir un budget
        </button>
      </div>

      <div className="space-y-4">
        {budgets.map((b, i) => {
          const pct = Math.min(Math.round((b.depense / b.budget) * 100), 100);
          const overBudget = pct >= 90;
          return (
            <div key={i} className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-sm">{b.cat}</span>
                <span className="text-xs font-mono" style={{ color: overBudget ? "var(--red)" : "var(--text2)" }}>
                  {b.depense.toLocaleString("fr-FR")} / {b.budget.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div className="h-2.5 rounded-full" style={{ background: "var(--bg3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: overBudget ? "var(--red)" : pct > 70 ? "var(--amber)" : "var(--cyan)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs" style={{ color: "var(--text3)" }}>{pct}% utilisé</span>
                <span className="text-xs" style={{ color: "var(--text3)" }}>
                  Reste : {(b.budget - b.depense).toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
