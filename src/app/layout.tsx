import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://comptrack.vercel.app"),
  title: {
    default: "CompTrack Finance OS",
    template: "%s | CompTrack",
  },
  description:
    "Premium accounting, sales, invoicing, cash-flow and client operations cockpit.",
  applicationName: "CompTrack",
  authors: [{ name: "CompTrack" }],
  creator: "CompTrack",
  keywords: [
    "accounting",
    "finance",
    "invoicing",
    "sales tracking",
    "cash-flow",
    "business operations",
  ],
  openGraph: {
    title: "CompTrack Finance OS",
    description:
      "Premium accounting, sales, invoicing, cash-flow and client operations cockpit.",
    siteName: "CompTrack",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
