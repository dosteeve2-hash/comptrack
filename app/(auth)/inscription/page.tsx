"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";

interface FormState {
  nom: string;
  email: string;
  nomEntreprise: string;
  password: string;
}

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    nom: "",
    email: "",
    nomEntreprise: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as FormState));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.nom || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsLoading(true);
    // Simulation création compte — remplacer par Supabase Auth
    await new Promise((res) => setTimeout(res, 1200));
    setIsLoading(false);
    router.push("/dashboard");
  };

  const fields: Array<{
    name: keyof FormState;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
  }> = [
    { name: "nom", label: "Votre nom", type: "text", placeholder: "Jean Ouédraogo", required: true },
    { name: "email", label: "Adresse email", type: "email", placeholder: "jean@entreprise.com", required: true },
    { name: "nomEntreprise", label: "Nom de l'entreprise (optionnel)", type: "text", placeholder: "Mon Commerce SARL", required: false },
  ];

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-2xl p-8"
        style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Créez votre compte</h1>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            Gratuit, sans carte bancaire. Prêt en 2 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-2" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="8 caractères minimum"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  color: "var(--text)",
                }}
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

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "var(--red)",
              }}
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
              <UserPlus className="w-4 h-4" />
            )}
            {isLoading ? "Création du compte..." : "Créer mon compte gratuit"}
          </button>

          <p className="text-xs text-center" style={{ color: "var(--text3)" }}>
            En créant un compte, vous acceptez nos{" "}
            <a href="#" style={{ color: "var(--green)" }}>Conditions d&apos;utilisation</a>
            {" "}et notre{" "}
            <a href="#" style={{ color: "var(--green)" }}>Politique de confidentialité</a>.
          </p>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text2)" }}>
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--green)" }}
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
