/**
 * Préférences de personnalisation CompTrack — 100% locales.
 * Stockées dans localStorage sur l'appareil de l'utilisateur :
 * aucune donnée de personnalisation n'est envoyée au serveur.
 */

export interface UserPrefs {
  /** Nom de l'entreprise affiché dans la barre latérale et les rapports */
  companyName: string;
  /** Couleur d'accent principale (hex) — remplace l'or par défaut */
  accentColor: string;
  /** Devise d'affichage */
  currency: "XOF" | "XAF" | "GNF" | "MAD" | "NGN" | "GHS" | "EUR" | "USD";
  /** Pays (pour la législation / plan comptable) */
  country: string;
  /** Densité d'affichage */
  density: "confort" | "compact";
}

export const DEFAULT_PREFS: UserPrefs = {
  companyName: "Mon Entreprise",
  accentColor: "#d4af37",
  currency: "XOF",
  country: "Burkina Faso",
  density: "confort",
};

export const CURRENCIES: { code: UserPrefs["currency"]; label: string }[] = [
  { code: "XOF", label: "Franc CFA (UEMOA) — FCFA" },
  { code: "XAF", label: "Franc CFA (CEMAC) — FCFA" },
  { code: "GNF", label: "Franc guinéen — GNF" },
  { code: "MAD", label: "Dirham marocain — MAD" },
  { code: "NGN", label: "Naira — ₦" },
  { code: "GHS", label: "Cedi — GH₵" },
  { code: "EUR", label: "Euro — €" },
  { code: "USD", label: "Dollar US — $" },
];

export const ACCENT_PRESETS = [
  { name: "Or",      value: "#d4af37" },
  { name: "Bleu",    value: "#2f6fed" },
  { name: "Vert",    value: "#16a34a" },
  { name: "Violet",  value: "#8b5cf6" },
  { name: "Orange",  value: "#f59e0b" },
  { name: "Rouge",   value: "#dc2626" },
];

const KEY = "comptrack:prefs";

export function getPrefs(): UserPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<UserPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: UserPrefs): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(prefs));
  applyPrefs(prefs);
  // Notifie les autres composants montés (sidebar, header…)
  window.dispatchEvent(new CustomEvent("comptrack:prefs-changed", { detail: prefs }));
}

/** Applique la couleur d'accent aux variables CSS globales. */
export function applyPrefs(prefs: UserPrefs): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--gold", prefs.accentColor);
  root.style.setProperty("--accent", prefs.accentColor);
}

export function formatMoney(amount: number, currency: UserPrefs["currency"]): string {
  const symbols: Record<UserPrefs["currency"], string> = {
    XOF: "FCFA", XAF: "FCFA", GNF: "GNF", MAD: "MAD",
    NGN: "₦", GHS: "GH₵", EUR: "€", USD: "$",
  };
  return `${amount.toLocaleString("fr-FR")} ${symbols[currency]}`;
}
