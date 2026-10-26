"use client";

import { useState } from "react";

const plans = [
  {
    name: "Solo",
    description: "Tarif prévu pour un usage individuel",
    monthly: 0,
    annual: 0,
  },
  {
    name: "PME",
    description: "Tarif prévu pour une petite équipe",
    monthly: 15000,
    annual: 12000,
  },
  {
    name: "Entreprise",
    description: "Tarif prévu pour plusieurs entités",
    monthly: 45000,
    annual: 36000,
  },
] as const;

const faqs = [
  {
    question: "Puis-je souscrire à l’un de ces tarifs ?",
    answer:
      "Non. Les montants sont ceux prévus dans la grille actuelle ; aucune souscription ni facturation n’est disponible dans l’aperçu public.",
  },
  {
    question: "Dois-je créer un compte pour ouvrir l’aperçu ?",
    answer:
      "Non. L’authentification n’est pas active sur le déploiement public actuel. Les données saisies sont conservées dans le stockage local du navigateur, sur cet appareil.",
  },
  {
    question: "Les offres et leurs limites sont-elles déjà appliquées ?",
    answer:
      "Non. La répartition des fonctionnalités entre les offres et leurs limites ne sont pas actives dans l’application en développement.",
  },
  {
    question: "CompTrack certifie-t-il la conformité SYSCOHADA ?",
    answer:
      "Non. Le code propose un journal en double entrée et des catégories issues d’un plan comptable simplifié. Cela ne constitue pas une certification de conformité SYSCOHADA.",
  },
] as const;

function formatPrice(price: number): string {
  if (price === 0) return "Gratuit";
  return price.toLocaleString("fr-FR");
}

export default function TarifsClient() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <section className="tarifs-hero">
        <div className="public-container">
          <span className="public-eyebrow">Grille tarifaire prévue</span>
          <h1>Des tarifs lisibles, avant leur mise en service.</h1>
          <p>
            Les montants ci-dessous reprennent la grille existante de CompTrack. Le produit est
            encore en développement : aucun paiement, essai commercial ou abonnement n’est
            activé.
          </p>
          <div className="tarifs-status" role="status">
            Prix prévus · non facturés · offres et limites non appliquées dans l’aperçu
          </div>
        </div>
      </section>

      <section className="tarifs-prices public-container" aria-labelledby="prices-title">
        <div className="tarifs-prices__head">
          <h2 id="prices-title">Montants affichés en FCFA</h2>
          <div className="billing-toggle" role="group" aria-label="Période de tarif">
            <button
              type="button"
              aria-pressed={!annual}
              onClick={() => setAnnual(false)}
            >
              Mensuel
            </button>
            <button
              type="button"
              aria-pressed={annual}
              onClick={() => setAnnual(true)}
            >
              Annuel
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => {
            const price = annual ? plan.annual : plan.monthly;
            const panelId = `offre-${index}`;

            return (
              <article
                key={plan.name}
                id={panelId}
                className="pricing-plan"
                data-highlighted={index === 1}
                aria-label={`Tarif prévu ${plan.name}`}
              >
                <h3 className="pricing-plan__name">{plan.name}</h3>
                <p className="pricing-plan__description">{plan.description}</p>
                <p className="pricing-plan__price">
                  <span>{formatPrice(price)}</span>
                  {price > 0 && <small>FCFA / mois</small>}
                </p>
                <p className="pricing-plan__term">
                  {price === 0
                    ? "Montant prévu pour l’offre Solo."
                    : annual
                      ? `Équivalent mensuel d’un tarif annuel prévu ; économie affichée de ${((plan.monthly - plan.annual) * 12).toLocaleString("fr-FR")} FCFA/an.`
                      : "Montant mensuel prévu, hors facturation active."}
                </p>
                <p className="pricing-plan__note">
                  Offre indicative, sans inscription ni paiement possible aujourd’hui.
                </p>
              </article>
            );
          })}
        </div>

        <div className="tarifs-explainer">
          <h2>Ce que la grille ne promet pas encore</h2>
          <p>
            Les quotas, rôles d’équipe, délais de support et services listés dans l’ancienne
            présentation ne sont pas imposés par le code actuel. Les fonctionnalités de
            l’application et leur répartition par offre restent à préciser avant toute
            commercialisation.
          </p>
        </div>

        <section className="tarifs-faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Questions fréquentes</h2>
          <div>
            {faqs.map((faq, index) => {
              const open = openFaq === index;
              const answerId = `tarif-faq-${index}`;

              return (
                <div className="tarifs-faq__item" key={faq.question}>
                  <button
                    type="button"
                    className="tarifs-faq__question"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="tarifs-faq__icon" aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <div id={answerId} className="tarifs-faq__answer" hidden={!open}>
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="tarifs-bottom">
          <div>
            <span className="public-eyebrow">En développement</span>
            <h2>Parcourez l’aperçu sur cet appareil.</h2>
          </div>
          <a href="/dashboard" className="public-cta">
            Ouvrir l’aperçu <span className="public-cta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
