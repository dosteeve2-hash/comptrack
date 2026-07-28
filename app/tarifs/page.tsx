"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const plans = [
  {
    name: "Solo",
    desc: "Pour démarrer en solo",
    priceMonthly: 0,
    priceAnnual: 0,
    highlighted: false,
    badge: null as string | null,
    features: [
      { text: "1 utilisateur", included: true },
      { text: "50 transactions / mois", included: true },
      { text: "Tableau de bord basique", included: true },
      { text: "Export PDF limité (5/mois)", included: true },
      { text: "Transactions illimitées", included: false },
      { text: "Factures professionnelles", included: false },
      { text: "Rapports OHADA", included: false },
      { text: "Export Excel", included: false },
      { text: "Support email", included: false },
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/dashboard",
  },
  {
    name: "PME",
    desc: "Pour les équipes en croissance",
    priceMonthly: 15000,
    priceAnnual: 12000,
    highlighted: true,
    badge: "⭐ Populaire" as string | null,
    features: [
      { text: "5 utilisateurs", included: true },
      { text: "Transactions illimitées", included: true },
      { text: "Toutes les pages dashboard", included: true },
      { text: "Factures + Rapports OHADA complets", included: true },
      { text: "Export Excel & PDF illimité", included: true },
      { text: "Support email 48h", included: true },
      { text: "Multi-entreprises", included: false },
      { text: "API accès", included: false },
      { text: "Support prioritaire 4h", included: false },
    ],
    cta: "Essayer 30 jours gratuit",
    ctaHref: "/dashboard",
  },
  {
    name: "Entreprise",
    desc: "Pour les groupes multi-entités",
    priceMonthly: 45000,
    priceAnnual: 36000,
    highlighted: false,
    badge: null as string | null,
    features: [
      { text: "Utilisateurs illimités", included: true },
      { text: "Transactions illimitées", included: true },
      { text: "Toutes les pages dashboard", included: true },
      { text: "Factures + Rapports OHADA complets", included: true },
      { text: "Export Excel & PDF illimité", included: true },
      { text: "Multi-entreprises", included: true },
      { text: "API accès", included: true },
      { text: "Support prioritaire 4h", included: true },
      { text: "Formation en ligne incluse", included: true },
    ],
    cta: "Contacter l'équipe",
    ctaHref: "mailto:docompaore2@gmail.com",
  },
];

const faqs = [
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui. Vous pouvez annuler votre abonnement à tout moment sans frais ni pénalité. Vos données restent accessibles pendant 30 jours après l'annulation.",
  },
  {
    q: "Que se passe-t-il après les 30 jours d'essai ?",
    a: "Vous serez automatiquement rétrogradé au plan Solo (gratuit) si vous ne souscrivez pas à un plan payant. Aucune carte bancaire n'est débitée sans votre consentement explicite.",
  },
  {
    q: "CompTrack est-il vraiment conforme OHADA ?",
    a: "Oui. CompTrack génère automatiquement les états financiers conformes au Système Comptable OHADA (SYSCOHADA) : bilan, compte de résultat, et tableau de flux de trésorerie.",
  },
  {
    q: "Puis-je importer mes données existantes ?",
    a: "Oui, CompTrack supporte l'import de fichiers Excel et CSV. Notre équipe vous accompagne gratuitement dans la migration de vos données historiques.",
  },
  {
    q: "Y a-t-il une version mobile ?",
    a: "CompTrack est une web app responsive qui fonctionne parfaitement sur mobile et tablette. Une application native iOS/Android est en développement.",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "Nous acceptons Mobile Money (Orange Money, Wave, MTN), virements bancaires, et cartes Visa/Mastercard. Paiement mensuel ou annuel (économisez 20%).",
  },
];

function formatPrice(price: number): string {
  if (price === 0) return "Gratuit";
  return price.toLocaleString("fr-FR") + " FCFA";
}

export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "rgba(10,22,40,0.92)", backdropFilter: "blur(14px)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono" style={{ background: "var(--gold)", color: "var(--navy)" }}>CT</div>
            <span className="font-bold text-lg">CompTrack</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm rounded-xl font-semibold hover:brightness-110" style={{ background: "var(--gold)", color: "var(--navy)" }}>
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="pt-32 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-6" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "var(--gold)" }}>
          ✦ Tarifs transparents, sans surprise
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choisissez votre plan</h1>
        <p className="text-lg mb-10" style={{ color: "var(--text2)" }}>
          Commencez gratuitement, évoluez au rythme de votre croissance.
        </p>

        {/* Toggle mensuel/annuel */}
        <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setAnnual(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: !annual ? "var(--gold)" : "transparent", color: !annual ? "var(--navy)" : "var(--text2)" }}
          >
            Mensuel
          </button>
          <button
            onClick={() => setAnnual(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            style={{ background: annual ? "var(--gold)" : "transparent", color: annual ? "var(--navy)" : "var(--text2)" }}
          >
            Annuel
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: annual ? "var(--navy)" : "rgba(212,175,55,0.15)", color: annual ? "var(--gold)" : "var(--gold)" }}>
              −20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={i}
                className="rounded-2xl p-6 relative flex flex-col"
                style={{
                  background: plan.highlighted ? "rgba(212,175,55,0.06)" : "var(--bg2)",
                  border: plan.highlighted ? "2px solid var(--gold)" : "1px solid var(--border)",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: "var(--gold)", color: "var(--navy)" }}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                  <p className="text-sm mb-4" style={{ color: "var(--text2)" }}>{plan.desc}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold font-mono" style={{ color: plan.highlighted ? "var(--gold)" : "var(--text)" }}>
                      {formatPrice(price)}
                    </span>
                  </div>
                  {price > 0 && <p className="text-xs mt-1" style={{ color: "var(--text2)" }}>/ mois {annual ? "(facturé annuellement)" : ""}</p>}
                  {annual && price > 0 && (
                    <p className="text-xs mt-1 font-semibold" style={{ color: "var(--green)" }}>
                      Vous économisez {((plan.priceMonthly - plan.priceAnnual) * 12).toLocaleString("fr-FR")} FCFA/an
                    </p>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm">
                      {feat.included
                        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: plan.highlighted ? "var(--gold)" : "var(--cyan)" }} />
                        : <X className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text3)" }} />
                      }
                      <span style={{ color: feat.included ? "var(--text)" : "var(--text3)" }}>{feat.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                  style={plan.highlighted
                    ? { background: "var(--gold)", color: "var(--navy)" }
                    : { background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }
                  }
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Guarantee */}
        <div className="mt-12 text-center p-6 rounded-2xl" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--gold)" }}>🛡️ Garantie satisfait ou remboursé 30 jours</p>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            Pas convaincu ? Nous vous remboursons intégralement dans les 30 premiers jours, sans question.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: openFaq === i ? "var(--bg2)" : "var(--bg3)" }}
                >
                  <span className="text-sm font-medium">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "var(--gold)" }} />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text2)" }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA bottom */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-3">Une question ? Notre équipe est là.</h3>
          <p className="text-sm mb-6" style={{ color: "var(--text2)" }}>Réponse garantie en moins de 24h.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:brightness-110" style={{ background: "var(--gold)", color: "var(--navy)" }}>
              Démarrer gratuitement
            </Link>
            <Link href="mailto:docompaore2@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:opacity-80" style={{ border: "1px solid var(--border2)", color: "var(--text)" }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </div>

      {/* Footer simple */}
      <footer className="border-t py-6 px-6 text-center" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text3)" }}>
          © 2026 CompTrack — <Link href="/" className="hover:opacity-80">Retour à l&apos;accueil</Link>
        </p>
      </footer>
    </div>
  );
}
