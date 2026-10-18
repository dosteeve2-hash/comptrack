import type { Metadata } from "next";
import PageLegale, { Section } from "@/components/PageLegale";

export const metadata: Metadata = {
  title: "Politique de confidentialité — CompTrack",
  description: "Quelles données CompTrack garde, où, et comment les effacer.",
};

export default function ConfidentialitePage() {
  return (
    <PageLegale titre="Politique de confidentialité" misAJour="octobre 2026">
      <Section titre="En mode démo : tout reste sur votre appareil">
        <p>
          Quand vous ouvrez le tableau de bord sans compte, les informations que vous saisissez
          (transactions, factures, clients, employés, etc.) sont enregistrées dans le stockage local de votre
          navigateur. Elles ne sont envoyées à aucun serveur et nous n&apos;y avons pas accès.
        </p>
        <p>
          Conséquence : si vous videz les données du navigateur ou changez d&apos;appareil, ces informations ne
          sont plus disponibles. Pensez à exporter ce qui compte.
        </p>
      </Section>
      <Section titre="Si la création de compte est activée">
        <p>
          Votre adresse e-mail et votre mot de passe sont gérés par le service d&apos;authentification Supabase.
          Nous ne voyons jamais votre mot de passe en clair. Nous utilisons ces informations uniquement pour
          vous connecter.
        </p>
      </Section>
      <Section titre="Mesure des erreurs techniques">
        <p>
          Le site peut transmettre à Sentry des rapports d&apos;erreurs techniques (type d&apos;erreur, page
          concernée, navigateur) pour corriger les bogues. Ces rapports ne contiennent pas le contenu de votre
          comptabilité.
        </p>
      </Section>
      <Section titre="Vos droits">
        <p>
          Vous pouvez demander l&apos;accès, la correction ou la suppression des données associées à votre
          compte en écrivant à{" "}
          <a href="mailto:docompaore2@gmail.com" className="underline" style={{ color: "var(--cyan)" }}>
            docompaore2@gmail.com
          </a>
          . Pour les données du mode démo, vous les supprimez vous-même en vidant les données du site dans votre
          navigateur.
        </p>
      </Section>
      <Section titre="Partage">
        <p>Nous ne vendons pas vos données et ne les cédons à aucun tiers à des fins publicitaires.</p>
      </Section>
      <Section titre="Évolutions">
        <p>
          CompTrack est en phase pilote : cette politique sera mise à jour si le fonctionnement change, et la
          date ci-dessus en fera foi.
        </p>
      </Section>
    </PageLegale>
  );
}
