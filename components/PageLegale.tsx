import type { ReactNode } from "react";
import PublicLayout from "@/components/public/PublicLayout";

interface PageLegaleProps {
  titre: string;
  misAJour: string;
  children: ReactNode;
}

export default function PageLegale({ titre, misAJour, children }: PageLegaleProps) {
  return (
    <PublicLayout>
      <main id="contenu" className="legal-page">
        <header className="legal-page__header">
          <div className="public-container">
            <span className="public-eyebrow">Informations CompTrack</span>
            <h1>{titre}</h1>
            <p>Dernière mise à jour : {misAJour}</p>
          </div>
        </header>
        <div className="public-container legal-page__body">{children}</div>
      </main>
    </PublicLayout>
  );
}

export function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section>
      <h2>{titre}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
