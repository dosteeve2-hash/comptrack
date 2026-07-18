"use client";

import { useState } from "react";
import { Scale, Download, CheckCircle, AlertCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PosteBilan {
  label: string;
  montantN: number;
  montantN1: number;
}

interface SectionBilan {
  titre: string;
  couleur: string;
  postes: PosteBilan[];
}

// ─── Données mock PME burkinabè ~50M FCFA ───────────────────────────────────

const actifN: SectionBilan[] = [
  {
    titre: "Immobilisations corporelles",
    couleur: "var(--cyan)",
    postes: [
      { label: "Terrains & constructions",   montantN: 8_500_000,  montantN1: 8_500_000  },
      { label: "Matériels & équipements",    montantN: 4_200_000,  montantN1: 3_800_000  },
      { label: "Véhicules",                  montantN: 2_100_000,  montantN1: 2_450_000  },
    ],
  },
  {
    titre: "Immobilisations incorporelles",
    couleur: "var(--blue)",
    postes: [
      { label: "Fonds de commerce",          montantN: 3_000_000,  montantN1: 3_000_000  },
      { label: "Licences & brevets",         montantN: 450_000,    montantN1: 600_000    },
    ],
  },
  {
    titre: "Immobilisations financières",
    couleur: "var(--amber)",
    postes: [
      { label: "Titres de participation",    montantN: 1_200_000,  montantN1: 1_200_000  },
      { label: "Dépôts & cautionnements",    montantN: 350_000,    montantN1: 300_000    },
    ],
  },
  {
    titre: "Actif circulant",
    couleur: "var(--green)",
    postes: [
      { label: "Stocks de marchandises",     montantN: 12_300_000, montantN1: 9_800_000  },
      { label: "Créances clients",           montantN: 7_450_000,  montantN1: 6_200_000  },
      { label: "Autres créances",            montantN: 1_100_000,  montantN1: 950_000    },
      { label: "Disponibilités (banque)",    montantN: 6_800_000,  montantN1: 5_400_000  },
      { label: "Caisse",                     montantN: 1_250_000,  montantN1: 980_000    },
    ],
  },
];

const passifN: SectionBilan[] = [
  {
    titre: "Capitaux propres",
    couleur: "var(--gold)",
    postes: [
      { label: "Capital social",             montantN: 15_000_000, montantN1: 15_000_000 },
      { label: "Réserves légales",           montantN: 3_200_000,  montantN1: 2_500_000  },
      { label: "Résultat de l'exercice N",   montantN: 4_350_000,  montantN1: 3_820_000  },
      { label: "Report à nouveau",           montantN: 5_450_000,  montantN1: 3_980_000  },
    ],
  },
  {
    titre: "Dettes financières",
    couleur: "var(--red)",
    postes: [
      { label: "Emprunts bancaires LT",      montantN: 8_200_000,  montantN1: 9_500_000  },
      { label: "Emprunts bancaires CT",      montantN: 2_500_000,  montantN1: 1_800_000  },
      { label: "Découverts bancaires",       montantN: 850_000,    montantN1: 1_200_000  },
    ],
  },
  {
    titre: "Dettes d'exploitation",
    couleur: "var(--amber)",
    postes: [
      { label: "Fournisseurs",               montantN: 5_700_000,  montantN1: 4_900_000  },
      { label: "Dettes fiscales & sociales", montantN: 2_100_000,  montantN1: 1_750_000  },
      { label: "Avances clients",            montantN: 1_050_000,  montantN1: 730_000    },
      { label: "Autres dettes",              montantN: 300_000,    montantN1: 500_000    },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function somme(sections: SectionBilan[], exercice: "N" | "N1"): number {
  return sections
    .flatMap((s) => s.postes)
    .reduce((acc, p) => acc + (exercice === "N" ? p.montantN : p.montantN1), 0);
}

function sommeSec(s: SectionBilan, ex: "N" | "N1"): number {
  return s.postes.reduce((a, p) => a + (ex === "N" ? p.montantN : p.montantN1), 0);
}

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

// ─── Composants ─────────────────────────────────────────────────────────────

interface SectionProps {
  section: SectionBilan;
  exercice: "N" | "N1";
  showBoth: boolean;
}

function SectionCard({ section, exercice, showBoth }: SectionProps) {
  const total = sommeSec(section, exercice);
  const totalN1 = sommeSec(section, "N1");
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--bg3)", borderColor: "var(--border)" }}
    >
      {/* Titre section */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: "var(--border)",
          background: `${section.couleur}14`,
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: section.couleur }}>
          {section.titre}
        </span>
        <div className="text-right">
          <span className="text-sm font-bold font-mono" style={{ color: section.couleur }}>
            {fmt(total)}
          </span>
          {showBoth && (
            <span className="ml-3 text-xs font-mono" style={{ color: "var(--text3)" }}>
              N-1 : {fmt(totalN1)}
            </span>
          )}
        </div>
      </div>
      {/* Lignes */}
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {section.postes.map((p, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span style={{ color: "var(--text2)" }}>{p.label}</span>
            <div className="text-right">
              <span className="font-mono font-medium">{fmt(exercice === "N" ? p.montantN : p.montantN1)}</span>
              {showBoth && (
                <span className="ml-3 text-xs font-mono" style={{ color: "var(--text3)" }}>
                  {fmt(p.montantN1)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function BilanPage() {
  const [exercice, setExercice] = useState<"N" | "N1">("N");
  const showBoth = exercice === "N";

  const totalActif  = somme(actifN,  exercice);
  const totalPassif = somme(passifN, exercice);
  const equilibre   = totalActif === totalPassif;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5" style={{ color: "var(--gold)" }} />
            <h1 className="text-2xl font-bold">Bilan Comptable</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            Situation patrimoniale — exercice {exercice === "N" ? "2025 (N)" : "2024 (N-1)"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch N / N-1 */}
          <div
            className="flex rounded-xl overflow-hidden border"
            style={{ borderColor: "var(--border2)" }}
          >
            {(["N", "N1"] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => setExercice(ex)}
                className="px-4 py-2 text-sm font-semibold transition-all"
                style={{
                  background: exercice === ex ? "var(--gold)" : "var(--bg2)",
                  color:      exercice === ex ? "var(--navy)" : "var(--text2)",
                }}
              >
                {ex === "N" ? "2025 (N)" : "2024 (N-1)"}
              </button>
            ))}
          </div>

          {/* Export PDF */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110 no-print"
            style={{ background: "var(--gold)", color: "var(--navy)" }}
          >
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* ── Badge équilibre ─────────────────────────────────────────────── */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold"
        style={{
          background:  equilibre ? "rgba(34,197,94,0.1)"   : "rgba(239,68,68,0.1)",
          borderColor: equilibre ? "rgba(34,197,94,0.3)"   : "rgba(239,68,68,0.3)",
          color:       equilibre ? "var(--green)"           : "var(--red)",
        }}
      >
        {equilibre
          ? <><CheckCircle className="w-4 h-4" /> Bilancé ✓ — Actif = Passif = {fmt(totalActif)}</>
          : <><AlertCircle className="w-4 h-4" /> Déséquilibre détecté — écart : {fmt(Math.abs(totalActif - totalPassif))}</>
        }
      </div>

      {/* ── Colonnes Actif / Passif ─────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* ACTIF */}
        <div className="space-y-4">
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <h2 className="font-bold text-lg" style={{ color: "var(--cyan)" }}>ACTIF</h2>
            <span className="font-bold font-mono text-lg" style={{ color: "var(--cyan)" }}>
              {fmt(totalActif)}
            </span>
          </div>
          {actifN.map((s, i) => (
            <SectionCard key={i} section={s} exercice={exercice} showBoth={showBoth} />
          ))}
          {/* Total actif */}
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl border font-bold"
            style={{
              background: "rgba(0,188,212,0.1)",
              borderColor: "rgba(0,188,212,0.3)",
              color: "var(--cyan)",
            }}
          >
            <span className="text-sm uppercase tracking-wide">TOTAL ACTIF</span>
            <span className="font-mono text-lg">{fmt(totalActif)}</span>
          </div>
        </div>

        {/* PASSIF */}
        <div className="space-y-4">
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <h2 className="font-bold text-lg" style={{ color: "var(--gold)" }}>PASSIF</h2>
            <span className="font-bold font-mono text-lg" style={{ color: "var(--gold)" }}>
              {fmt(totalPassif)}
            </span>
          </div>
          {passifN.map((s, i) => (
            <SectionCard key={i} section={s} exercice={exercice} showBoth={showBoth} />
          ))}
          {/* Total passif */}
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl border font-bold"
            style={{
              background: "rgba(212,175,55,0.1)",
              borderColor: "rgba(212,175,55,0.3)",
              color: "var(--gold)",
            }}
          >
            <span className="text-sm uppercase tracking-wide">TOTAL PASSIF</span>
            <span className="font-mono text-lg">{fmt(totalPassif)}</span>
          </div>
        </div>
      </div>

      {/* ── Note de bas de page ─────────────────────────────────────────── */}
      <p className="text-xs text-center pb-4" style={{ color: "var(--text3)" }}>
        Bilan établi selon le plan comptable OHADA révisé · Valeurs en FCFA · Exercice clos le 31/12/2025
      </p>
    </div>
  );
}
