import type { Metadata } from "next";
import { DM_Mono, DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import MotionAccessibility from "@/components/MotionAccessibility";
import ScrollToTop from "@/components/ScrollToTop";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://comptrack-chi.vercel.app"),
  title: {
    default: "CompTrack — La comptabilité qui tombe juste",
    template: "%s · CompTrack",
  },
  description:
    "Un aperçu en développement pour suivre les opérations, les factures et les rapports en FCFA. Les données sont enregistrées dans le navigateur sur cet appareil.",
  keywords: ["comptabilité", "PME", "FCFA", "factures", "suivi financier"],
  authors: [{ name: "CompTrack" }],
  openGraph: {
    title: "CompTrack — La comptabilité qui tombe juste",
    description:
      "Un aperçu en développement pour suivre les opérations et les factures en FCFA.",
    type: "website",
    siteName: "CompTrack",
    url: "https://comptrack-chi.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CompTrack — La comptabilité qui tombe juste",
    description: "Un aperçu en développement, avec des données conservées sur l’appareil.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${dmSerifDisplay.variable} ${dmSans.variable} ${dmMono.variable}`}>
        <MotionAccessibility>
          {children}
          <ScrollToTop />
        </MotionAccessibility>
      </body>
    </html>
  );
}
