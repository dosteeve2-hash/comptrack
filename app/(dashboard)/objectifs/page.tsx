import { Target, Plus, CheckCircle2 } from "lucide-react";

export default function ObjectifsPage() {
  const objectifs = [
    { titre: "Chiffre d'affaires juillet",  cible: 2000000, actuel: 1395000, echeance: "2026-07-31", done: false },
    { titre: "Réduire charges de 15%",      cible: 100,     actuel: 6,       echeance: "2026-12-31", done: false, isPercent: true },
    { titre: "Atteindre 20 clients actifs", cible: 20,      actuel: 14,      echeance: "2026-09-30", done: false, isCount: true },
    { titre: "Fonds de roulement 3 mois",   cible: 3000000, actuel: 3200000, echeance: "2026-06-30", done: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Objectifs financiers</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Fixez et suivez vos ambitions</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvel objectif
        </button>
      </div>

      <div className="grid gap-4">
        {objectifs.map((obj, i) => {
          const pct = Math.min(Math.round((obj.actuel / obj.cible) * 100), 100);
          const fmt = (v: number) => obj.isPercent ? `${v}%` : obj.isCount ? `${v}` : `${v.toLocaleString("fr-FR")} FCFA`;
          return (
            <div key={i} className="p-5 rounded-2xl border" style={{ background: "var(--bg2)", borderColor: obj.done ? "rgba(34,197,94,0.3)" : "var(--border)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {obj.done
                    ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--green)" }} />
                    : <Target className="w-5 h-5 flex-shrink-0" style={{ color: "var(--gold)" }} />
                  }
                  <span className="font-medium">{obj.titre}</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{
                  background: obj.done ? "rgba(34,197,94,0.1)" : "rgba(212,175,55,0.1)",
                  color: obj.done ? "var(--green)" : "var(--gold)",
                }}>
                  {obj.done ? "✓ Atteint" : `Avant ${obj.echeance}`}
                </span>
              </div>
              <div className="h-2.5 rounded-full mb-2" style={{ background: "var(--bg3)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: obj.done ? "var(--green)" : "linear-gradient(90deg, var(--gold), var(--cyan))" }}
                />
              </div>
              <div className="flex justify-between text-xs" style={{ color: "var(--text2)" }}>
                <span>{fmt(obj.actuel)} / {fmt(obj.cible)}</span>
                <span className="font-semibold" style={{ color: pct >= 100 ? "var(--green)" : "var(--gold)" }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
