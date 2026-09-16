import { AlertTriangle } from "lucide-react";

/**
 * Affiché au-dessus des formulaires de connexion et d'inscription quand le déploiement
 * n'a pas de Supabase. Sans ce message, le formulaire part, échoue contre une URL
 * factice, et rend une erreur réseau incompréhensible : l'utilisateur croit s'être
 * trompé de mot de passe alors qu'il n'y a aucun serveur en face.
 */
export default function BanniereNonConfigure() {
  return (
    <div
      role="status"
      className="mb-6 px-4 py-3 rounded-xl text-sm flex gap-3"
      style={{
        background: "rgba(245,158,11,0.10)",
        border: "1px solid rgba(245,158,11,0.25)",
        color: "var(--text)",
      }}
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
      <span>
        <strong>Ce déploiement n&apos;a pas de Supabase configuré.</strong> Aucune connexion
        n&apos;est possible ici, et le tableau de bord reste fermé. Il manque{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
      </span>
    </div>
  );
}
