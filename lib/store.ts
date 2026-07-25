"use client";

// lib/store.ts — Persistance locale (localStorage) + calculs dérivés.
// MVP : source de vérité = localStorage. À remplacer par Supabase SSR
// en gardant la même forme de retour (voir CLAUDE.md).

import { useCallback, useEffect, useState } from "react";
import type { Categorie, Client, DonneesMensuelles, Facture, Transaction } from "./data";

const STORAGE_KEYS = {
  transactions: "comptrack_transactions",
  clients: "comptrack_clients",
  factures: "comptrack_factures",
  budgets: "comptrack_budgets",
  objectifs: "comptrack_objectifs",
} as const;

type Updater<T> = T[] | ((prev: T[]) => T[]);

function loadList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function saveList<T>(key: string, list: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // stockage indisponible (mode privé, quota) — on ignore silencieusement
  }
}

/** Liste persistée dans localStorage. `loaded` passe à true une fois la lecture initiale faite. */
export function usePersistedList<T>(key: string) {
  const [list, setListState] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setListState(loadList<T>(key));
    setLoaded(true);
  }, [key]);

  const setList = useCallback(
    (updater: Updater<T>) => {
      setListState((prev) => {
        const next = typeof updater === "function" ? (updater as (p: T[]) => T[])(prev) : updater;
        saveList(key, next);
        return next;
      });
    },
    [key]
  );

  return [list, setList, loaded] as const;
}

export function useTransactions() {
  return usePersistedList<Transaction>(STORAGE_KEYS.transactions);
}

export function useClients() {
  return usePersistedList<Client>(STORAGE_KEYS.clients);
}

export function useFactures() {
  return usePersistedList<Facture>(STORAGE_KEYS.factures);
}

export { STORAGE_KEYS };

// ─── Calculs dérivés ────────────────────────────────────────────────────────

const MOIS_ABBR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function sameMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(dateStr);
  return d.getFullYear() === year && d.getMonth() === month;
}

function sumMontant(list: Transaction[]): number {
  return list.reduce((s, t) => s + t.montant, 0);
}

/** Revenus/dépenses des N derniers mois calendaires. [] si aucune transaction n'existe encore. */
export function computeDonneesMensuelles(transactions: Transaction[], monthsCount = 6): DonneesMensuelles[] {
  if (transactions.length === 0) return [];

  const confirmees = transactions.filter((t) => t.statut !== "annulee");
  const now = new Date();
  const result: DonneesMensuelles[] = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const revenus = sumMontant(confirmees.filter((t) => t.type === "revenu" && sameMonth(t.date, y, m)));
    const depenses = sumMontant(confirmees.filter((t) => t.type === "depense" && sameMonth(t.date, y, m)));
    result.push({ mois: MOIS_ABBR[m], revenus, depenses, benefice: revenus - depenses });
  }

  return result;
}

export interface KpisMoisActuel {
  solde: number;
  revenusMois: number;
  revenusMoisPrecedent: number;
  depensesMois: number;
  depensesMoisPrecedent: number;
  beneficeNet: number;
  beneficeNetPrecedent: number;
}

/** KPIs du mois en cours vs mois précédent, calculés sur les transactions validées. */
export function computeKpisMoisActuel(transactions: Transaction[]): KpisMoisActuel {
  const validees = transactions.filter((t) => t.statut === "validee");
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const prev = new Date(y, m - 1, 1);
  const py = prev.getFullYear();
  const pm = prev.getMonth();

  const revenusMois = sumMontant(validees.filter((t) => t.type === "revenu" && sameMonth(t.date, y, m)));
  const depensesMois = sumMontant(validees.filter((t) => t.type === "depense" && sameMonth(t.date, y, m)));
  const revenusMoisPrecedent = sumMontant(validees.filter((t) => t.type === "revenu" && sameMonth(t.date, py, pm)));
  const depensesMoisPrecedent = sumMontant(validees.filter((t) => t.type === "depense" && sameMonth(t.date, py, pm)));

  const soldeRevenus = sumMontant(validees.filter((t) => t.type === "revenu"));
  const soldeDepenses = sumMontant(validees.filter((t) => t.type === "depense"));

  return {
    solde: soldeRevenus - soldeDepenses,
    revenusMois,
    revenusMoisPrecedent,
    depensesMois,
    depensesMoisPrecedent,
    beneficeNet: revenusMois - depensesMois,
    beneficeNetPrecedent: revenusMoisPrecedent - depensesMoisPrecedent,
  };
}

export interface TopCategorie {
  nom: string;
  montant: number;
  couleur: string;
}

const PALETTE_FALLBACK = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

/** Répartition des dépenses du mois en cours par catégorie (top N + "Autres"). [] si aucune dépense ce mois-ci. */
export function computeTopCategoriesDepenses(
  transactions: Transaction[],
  categories: Categorie[],
  topN = 5
): TopCategorie[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const depensesMois = transactions.filter(
    (t) => t.type === "depense" && t.statut === "validee" && sameMonth(t.date, y, m)
  );
  if (depensesMois.length === 0) return [];

  const parCategorie = new Map<string, number>();
  for (const t of depensesMois) {
    parCategorie.set(t.categorie, (parCategorie.get(t.categorie) ?? 0) + t.montant);
  }

  const trie = Array.from(parCategorie.entries())
    .map(([nom, montant]) => ({
      nom,
      montant,
      couleur: categories.find((c) => c.nom === nom)?.couleur ?? "",
    }))
    .sort((a, b) => b.montant - a.montant);

  const top = trie.slice(0, topN - 1);
  const reste = trie.slice(topN - 1).reduce((s, c) => s + c.montant, 0);

  const resultat: TopCategorie[] = top.map((c, i) => ({
    ...c,
    couleur: c.couleur || PALETTE_FALLBACK[i % PALETTE_FALLBACK.length],
  }));

  if (reste > 0) {
    resultat.push({ nom: "Autres", montant: reste, couleur: "#6b7280" });
  }

  return resultat;
}
