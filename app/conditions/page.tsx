import type { Metadata } from "next";
import Link from "next/link";
import PageLegale, { Section } from "@/components/PageLegale";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — CompTrack",
  description: "Les règles simples d'utilisation de CompTrack pendant la phase pilote.",
};

export default function ConditionsPage() {
  return (
    <PageLegale titre="Conditions d'utilisation" misAJour="octobre 2026">
      <Section titre="Un logiciel en développement">
        <p>
          CompTrack est présenté sous forme d’aperçu public. Des fonctions peuvent changer, être
          interrompues ou disparaître. Il est fourni tel quel, sans garantie de disponibilité continue.
        </p>
      </Section>
      <Section titre="Votre responsabilité">
        <p>
          Les calculs, documents et rapports produits par CompTrack sont une aide. Vous restez responsable de
          l&apos;exactitude de vos écritures et de vos déclarations fiscales et sociales. Faites-les valider par
          un professionnel avant tout usage officiel.
        </p>
      </Section>
      <Section titre="Vos données">
        <p>
          Vous restez propriétaire des données que vous saisissez. Voir la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>{" "}
          pour savoir où elles sont stockées.
        </p>
      </Section>
      <Section titre="Usage acceptable">
        <p>
          Vous vous engagez à ne pas détourner le service, à ne pas tenter d&apos;accéder aux données d&apos;autrui
          et à ne pas l&apos;utiliser pour une activité illégale.
        </p>
      </Section>
      <Section titre="Tarifs">
        <p>
          Les formules affichées sur la page{" "}
          <Link href="/tarifs" className="underline">
            Tarifs
          </Link>{" "}
          indiquent les montants prévus. Aucun paiement n&apos;est collecté sur ce site et aucune souscription
          n&apos;est activée dans l&apos;aperçu.
        </p>
      </Section>
      <Section titre="Résiliation">
        <p>
          Vous pouvez arrêter d&apos;utiliser CompTrack à tout moment. Pour supprimer les données d&apos;un
          compte, écrivez à{" "}
          <a href="mailto:docompaore2@gmail.com" className="underline">
            docompaore2@gmail.com
          </a>
          .
        </p>
      </Section>
    </PageLegale>
  );
}
