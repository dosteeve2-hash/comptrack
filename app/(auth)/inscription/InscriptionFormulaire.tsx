"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigure } from "@/lib/supabase/config";
import BanniereNonConfigure from "../BanniereNonConfigure";

const MOT_DE_PASSE_MIN = 8;

export default function InscriptionFormulaire() {
  const configure = supabaseConfigure();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!configure) return;
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password.length < MOT_DE_PASSE_MIN) {
      setError(`Le mot de passe doit contenir au moins ${MOT_DE_PASSE_MIN} caractères.`);
      return;
    }
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) {
        setError(authError.message);
      } else {
        setEnvoye(true);
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl p-8" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            Ouvrez votre espace CompTrack en quelques secondes.
          </p>
        </div>

        {!configure && <BanniereNonConfigure />}

        {envoye ? (
          <div
            role="status"
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(34,217,138,0.10)", border: "1px solid rgba(34,217,138,0.25)", color: "var(--text)" }}
          >
            Compte créé. Un email de confirmation vient d&apos;être envoyé à <strong>{email}</strong> :
            cliquez sur le lien pour activer votre espace.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">Adresse email</label>
              <input
                id="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                required
                disabled={!configure}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  autoComplete="new-password"
                  minLength={MOT_DE_PASSE_MIN}
                  className="w-full px-4 py-3 pr-14 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  required
                  disabled={!configure}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 min-w-10 min-h-9 inline-flex items-center justify-center rounded transition-opacity hover:opacity-70"
                  style={{ color: "var(--text2)" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading || !configure}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "var(--gold)", color: "var(--navy)" }}>
              {isLoading
                ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                : <UserPlus className="w-4 h-4" />
              }
              {isLoading ? "Création..." : "Créer mon compte"}
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6" style={{ color: "var(--text2)" }}>
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium inline-flex items-center min-h-9 transition-opacity hover:opacity-80" style={{ color: "var(--gold)" }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
