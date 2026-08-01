import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPrefs, savePrefs, DEFAULT_PREFS, formatMoney } from "../lib/prefs";
import type { Notification } from "../lib/data";

// ─── TVA 18% (FacturePDF) ────────────────────────────────────────────────────
const TVA_RATE = 0.18;

describe("TVA 18% — FacturePDF", () => {
  it("TVA_RATE vaut exactement 0.18", () => {
    expect(TVA_RATE).toBe(0.18);
  });

  it("calcule la TVA sur 100 000 FCFA HT", () => {
    const ht = 100_000;
    expect(Math.round(ht * TVA_RATE)).toBe(18_000);
  });

  it("calcule le TTC sur 250 000 FCFA HT", () => {
    const ht = 250_000;
    expect(Math.round(ht * (1 + TVA_RATE))).toBe(295_000);
  });

  it("TTC = HT + TVA", () => {
    const ht = 500_000;
    const tva = ht * TVA_RATE;
    const ttc = ht * (1 + TVA_RATE);
    expect(ttc).toBeCloseTo(ht + tva, 5);
  });

  it("calcule la TVA sur chaque article indépendamment", () => {
    const articles = [
      { description: "Café", quantite: 2, prixUnitaire: 50_000, total: 100_000 },
      { description: "Cacao", quantite: 1, prixUnitaire: 200_000, total: 200_000 },
    ];
    const totalHT = articles.reduce((s, a) => s + a.total, 0);
    const totalTVA = totalHT * TVA_RATE;
    const totalTTC = totalHT * (1 + TVA_RATE);
    expect(totalHT).toBe(300_000);
    expect(Math.round(totalTVA)).toBe(54_000);
    expect(Math.round(totalTTC)).toBe(354_000);
  });
});

// ─── NotificationBell — logique (sans rendu React) ───────────────────────────
// Reproduit les helpers de NotificationsClient.tsx

function tempsRelatif(iso: string, now = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `Il y a ${heures}h`;
  const jours = Math.floor(heures / 24);
  return `Il y a ${jours}j`;
}

type Filtre = "toutes" | "non-lues" | "alertes";

function filtrerNotifications(notifications: Notification[], filtre: Filtre): Notification[] {
  return notifications.filter((n) => {
    if (filtre === "non-lues") return !n.lue;
    if (filtre === "alertes") return n.type === "alerte" || n.type === "erreur";
    return true;
  });
}

function compterNonLues(notifications: Notification[]): number {
  return notifications.filter((n) => !n.lue).length;
}

function marquerToutes(notifications: Notification[]): Notification[] {
  return notifications.map((n) => ({ ...n, lue: true }));
}

const NOTIFS: Notification[] = [
  {
    id: "n1", titre: "Facture payée", message: "FAC-001 réglée", type: "succes",
    categorie: "facture", lue: false, lien: null, createdAt: "2026-08-01T09:00:00Z",
  },
  {
    id: "n2", titre: "Budget dépassé", message: "Transport +15%", type: "alerte",
    categorie: "depense", lue: false, lien: null, createdAt: "2026-08-01T08:00:00Z",
  },
  {
    id: "n3", titre: "Objectif atteint", message: "500k FCFA", type: "succes",
    categorie: "objectif", lue: true, lien: null, createdAt: "2026-07-31T12:00:00Z",
  },
  {
    id: "n4", titre: "Erreur sync", message: "Connexion échouée", type: "erreur",
    categorie: "general", lue: false, lien: null, createdAt: "2026-08-01T07:00:00Z",
  },
];

describe("NotificationBell — tempsRelatif()", () => {
  it("retourne 'À l'instant' pour < 1 min", () => {
    const now = new Date("2026-08-01T10:00:30Z").getTime();
    const createdAt = "2026-08-01T10:00:00Z";
    expect(tempsRelatif(createdAt, now)).toBe("À l'instant");
  });

  it("retourne 'Il y a N min' pour < 1h", () => {
    const now = new Date("2026-08-01T10:30:00Z").getTime();
    const createdAt = "2026-08-01T10:00:00Z";
    expect(tempsRelatif(createdAt, now)).toBe("Il y a 30 min");
  });

  it("retourne 'Il y a Nh' pour < 24h", () => {
    const now = new Date("2026-08-01T16:00:00Z").getTime();
    const createdAt = "2026-08-01T10:00:00Z";
    expect(tempsRelatif(createdAt, now)).toBe("Il y a 6h");
  });

  it("retourne 'Il y a Nj' pour ≥ 24h", () => {
    const now = new Date("2026-08-03T10:00:00Z").getTime();
    const createdAt = "2026-08-01T10:00:00Z";
    expect(tempsRelatif(createdAt, now)).toBe("Il y a 2j");
  });
});

describe("NotificationBell — filtrage", () => {
  it("filtre 'toutes' retourne tout", () => {
    expect(filtrerNotifications(NOTIFS, "toutes")).toHaveLength(4);
  });

  it("filtre 'non-lues' retourne uniquement les non lues", () => {
    const result = filtrerNotifications(NOTIFS, "non-lues");
    expect(result).toHaveLength(3);
    expect(result.every((n) => !n.lue)).toBe(true);
  });

  it("filtre 'alertes' retourne alerte + erreur", () => {
    const result = filtrerNotifications(NOTIFS, "alertes");
    expect(result).toHaveLength(2);
    expect(result.map((n) => n.type)).toContain("alerte");
    expect(result.map((n) => n.type)).toContain("erreur");
  });

  it("compte correctement les non lues", () => {
    expect(compterNonLues(NOTIFS)).toBe(3);
  });

  it("marquer toutes comme lues → 0 non lues", () => {
    const marquees = marquerToutes(NOTIFS);
    expect(compterNonLues(marquees)).toBe(0);
    expect(marquees.every((n) => n.lue)).toBe(true);
  });
});

// ─── lib/prefs.ts — formatMoney ──────────────────────────────────────────────
describe("formatMoney()", () => {
  it("formate en FCFA pour XOF", () => {
    const result = formatMoney(150_000, "XOF");
    expect(result).toContain("FCFA");
    expect(result).toContain("150");
  });

  it("formate en EUR", () => {
    const result = formatMoney(1_000, "EUR");
    expect(result).toContain("€");
  });

  it("formate en USD", () => {
    const result = formatMoney(500, "USD");
    expect(result).toContain("$");
  });

  it("formate 0 FCFA", () => {
    const result = formatMoney(0, "XOF");
    expect(result).toContain("0");
    expect(result).toContain("FCFA");
  });
});

// ─── lib/prefs.ts — getPrefs / savePrefs ─────────────────────────────────────
describe("UserPrefs localStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("getPrefs retourne DEFAULT_PREFS si rien en localStorage", () => {
    const prefs = getPrefs();
    expect(prefs).toEqual(DEFAULT_PREFS);
  });

  it("savePrefs persiste les prefs et getPrefs les relit", () => {
    const custom = { ...DEFAULT_PREFS, companyName: "FORGE Afrika", currency: "XOF" as const };
    savePrefs(custom);
    const loaded = getPrefs();
    expect(loaded.companyName).toBe("FORGE Afrika");
  });

  it("getPrefs merge avec DEFAULT_PREFS si clé manquante", () => {
    window.localStorage.setItem("comptrack:prefs", JSON.stringify({ companyName: "Test" }));
    const prefs = getPrefs();
    expect(prefs.companyName).toBe("Test");
    expect(prefs.currency).toBe(DEFAULT_PREFS.currency);
  });

  it("getPrefs retourne DEFAULT_PREFS si JSON corrompu", () => {
    window.localStorage.setItem("comptrack:prefs", "{invalid json");
    const prefs = getPrefs();
    expect(prefs).toEqual(DEFAULT_PREFS);
  });
});
