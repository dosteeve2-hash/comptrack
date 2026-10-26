import Image from "next/image";

export default function LedgerIllustration() {
  return (
    <div
      className="ledger-art"
      role="img"
      aria-label="Illustration d’un compte en T avec des écritures au débit et au crédit, puis un total équilibré."
    >
      <div className="ledger-art__sheet">
        <div className="ledger-art__topline">
          <span className="ledger-art__identity">
            <Image src="/brand/mark.svg" alt="" width={22} height={22} />
            <span className="ledger-art__label">Journal · écriture double</span>
          </span>
          <span className="ledger-art__seal">Exemple</span>
        </div>
        <h2 className="ledger-art__heading">Une entrée, deux côtés.</h2>

        <div className="ledger-art__columns">
          <section className="ledger-art__column" aria-label="Colonne débit">
            <h3>Débit</h3>
            <div className="ledger-art__entry">
              <span>Caisse</span>
              <span className="ledger-art__amount">FCFA</span>
            </div>
            <div className="ledger-art__entry">
              <span>Client</span>
              <span className="ledger-art__amount">FCFA</span>
            </div>
          </section>
          <section className="ledger-art__column" aria-label="Colonne crédit">
            <h3>Crédit</h3>
            <div className="ledger-art__entry">
              <span>Ventes</span>
              <span className="ledger-art__amount">FCFA</span>
            </div>
            <div className="ledger-art__entry">
              <span>Règlement</span>
              <span className="ledger-art__amount">FCFA</span>
            </div>
          </section>
        </div>

        <div className="ledger-art__total">
          <span>Total des colonnes</span>
          <strong>Équilibré</strong>
        </div>
        <p className="ledger-art__caption">Schéma de principe, sans données réelles.</p>
      </div>
    </div>
  );
}
