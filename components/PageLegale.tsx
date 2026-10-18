import Link from "next/link";
import type { ReactNode } from "react";
import CompTrackLogo from "@/components/CompTrackLogo";

interface PageLegaleProps {
  titre: string;
  misAJour: string;
  children: ReactNode;
}

export default function PageLegale({ titre, misAJour, children }: PageLegaleProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <header className="border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center min-h-10 hover:opacity-80 transition-opacity">
            <CompTrackLogo />
          </Link>
          <Link href="/" className="inline-flex items-center min-h-10 text-sm hover:opacity-80" style={{ color: "var(--cyan)" }}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">{titre}</h1>
        <p className="text-xs mb-10" style={{ color: "var(--text3)" }}>Dernière mise à jour : {misAJour}</p>
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{children}</div>
      </main>
    </div>
  );
}

export function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>{titre}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
