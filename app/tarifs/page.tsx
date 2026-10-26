import type { Metadata } from "next";
import PublicLayout from "@/components/public/PublicLayout";
import TarifsClient from "./TarifsClient";

export const metadata: Metadata = {
  title: "Tarifs prévus",
  description:
    "Consultez les montants mensuels et annuels prévus pour CompTrack. La facturation n’est pas activée sur l’aperçu en développement.",
};

export default function TarifsPage() {
  return (
    <PublicLayout>
      <main id="contenu" className="tarifs-page">
        <TarifsClient />
      </main>
    </PublicLayout>
  );
}
