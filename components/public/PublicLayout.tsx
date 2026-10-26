import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-public">
      <a className="public-skip-link" href="#contenu">
        Aller au contenu
      </a>

      <header className="public-header">
        <div className="public-container public-header__inner">
          <Link href="/" className="public-header__logo" aria-label="CompTrack, accueil">
            <Image src="/brand/logo.svg" alt="" width={176} height={45} priority />
          </Link>

          <nav className="public-nav" aria-label="Navigation principale">
            <Link href="/#fonctionnalites">Le produit</Link>
            <Link href="/tarifs">Tarifs prévus</Link>
            <Link href="/confidentialite">Données</Link>
          </nav>

          <details className="public-mobile-menu">
            <summary aria-label="Ouvrir la navigation" />
            <nav className="public-mobile-menu__panel" aria-label="Navigation mobile">
              <Link href="/#fonctionnalites">Le produit</Link>
              <Link href="/tarifs">Tarifs prévus</Link>
              <Link href="/confidentialite">Données</Link>
              <Link href="/conditions">Conditions</Link>
            </nav>
          </details>

          <Link href="/dashboard" className="public-cta public-header__cta">
            Ouvrir l’aperçu <span className="public-cta__arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      {children}

      <footer className="public-footer">
        <div className="public-container">
          <div className="public-footer__grid">
            <div className="public-footer__brand">
              <Link href="/" className="public-footer__logo" aria-label="CompTrack, accueil">
                <Image src="/brand/logo-sombre.svg" alt="" width={182} height={54} />
              </Link>
              <p className="public-footer__intro">
                La comptabilité qui tombe juste. CompTrack est en développement ; l’aperçu
                actuel garde vos données sur cet appareil.
              </p>
            </div>

            <div>
              <p className="public-footer__label">CompTrack</p>
              <nav className="public-footer__links" aria-label="Liens produit">
                <Link href="/#fonctionnalites">Le produit</Link>
                <Link href="/tarifs">Tarifs prévus</Link>
                <Link href="/confidentialite">Données et confidentialité</Link>
              </nav>
            </div>

            <div>
              <p className="public-footer__label">Informations</p>
              <nav className="public-footer__links" aria-label="Liens légaux et contact">
                <Link href="/conditions">Conditions d’utilisation</Link>
                <Link href="/mentions-legales">Mentions légales</Link>
                <a href="mailto:docompaore2@gmail.com">docompaore2@gmail.com</a>
              </nav>
            </div>
          </div>

          <div className="public-footer__bottom">
            <span>© {new Date().getFullYear()} CompTrack · Un produit FORGE Afrika</span>
            <Link href="/dashboard">Aperçu en développement</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
