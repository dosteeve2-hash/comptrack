import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { supabaseConfigure } from "@/lib/supabase/config";
import ConnexionFormulaire from "./ConnexionFormulaire";

export const metadata: Metadata = {
  title: "Connexion — CompTrack",
  description: "Connectez-vous à votre espace CompTrack.",
};

export default function ConnexionPage() {
  const configure = supabaseConfigure();

  return (
    <div className="w-full max-w-md">
      <Suspense fallback={null}>
        <ConnexionFormulaire />
      </Suspense>
      {!configure && (
        <div className="mt-6 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--text2)" }}>
            L&apos;authentification n&apos;est pas active sur ce déploiement. Vous pouvez
            quand même essayer l&apos;application en mode démo : vos données restent sur cet appareil.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center min-h-11 px-6 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            Voir la démo
          </Link>
        </div>
      )}
    </div>
  );
}
