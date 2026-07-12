import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CompTrack — Comptabilité SaaS pour PME africaines",
  description:
    "Gérez vos finances, factures, dépenses et rapports en FCFA. Conforme OHADA. Essai gratuit 30 jours. La solution comptable simple pour les PME d'Afrique.",
  keywords: [
    "comptabilité", "PME", "Afrique", "FCFA", "OHADA",
    "factures", "SaaS", "TPE", "gestion financière", "Burkina Faso",
    "Côte d'Ivoire", "Sénégal", "comptabilité africaine",
  ],
  authors: [{ name: "FORGE Afrika" }],
  openGraph: {
    title: "CompTrack — Comptabilité SaaS pour PME africaines",
    description:
      "La comptabilité simple pour les PME africaines. FCFA, OHADA, factures automatiques.",
    type: "website",
    siteName: "CompTrack",
  },
  twitter: {
    card: "summary_large_image",
    title: "CompTrack — Comptabilité SaaS pour PME africaines",
    description: "La comptabilité simple pour les PME africaines. FCFA, OHADA.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
