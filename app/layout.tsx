import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CompTrack — Comptabilité pour entreprises africaines",
  description:
    "La comptabilité simple et efficace pour les TPE/PME africaines. Gérez vos revenus, dépenses et factures en toute simplicité.",
  keywords: ["comptabilité", "TPE", "PME", "Afrique", "FCFA", "facturation"],
  authors: [{ name: "Steeve Donald Compaoré" }],
  openGraph: {
    title: "CompTrack — Comptabilité simplifiée",
    description: "La comptabilité simple pour votre business africain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
