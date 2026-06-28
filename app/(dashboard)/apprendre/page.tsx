"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowLeftRight,
  FileText,
  BarChart3,
  Scale,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Concept {
  terme: string;
  definition: string;
  exemple: string;
}

interface MiniCours {
  id: string;
  titre: string;
  module: string;
  etapes: { titre: string; contenu: string }[];
}

// ─── Données ─────────────────────────────────────────────────────────────────

const concepts: Concept[] = [
  {
    terme: "Débit",
    definition: "Entrée dans un compte ou diminution d'un passif. Dans la comptabilité double-entrée, le débit est toujours à gauche du journal.",
    exemple: "Vous achetez du stock pour 50 000 FCFA : vous débitez le compte « Stock » (il augmente) et créditez le compte « Banque » (il diminue).",
  },
  {
    terme: "Crédit",
    definition: "Sortie d'un compte actif ou augmentation d'un passif. Toujours à droite dans le journal comptable.",
    exemple: "Vous vendez un produit : vous créditez le compte « Ventes » (revenu) et débitez le compte « Banque » (trésorerie augmente).",
  },
  {
    terme: "Actif",
    definition: "Tout ce que votre entreprise possède : trésorerie, équipements, stock, créances clients…",
    exemple: "Trésorerie 4 250 000 FCFA + Stock 800 000 FCFA + Matériel 650 000 FCFA = Actif total 5 700 000 FCFA.",
  },
  {
    terme: "Passif",
    definition: "Ce que votre entreprise doit à des tiers (dettes) + les capitaux propres. Toujours égal à l'Actif.",
    exemple: "Dettes fournisseurs 180 000 FCFA + Capitaux propres 5 520 000 FCFA = Passif 5 700 000 FCFA.",
  },
  {
    terme: "Capitaux propres",
    definition: "La valeur nette de votre entreprise = Actif total − Dettes. C'est ce que vous auriez s'il fallait tout rembourser.",
    exemple: "Si votre actif vaut 5 700 000 FCFA et vos dettes 180 000 FCFA, vos capitaux propres = 5 520 000 FCFA.",
  },
  {
    terme: "Résultat net",
    definition: "Bénéfice (ou perte) final après déduction de toutes les charges sur une période donnée.",
    exemple: "Revenus 1 395 000 − Charges 693 000 = Résultat net 702 000 FCFA pour juin.",
  },
  {
    terme: "Charges",
    definition: "Toutes les dépenses engagées pour faire fonctionner votre activité : salaires, loyer, achats, télécoms…",
    exemple: "Loyer 120 000 + Salaires 250 000 + Stock 180 000 = 550 000 FCFA de charges.",
  },
  {
    terme: "Produits",
    definition: "Tous les revenus générés par votre activité : ventes, prestations, commissions…",
    exemple: "Vente tissus 450 000 + Prestation 320 000 + Formation 195 000 = 965 000 FCFA de produits.",
  },
  {
    terme: "Créance",
    definition: "Argent que vos clients vous doivent mais n'ont pas encore payé (factures émises, non réglées).",
    exemple: "Vous avez émis la facture FAC-2026-002 de 320 000 FCFA. Elle n'est pas payée → vous avez une créance de 320 000 FCFA.",
  },
  {
    terme: "Trésorerie",
    definition: "L'argent liquide disponible immédiatement (solde bancaire + caisse). Indicateur vital de santé financière.",
    exemple: "Solde banque 3 500 000 FCFA + Caisse 750 000 FCFA = Trésorerie 4 250 000 FCFA.",
  },
  {
    terme: "Amortissement",
    definition: "Étalement dans le temps du coût d'un bien durable (matériel, véhicule). Réduit le résultat imposable.",
    exemple: "Vous achetez un ordinateur à 600 000 FCFA. Sur 3 ans, vous amortissez 200 000 FCFA/an.",
  },
  {
    terme: "Marge brute",
    definition: "Revenus − Coût des marchandises vendues. Mesure la rentabilité avant les charges fixes.",
    exemple: "Ventes 1 395 000 − Achats 180 000 = Marge brute 1 215 000 FCFA (taux : 87%).",
  },
];

const miniCours: MiniCours[] = [
  {
    id: "transactions",
    titre: "Comprendre les transactions",
    module: "Transactions",
    etapes: [
      {
        titre: "Revenu vs Dépense",
        contenu: "Un revenu est une entrée d'argent dans votre entreprise (vente, prestation). Une dépense est une sortie d'argent (achat, loyer, salaire). Chaque transaction doit être classée dans l'une de ces deux catégories.",
      },
      {
        titre: "Les catégories",
        contenu: "Chaque transaction doit avoir une catégorie (Ventes, Salaires, Loyer…). Bien catégoriser est crucial pour lire vos rapports et identifier où va votre argent.",
      },
      {
        titre: "Le statut de la transaction",
        contenu: "Validée : confirmée et comptabilisée. En attente : à vérifier ou à encaisser. Annulée : erreur ou remboursement. Gardez vos transactions à jour pour avoir une image fidèle de votre activité.",
      },
      {
        titre: "La double-entrée",
        contenu: "En comptabilité formelle, chaque transaction génère deux écritures : un débit et un crédit d'égale valeur. Par exemple, une vente de 100 000 FCFA débite la Banque (+) et crédite les Ventes (+). CompTrack gère cela automatiquement en vue journal.",
      },
    ],
  },
  {
    id: "factures",
    titre: "Maîtriser la facturation",
    module: "Factures",
    etapes: [
      {
        titre: "Pourquoi une facture ?",
        contenu: "La facture est un document légal qui prouve une vente ou prestation. Elle sécurise votre relation avec le client, vous permet de suivre les paiements et est indispensable pour la comptabilité.",
      },
      {
        titre: "Le cycle de vie d'une facture",
        contenu: "Brouillon → vous la préparez. Envoyée → le client la reçoit. En attente → vous attendez le règlement. Payée → encaissée. En retard → délai dépassé, relancez ! CompTrack avance le statut en 1 clic.",
      },
      {
        titre: "Numérotation séquentielle",
        contenu: "Les factures doivent être numérotées sans interruption (FAC-2026-001, 002, 003…). Cela est souvent exigé par la loi pour la conformité fiscale. CompTrack le fait automatiquement.",
      },
      {
        titre: "Quand marquer payée ?",
        contenu: "Dès réception du paiement (mobile money, virement, espèces). Marquer payée dans CompTrack crée automatiquement une transaction revenu — votre trésorerie est mise à jour instantanément.",
      },
    ],
  },
  {
    id: "rapports",
    titre: "Lire vos rapports financiers",
    module: "Rapports",
    etapes: [
      {
        titre: "Le tableau de bord vs Rapports",
        contenu: "Le dashboard montre le mois en cours en temps réel. Les rapports permettent des analyses sur plusieurs mois, comparaisons et exports. Consultez les rapports au moins 1 fois par mois.",
      },
      {
        titre: "Comprendre le bilan",
        contenu: "Le bilan est une photo de votre patrimoine à un instant T. Actif (ce que vous avez) = Passif (ce que vous devez + capitaux propres). Si vos capitaux propres augmentent, votre entreprise prend de la valeur !",
      },
      {
        titre: "Le compte de résultat",
        contenu: "Il mesure votre PERFORMANCE sur une période : Produits (revenus) − Charges = Résultat net. Un résultat positif = bénéfice. Négatif = perte. C'est votre vrai indicateur de rentabilité.",
      },
      {
        titre: "La marge nette",
        contenu: "Marge = Résultat net / Revenus × 100. Si vous gagnez 1 395 000 FCFA et votre résultat est 702 000 FCFA, votre marge est 50%. Visez >20% pour être sain. En-dessous de 10%, revoyez vos charges.",
      },
      {
        titre: "Analyser les dépenses",
        contenu: "Le graphique camembert montre votre répartition des dépenses. Si les salaires dépassent 40% de vos revenus, c'est une vigilance. Si le loyer dépasse 15%, envisagez de renégocier. Ces ratios varient selon votre secteur.",
      },
    ],
  },
];

const tips: { module: string; icon: typeof BookOpen; couleur: string; astuces: string[] }[] = [
  {
    module: "Transactions",
    icon: ArrowLeftRight,
    couleur: "var(--green)",
    astuces: [
      "Enregistrez vos transactions au quotidien — le rétroactif est fastidieux et source d'erreurs.",
      "Un débit augmente votre trésorerie (argent reçu). Un crédit la diminue (argent donné).",
      "Utilisez des descriptions précises : «Loyer local Zogona — Juin 2026» plutôt que «Loyer».",
      "Récurrences : configurez salaires, loyer, abonnements en entrées récurrentes pour ne pas oublier.",
    ],
  },
  {
    module: "Factures",
    icon: FileText,
    couleur: "var(--amber)",
    astuces: [
      "Envoyez la facture dès la prestation terminée — plus vous attendez, plus le client oublie.",
      "Relancez à J+3 si pas de paiement après l'envoi. La relance est normale et professionnelle.",
      "Une facture en retard depuis +30 jours nécessite une mise en demeure formelle.",
      "Le numéro séquentiel est obligatoire pour la fiscalité : ne sautez jamais un numéro.",
    ],
  },
  {
    module: "Rapports",
    icon: BarChart3,
    couleur: "var(--blue)",
    astuces: [
      "Consultez votre bilan 1× par trimestre pour mesurer l'évolution de vos capitaux propres.",
      "Comparez les mois entre eux pour identifier les cycles saisonniers de votre activité.",
      "Si votre marge baisse, cherchez d'abord si vos prix n'ont pas bougé face à des charges qui augmentent.",
      "Le bénéfice net n'est pas de la trésorerie disponible : des créances impayées peuvent gonfler le bénéfice mais pas la banque.",
    ],
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────

export default function ApprendrePage() {
  const [conceptOuvert, setConceptOuvert] = useState<string | null>(null);
  const [coursActif, setCoursActif] = useState<string | null>(null);
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  const [etapesTerminees, setEtapesTerminees] = useState<Record<string, Set<number>>>({});

  const toggleConcept = (terme: string) => {
    setConceptOuvert(prev => prev === terme ? null : terme);
  };

  const demarrerCours = (id: string) => {
    setCoursActif(id);
    setEtapeActuelle(0);
  };

  const marquerEtape = (coursId: string, idx: number) => {
    setEtapesTerminees(prev => {
      const set = new Set(prev[coursId] ?? []);
      set.add(idx);
      return { ...prev, [coursId]: set };
    });
  };

  const cours = miniCours.find(c => c.id === coursActif);
  const etapesCoursTerminees = etapesTerminees[coursActif ?? ""] ?? new Set();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Apprendre la comptabilité</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
            Concepts clés, tips pratiques et mini-cours guidés
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "var(--green)" }}
        >
          <GraduationCap className="w-4 h-4" />
          Module d&apos;auto-formation
        </div>
      </div>

      {/* Mini-cours en cours */}
      {coursActif && cours && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--border)", background: "rgba(34,197,94,0.05)" }}
          >
            <div>
              <p className="text-xs font-mono mb-0.5" style={{ color: "var(--green)" }}>
                MINI-COURS EN COURS
              </p>
              <h3 className="font-bold">{cours.titre}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: "var(--text2)" }}>
                {etapeActuelle + 1} / {cours.etapes.length}
              </span>
              <button
                onClick={() => setCoursActif(null)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-70"
                style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
              >
                Quitter
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5" style={{ background: "var(--bg3)" }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${((etapeActuelle + 1) / cours.etapes.length) * 100}%`,
                background: "var(--green)",
              }}
            />
          </div>

          {/* Contenu étape */}
          <div className="p-6">
            {/* Étapes nav */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {cours.etapes.map((etape, i) => (
                <button
                  key={i}
                  onClick={() => setEtapeActuelle(i)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: etapeActuelle === i ? "rgba(34,197,94,0.15)" : etapesCoursTerminees.has(i) ? "rgba(34,197,94,0.08)" : "var(--bg3)",
                    border: etapeActuelle === i ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--border)",
                    color: etapeActuelle === i ? "var(--green)" : etapesCoursTerminees.has(i) ? "var(--green)" : "var(--text2)",
                  }}
                >
                  {etapesCoursTerminees.has(i) && <CheckCircle2 className="w-3 h-3" />}
                  {i + 1}. {etape.titre}
                </button>
              ))}
            </div>

            {/* Contenu */}
            <div
              className="p-5 rounded-xl mb-6"
              style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 flex-shrink-0" style={{ color: "var(--amber)" }} />
                <h4 className="font-semibold text-sm">{cours.etapes[etapeActuelle].titre}</h4>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                {cours.etapes[etapeActuelle].contenu}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setEtapeActuelle(p => Math.max(0, p - 1))}
                disabled={etapeActuelle === 0}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70 disabled:opacity-30"
                style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
              >
                ← Précédent
              </button>
              <button
                onClick={() => {
                  marquerEtape(coursActif, etapeActuelle);
                  if (etapeActuelle < cours.etapes.length - 1) {
                    setEtapeActuelle(p => p + 1);
                  } else {
                    setCoursActif(null);
                  }
                }}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: "var(--green)", color: "#000" }}
              >
                {etapeActuelle < cours.etapes.length - 1 ? "Suivant →" : "✓ Terminer le cours"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mini-cours disponibles */}
      {!coursActif && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: "var(--blue)" }} />
            Mini-cours
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {miniCours.map((cours) => {
              const terminees = etapesTerminees[cours.id]?.size ?? 0;
              const pct = Math.round((terminees / cours.etapes.length) * 100);
              return (
                <div
                  key={cours.id}
                  className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
                  onClick={() => demarrerCours(cours.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(59,130,246,0.1)", color: "var(--blue)" }}
                    >
                      {cours.module}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "var(--text2)" }}>
                      {cours.etapes.length} étapes
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-3">{cours.titre}</h3>

                  {/* Progress */}
                  <div className="h-1.5 rounded-full mb-1.5" style={{ background: "var(--bg3)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--blue)" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: "var(--text2)" }}>
                    <span>{pct}% complété</span>
                    <span style={{ color: pct === 100 ? "var(--green)" : "var(--blue)" }}>
                      {pct === 100 ? "✓ Terminé" : pct > 0 ? "Continuer →" : "Commencer →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips par module */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" style={{ color: "var(--amber)" }} />
          Astuces pratiques
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tips.map((t) => (
            <div
              key={t.module}
              className="p-5 rounded-2xl border"
              style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${t.couleur}18` }}
                >
                  <t.icon className="w-4 h-4" style={{ color: t.couleur }} />
                </div>
                <h3 className="font-semibold text-sm">{t.module}</h3>
              </div>
              <ul className="space-y-3">
                {t.astuces.map((astuce, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold"
                      style={{ background: `${t.couleur}20`, color: t.couleur }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text2)" }}>
                      {astuce}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Glossaire */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5" style={{ color: "var(--green)" }} />
          Glossaire comptable
          <span className="text-sm font-normal" style={{ color: "var(--text2)" }}>
            ({concepts.length} termes) · Cliquez pour l&apos;exemple
          </span>
        </h2>
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
          {concepts.map((concept, i) => (
            <div
              key={concept.terme}
              className="border-b last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => toggleConcept(concept.terme)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(34,197,94,0.1)", color: "var(--green)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{concept.terme}</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text2)" }}>
                      {concept.definition}
                    </p>
                  </div>
                </div>
                {conceptOuvert === concept.terme ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0 ml-4" style={{ color: "var(--text2)" }} />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0 ml-4" style={{ color: "var(--text2)" }} />
                )}
              </button>

              {conceptOuvert === concept.terme && (
                <div className="px-6 pb-5">
                  <div
                    className="p-4 rounded-xl space-y-3"
                    style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
                  >
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--text2)" }}>
                        Définition
                      </p>
                      <p className="text-sm leading-relaxed">{concept.definition}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--amber)" }}>
                        💡 Exemple concret
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                        {concept.exemple}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
