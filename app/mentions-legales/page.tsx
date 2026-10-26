import type { Metadata } from "next";
import PageLegale, { Section } from "@/components/PageLegale";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Qui édite CompTrack, qui l'héberge et comment nous joindre.",
};

export default function MentionsLegalesPage() {
  return (
    <PageLegale titre="Mentions légales" misAJour="octobre 2026">
      <Section titre="Éditeur">
        <p>
          CompTrack est un produit de l&apos;écosystème FORGE Afrika, en développement. Il est édité à titre
          individuel par Steve Donald Compaoré. Aucune société n&apos;est mise en avant à ce stade : ce site
          présente un aperçu logiciel, pas une offre commerciale établie.
        </p>
        <p>
          Contact :{" "}
          <a href="mailto:docompaore2@gmail.com" className="underline">
            docompaore2@gmail.com
          </a>
        </p>
      </Section>
      <Section titre="Hébergement">
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
        </p>
      </Section>
      <Section titre="Nature du service">
        <p>
          CompTrack aide à suivre ses ventes, dépenses, factures et déclarations. Il ne remplace ni un
          expert-comptable ni un conseil fiscal : les montants et documents produits doivent être vérifiés
          avant tout usage officiel.
        </p>
      </Section>
      <Section titre="Propriété du contenu">
        <p>
          Le code, les textes et l&apos;identité visuelle de CompTrack appartiennent à leur éditeur. Les données
          que vous saisissez vous appartiennent.
        </p>
      </Section>
      <Section titre="Signaler un problème">
        <p>
          Pour signaler un contenu, une erreur ou un problème de sécurité, écrivez à l&apos;adresse de contact
          ci-dessus.
        </p>
      </Section>
    </PageLegale>
  );
}
