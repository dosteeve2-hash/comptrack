"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Globe, ArrowRight, ChevronLeft, CheckCircle2 } from "lucide-react";

const secteurs = [
  "Commerce général", "Textile / Mode", "Restauration / Alimentation",
  "BTP / Construction", "Services / Conseil", "Tech / Numérique",
  "Agriculture / Élevage", "Transport / Logistique", "Santé / Pharma", "Autre",
];

const pays = [
  "Burkina Faso", "Côte d'Ivoire", "Sénégal", "Mali", "Niger",
  "Guinée", "Togo", "Bénin", "Cameroun", "Nigeria", "Ghana", "Autre",
];

const devises = [
  { code: "FCFA", label: "Franc CFA (FCFA)", flag: "🇧🇫" },
  { code: "XOF",  label: "Franc CFA UEMOA (XOF)", flag: "🌍" },
  { code: "EUR",  label: "Euro (EUR)", flag: "🇪🇺" },
  { code: "USD",  label: "Dollar US (USD)", flag: "🇺🇸" },
  { code: "GHS",  label: "Cedi Ghanéen (GHS)", flag: "🇬🇭" },
  { code: "NGN",  label: "Naira Nigérian (NGN)", flag: "🇳🇬" },
];

interface Config {
  nomEntreprise: string;
  secteur: string;
  pays: string;
  devise: string;
}

const STEPS = [
  { titre: "Votre entreprise", icon: Building2, desc: "Comment s'appelle votre entreprise ?" },
  { titre: "Secteur & Pays",   icon: Globe,      desc: "Où et dans quel domaine opérez-vous ?" },
  { titre: "Devise principale", icon: CheckCircle2, desc: "Quelle devise utilisez-vous ?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<Config>({
    nomEntreprise: "",
    secteur: "",
    pays: "Burkina Faso",
    devise: "FCFA",
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext =
    (step === 0 && config.nomEntreprise.trim().length > 0) ||
    (step === 1 && config.secteur !== "" && config.pays !== "") ||
    step === 2;

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ct_onboarding_done", "1");
      localStorage.setItem("ct_entreprise_nom", config.nomEntreprise || "Mon Commerce");
      localStorage.setItem("ct_devise", config.devise);
    }
    router.push("/dashboard");
  };

  const StepIcon = STEPS[step].icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono" style={{ background: "var(--gold)", color: "var(--navy)" }}>CT</div>
          <span className="font-bold text-lg">CompTrack</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Configurons votre espace</h1>
        <p className="text-sm" style={{ color: "var(--text2)" }}>3 étapes rapides pour personnaliser CompTrack</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text2)" }}>
          {STEPS.map((s, i) => (
            <span key={i} style={{ color: i <= step ? "var(--gold)" : "var(--text3)", fontWeight: i === step ? "600" : "400" }}>
              {i < step ? "✓ " : `${i + 1}. `}{s.titre}
            </span>
          ))}
        </div>
        <div className="h-2 rounded-full" style={{ background: "var(--bg3)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--gold), var(--cyan))" }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>

        {/* Card header */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,188,212,0.06))" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.15)" }}>
              <StepIcon className="w-5 h-5" style={{ color: "var(--gold)" }} />
            </div>
            <div>
              <h2 className="font-bold">{STEPS[step].titre}</h2>
              <p className="text-xs" style={{ color: "var(--text2)" }}>{STEPS[step].desc}</p>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-6">

          {/* Step 1 — Entreprise */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom de l&apos;entreprise *</label>
                <input
                  type="text"
                  value={config.nomEntreprise}
                  onChange={(e) => setConfig(p => ({ ...p, nomEntreprise: e.target.value }))}
                  placeholder="Ex : Boutique Aminata SARL"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type d&apos;entreprise</label>
                <div className="flex flex-wrap gap-2">
                  {["Auto-entrepreneur", "SARL", "SAS", "SA", "GIE", "Autre"].map((t) => (
                    <button key={t} type="button"
                      onClick={() => setConfig(p => ({ ...p, type: t }))}
                      className="px-3 py-1.5 rounded-lg text-sm transition-all"
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border2)",
                        color: "var(--text2)",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Secteur & Pays */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Secteur d&apos;activité *</label>
                <div className="grid grid-cols-2 gap-2">
                  {secteurs.map((s) => (
                    <button key={s} type="button"
                      onClick={() => setConfig(p => ({ ...p, secteur: s }))}
                      className="px-3 py-2 rounded-xl text-sm text-left transition-all"
                      style={{
                        background: config.secteur === s ? "rgba(212,175,55,0.12)" : "var(--bg3)",
                        border: `1px solid ${config.secteur === s ? "var(--gold)" : "var(--border)"}`,
                        color: config.secteur === s ? "var(--gold)" : "var(--text2)",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pays *</label>
                <div className="grid grid-cols-2 gap-2">
                  {pays.map((p) => (
                    <button key={p} type="button"
                      onClick={() => setConfig(prev => ({ ...prev, pays: p }))}
                      className="px-3 py-2 rounded-xl text-sm text-left transition-all"
                      style={{
                        background: config.pays === p ? "rgba(0,188,212,0.12)" : "var(--bg3)",
                        border: `1px solid ${config.pays === p ? "var(--cyan)" : "var(--border)"}`,
                        color: config.pays === p ? "var(--cyan)" : "var(--text2)",
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Devise */}
          {step === 2 && (
            <div className="space-y-3">
              {devises.map((d) => (
                <button key={d.code} type="button"
                  onClick={() => setConfig(p => ({ ...p, devise: d.code }))}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    background: config.devise === d.code ? "rgba(212,175,55,0.1)" : "var(--bg3)",
                    border: `1px solid ${config.devise === d.code ? "var(--gold)" : "var(--border)"}`,
                  }}>
                  <span className="text-xl">{d.flag}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: config.devise === d.code ? "var(--gold)" : "var(--text)" }}>{d.code}</p>
                    <p className="text-xs" style={{ color: "var(--text2)" }}>{d.label}</p>
                  </div>
                  {config.devise === d.code && (
                    <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: "var(--gold)" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setStep(p => Math.max(0, p - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70 disabled:opacity-30"
            style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}>
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(p => p + 1)}
              disabled={!canNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
              style={{ background: "var(--gold)", color: "var(--navy)" }}>
              Suivant
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: "linear-gradient(90deg, var(--gold), var(--cyan))", color: "var(--navy)" }}>
              Commencer maintenant 🚀
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs" style={{ color: "var(--text3)" }}>
        Vous pourrez modifier ces informations dans les Paramètres.
      </p>
    </div>
  );
}
