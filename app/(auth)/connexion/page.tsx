"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    // Simulation connexion — remplacer par Supabase Auth
    await new Promise((res) => setTimeout(res, 1000));
    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-2xl p-8"
        style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Bon retour 👋</h1>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            Connectez-vous pour accéder à votre espace CompTrack.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border2)",
                color: "var(--text)",
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  color: "var(--text)",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity hover:opacity-70"
                style={{ color: "var(--text2)" }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm transition-opacity hover:opacity-80" style={{ color: "var(--green)" }}>
              Mot de passe oublié ?
            </a>
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "var(--green)", color: "#000" }}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text2)" }}>
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--green)" }}
          >
            Créer un compte gratuit
          </Link>
        </p>
      </div>

      {/* Demo hint */}
      <p className="text-center text-xs mt-4" style={{ color: "var(--text3)" }}>
        Démo : entrez n&apos;importe quel email et mot de passe pour accéder au dashboard
      </p>
    </div>
  );
}
