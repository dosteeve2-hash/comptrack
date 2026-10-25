import Link from "next/link";
import CompTrackLogo from "@/components/CompTrackLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="ct-app min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-10"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <Link href="/" aria-label="Retour à l’accueil CompTrack" className="min-h-11 inline-flex items-center">
        <CompTrackLogo variant="dark" />
      </Link>
      {children}
    </main>
  );
}
