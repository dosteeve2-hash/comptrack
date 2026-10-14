import type { Metadata } from "next";
import Link from "next/link";
import { supabaseConfigure } from "@/lib/supabase/config";
import InscriptionFormulaire from "./InscriptionFormulaire";

export const metadata: Metadata = {
  title: "Créer un compte — CompTrack",
  description: "Créez votre compte CompTrack gratuitement.",
};

export default function InscriptionPage() {
  const configure = supabaseConfigure();

  return (
    <div className="w-full max-w-md">
      <InscriptionFormulaire />
      {!configure && (
        <div className="mt-6 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--text2)" }}>
            Les comptes ne peuvent pas être créés sur ce déploiement. La démo reste
            accessible avec des données d&apos;exemple.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center min-h-10 px-6 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            Voir la démo
          </Link>
        </div>
      )}
    </div>
  );
}
