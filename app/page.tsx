import type { Metadata } from "next";
import Link from "next/link";
import FactureScene from "@/components/public/FactureScene";
import LedgerIllustration from "@/components/public/LedgerIllustration";
import PublicLayout from "@/components/public/PublicLayout";
import Reveal from "@/components/public/Reveal";

export const metadata: Metadata = {
  title: "La comptabilité qui tombe juste",
  description:
    "CompTrack est en développement. Découvrez un aperçu de suivi des opérations, des factures et des rapports en FCFA, avec des données enregistrées sur votre appareil.",
};

export default function HomePage() {
  return (
    <PublicLayout>
      <main id="contenu">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="public-container home-hero__grid">
            <div className="home-hero__copy">
              <p className="home-hero__status">Aperçu · en développement</p>
              <h1 id="hero-title">
                Vos comptes équilibrés, <em>sans comptable à plein temps.</em>
              </h1>
              <p className="home-hero__description">
                CompTrack rassemble le suivi des opérations, les factures et les rapports dans
                un même aperçu, pensé autour des montants en FCFA.
              </p>
              <Link href="/dashboard" className="public-cta">
                Ouvrir l’aperçu <span className="public-cta__arrow" aria-hidden="true">→</span>
              </Link>
              <p className="home-hero__note">
                Pas de compte sur l’aperçu public. Les données saisies restent dans le stockage
                local du navigateur, sur cet appareil.
              </p>
            </div>

            <LedgerIllustration />
          </div>
        </section>

        <Reveal>
          <section className="ledger-principle" aria-labelledby="ledger-title">
            <div className="public-container ledger-principle__grid">
              <div
                className="ledger-principle__visual"
                role="img"
                aria-label="Schéma d’un compte en T, avec les colonnes débit et crédit et un total équilibré."
              >
                <p className="ledger-principle__visual-title">Le compte en T</p>
                <div className="ledger-principle__balance">
                  <div className="ledger-principle__side">
                    <h3>Débit</h3>
                    <div className="ledger-principle__line" />
                    <div className="ledger-principle__line ledger-principle__line--short" />
                  </div>
                  <div className="ledger-principle__side">
                    <h3>Crédit</h3>
                    <div className="ledger-principle__line" />
                    <div className="ledger-principle__line ledger-principle__line--short" />
                  </div>
                </div>
                <div className="ledger-principle__total">
                  <span>Somme des côtés</span>
                  <strong>À équilibrer</strong>
                </div>
              </div>

              <div className="ledger-principle__copy">
                <span className="public-eyebrow">Une lecture claire</span>
                <h2 id="ledger-title">Chaque écriture a son répondant.</h2>
                <p>
                  L’application comprend un journal de transactions en double entrée, avec des
                  catégories rattachées à un plan comptable simplifié. Le compte en T en donne
                  la règle visuelle : une écriture se lit des deux côtés.
                </p>
                <p className="ledger-principle__disclosure">
                  Cette présentation ne constitue pas une attestation de conformité SYSCOHADA.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="invoice-section" aria-labelledby="invoice-title">
            <div className="public-container invoice-section__grid">
              <div className="invoice-section__copy">
                <span className="public-eyebrow">De la pièce au journal</span>
                <h2 id="invoice-title">La facture se prépare. Le journal se relit.</h2>
                <p>
                  L’aperçu contient un écran de création de factures et un journal de
                  transactions. Cette illustration de principe les met en regard ; elle ne
                  représente pas une synchronisation automatique entre les deux.
                </p>
                <p className="invoice-section__caption">
                  L’interface illustrée est un schéma, pas une capture de l’application.
                </p>
              </div>

              <FactureScene />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section
            id="fonctionnalites"
            className="product-notes"
            aria-labelledby="features-title"
          >
            <div className="public-container">
              <div className="product-notes__head">
                <div>
                  <span className="public-eyebrow">Ce que contient l’aperçu</span>
                  <h2 id="features-title">Les gestes utiles, réunis.</h2>
                </div>
                <p>
                  Les écrans ci-dessous existent dans le produit en développement. Leur usage
                  public ne requiert pas de compte ; les données restent dans le navigateur.
                </p>
              </div>

              <div className="product-notes__list">
                <article className="product-note">
                  <span className="product-note__label">Enregistrer</span>
                  <h3>Opérations et contacts</h3>
                  <p>
                    Saisir des transactions et suivre les revenus, les dépenses, les clients et
                    les fournisseurs dans leurs écrans dédiés.
                  </p>
                </article>
                <article className="product-note">
                  <span className="product-note__label">Préparer</span>
                  <h3>Factures et pièces</h3>
                  <p>
                    Créer des factures en FCFA et consulter leur état dans l’interface de
                    l’application.
                  </p>
                </article>
                <article className="product-note">
                  <span className="product-note__label">Relire</span>
                  <h3>Tableau de bord et rapports</h3>
                  <p>
                    Parcourir les vues de suivi, les objectifs et les rapports à partir des
                    informations saisies dans l’aperçu.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="device-note" aria-labelledby="device-title">
            <div className="public-container device-note__grid">
              <div>
                <span className="public-eyebrow">Données sur l’appareil</span>
                <h2 id="device-title">Un aperçu local, sans compte.</h2>
                <p>
                  Sur le déploiement public actuel, aucune connexion n’est activée. Les listes
                  créées par l’application sont stockées dans le navigateur de cet appareil ;
                  elles ne sont pas synchronisées avec un autre appareil.
                </p>
              </div>
              <div className="device-note__stamp">
                Aperçu public<br />
                Stockage navigateur<br />
                En développement
              </div>
            </div>
          </section>
        </Reveal>

        <section className="home-end" aria-labelledby="home-end-title">
          <div className="public-container home-end__inner">
            <div>
              <span className="public-eyebrow">CompTrack · aperçu</span>
              <h2 id="home-end-title">La comptabilité qui tombe juste.</h2>
            </div>
            <Link href="/dashboard" className="public-cta">
              Ouvrir l’aperçu <span className="public-cta__arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
