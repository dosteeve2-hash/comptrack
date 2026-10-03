import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  usePersistedList,
  computeKpisMoisActuel,
  computeTopCategoriesDepenses,
  computeTopClients,
  computeTopProduits,
  computeClientStats,
} from "../lib/store";
import type { Categorie, Facture, Transaction } from "../lib/data";

const KEY = "comptrack_test_list";

interface Item {
  id: string;
  label: string;
}

describe("usePersistedList", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("démarre vide et marque loaded=true quand aucune donnée n'est en localStorage", () => {
    const { result } = renderHook(() => usePersistedList<Item>(KEY));

    expect(result.current[0]).toEqual([]);
    expect(result.current[2]).toBe(true);
  });

  it("charge les données déjà présentes en localStorage au montage", () => {
    window.localStorage.setItem(KEY, JSON.stringify([{ id: "1", label: "a" }]));

    const { result } = renderHook(() => usePersistedList<Item>(KEY));

    expect(result.current[0]).toEqual([{ id: "1", label: "a" }]);
    expect(result.current[2]).toBe(true);
  });

  it("persiste en localStorage lors d'un setList", () => {
    const { result } = renderHook(() => usePersistedList<Item>(KEY));

    act(() => {
      result.current[1]([{ id: "1", label: "nouveau" }]);
    });

    expect(result.current[0]).toEqual([{ id: "1", label: "nouveau" }]);
    expect(JSON.parse(window.localStorage.getItem(KEY) ?? "[]")).toEqual([
      { id: "1", label: "nouveau" },
    ]);
  });

  it("accepte un updater fonctionnel et persiste le résultat", () => {
    window.localStorage.setItem(KEY, JSON.stringify([{ id: "1", label: "a" }]));
    const { result } = renderHook(() => usePersistedList<Item>(KEY));

    act(() => {
      result.current[1]((prev) => [...prev, { id: "2", label: "b" }]);
    });

    expect(result.current[0]).toEqual([
      { id: "1", label: "a" },
      { id: "2", label: "b" },
    ]);
    expect(JSON.parse(window.localStorage.getItem(KEY) ?? "[]")).toEqual([
      { id: "1", label: "a" },
      { id: "2", label: "b" },
    ]);
  });

  it("survit à un remount : les données persistées sont relues", () => {
    const first = renderHook(() => usePersistedList<Item>(KEY));
    act(() => {
      first.result.current[1]([{ id: "1", label: "persisté" }]);
    });
    first.unmount();

    const second = renderHook(() => usePersistedList<Item>(KEY));

    expect(second.result.current[0]).toEqual([{ id: "1", label: "persisté" }]);
  });

  it("retombe sur [] si le JSON en localStorage est corrompu", () => {
    window.localStorage.setItem(KEY, "{ceci n'est pas du json valide");

    const { result } = renderHook(() => usePersistedList<Item>(KEY));

    expect(result.current[0]).toEqual([]);
    expect(result.current[2]).toBe(true);
  });

  it("retombe sur [] si localStorage.getItem lève une exception", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("quota dépassé");
    });

    const { result } = renderHook(() => usePersistedList<Item>(KEY));

    expect(result.current[0]).toEqual([]);
    spy.mockRestore();
  });
});

// ─── Fixtures ────────────────────────────────────────────────────────────────

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: "t1",
    type: "depense",
    montant: 1000,
    categorie: "Transport",
    description: "desc",
    date: "2026-08-05",
    statut: "validee",
    ...overrides,
  };
}

function facture(overrides: Partial<Facture>): Facture {
  return {
    id: "f1",
    numero: "FAC-001",
    client: "Client A",
    montant: 1000,
    dateCreation: "2026-08-05",
    dateEcheance: "2026-08-20",
    statut: "payee",
    articles: [],
    ...overrides,
  };
}

const CATEGORIES: Categorie[] = [
  { id: "c1", nom: "Transport", type: "depense", couleur: "#f59e0b" },
  { id: "c2", nom: "Loyer", type: "depense", couleur: "#f97316" },
  { id: "c3", nom: "Marketing", type: "depense", couleur: "#ec4899" },
  { id: "c4", nom: "Maintenance", type: "depense", couleur: "#84cc16" },
];

describe("computeKpisMoisActuel", () => {
  const NOW = new Date("2026-08-15T10:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calcule solde, revenus/dépenses du mois et du mois précédent sur les transactions validées uniquement", () => {
    const transactions: Transaction[] = [
      tx({ id: "1", type: "revenu", montant: 50000, date: "2026-08-10", statut: "validee" }),
      tx({ id: "2", type: "depense", montant: 20000, date: "2026-08-12", statut: "validee" }),
      tx({ id: "3", type: "revenu", montant: 30000, date: "2026-07-10", statut: "validee" }),
      tx({ id: "4", type: "depense", montant: 10000, date: "2026-07-12", statut: "validee" }),
      // Non validée : ne doit compter dans aucun total.
      tx({ id: "5", type: "revenu", montant: 999999, date: "2026-08-10", statut: "en_attente" }),
    ];

    const kpis = computeKpisMoisActuel(transactions);

    expect(kpis.revenusMois).toBe(50000);
    expect(kpis.depensesMois).toBe(20000);
    expect(kpis.beneficeNet).toBe(30000);
    expect(kpis.revenusMoisPrecedent).toBe(30000);
    expect(kpis.depensesMoisPrecedent).toBe(10000);
    expect(kpis.beneficeNetPrecedent).toBe(20000);
    expect(kpis.solde).toBe(50000 + 30000 - 20000 - 10000);
  });

  it("retourne des totaux nuls quand il n'y a aucune transaction validée", () => {
    const kpis = computeKpisMoisActuel([tx({ statut: "en_attente" })]);

    expect(kpis.solde).toBe(0);
    expect(kpis.revenusMois).toBe(0);
    expect(kpis.depensesMois).toBe(0);
    expect(kpis.beneficeNet).toBe(0);
  });
});

describe("computeTopCategoriesDepenses", () => {
  const NOW = new Date("2026-08-15T10:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retourne [] si aucune dépense validée ce mois-ci", () => {
    expect(computeTopCategoriesDepenses([], CATEGORIES)).toEqual([]);
    expect(
      computeTopCategoriesDepenses(
        [tx({ type: "depense", statut: "en_attente", date: "2026-08-10" })],
        CATEGORIES
      )
    ).toEqual([]);
  });

  it("agrège par catégorie, trie par montant décroissant et regroupe le reste en 'Autres'", () => {
    const transactions: Transaction[] = [
      tx({ id: "1", categorie: "Transport", montant: 5000, date: "2026-08-01" }),
      tx({ id: "2", categorie: "Transport", montant: 5000, date: "2026-08-02" }),
      tx({ id: "3", categorie: "Loyer", montant: 50000, date: "2026-08-03" }),
      tx({ id: "4", categorie: "Marketing", montant: 3000, date: "2026-08-04" }),
      tx({ id: "5", categorie: "Maintenance", montant: 1000, date: "2026-08-05" }),
    ];

    const result = computeTopCategoriesDepenses(transactions, CATEGORIES, 3);

    expect(result[0]).toMatchObject({ nom: "Loyer", montant: 50000 });
    expect(result[1]).toMatchObject({ nom: "Transport", montant: 10000 });
    expect(result[2]).toMatchObject({ nom: "Autres", montant: 3000 + 1000, couleur: "#6b7280" });
  });

  it("ignore les dépenses hors du mois en cours ou non validées", () => {
    const transactions: Transaction[] = [
      tx({ categorie: "Transport", montant: 5000, date: "2026-07-01" }),
      tx({ categorie: "Transport", montant: 7000, date: "2026-08-01", statut: "en_attente" }),
    ];

    expect(computeTopCategoriesDepenses(transactions, CATEGORIES)).toEqual([]);
  });
});

describe("computeTopClients", () => {
  it("retourne [] si aucune facture payée", () => {
    expect(computeTopClients([])).toEqual([]);
    expect(computeTopClients([facture({ statut: "envoyee" })])).toEqual([]);
  });

  it("agrège le volume payé par client et trie décroissant", () => {
    const factures: Facture[] = [
      facture({ id: "f1", client: "Boutique A", montant: 10000, statut: "payee" }),
      facture({ id: "f2", client: "Boutique A", montant: 5000, statut: "payee" }),
      facture({ id: "f3", client: "Boutique B", montant: 50000, statut: "payee" }),
      facture({ id: "f4", client: "Boutique C", montant: 1000, statut: "en_attente" }),
    ];

    const result = computeTopClients(factures, 2);

    expect(result).toEqual([
      { nom: "Boutique B", montant: 50000, nbFactures: 1 },
      { nom: "Boutique A", montant: 15000, nbFactures: 2 },
    ]);
  });
});

describe("computeTopProduits", () => {
  it("retourne [] si aucune facture payée", () => {
    expect(computeTopProduits([])).toEqual([]);
  });

  it("agrège quantité et montant par produit à travers les factures payées", () => {
    const factures: Facture[] = [
      facture({
        id: "f1",
        statut: "payee",
        articles: [
          { description: "Sac", quantite: 2, prixUnitaire: 5000, total: 10000 },
          { description: "Chapeau", quantite: 1, prixUnitaire: 3000, total: 3000 },
        ],
      }),
      facture({
        id: "f2",
        statut: "payee",
        articles: [{ description: "Sac", quantite: 3, prixUnitaire: 5000, total: 15000 }],
      }),
      facture({
        id: "f3",
        statut: "brouillon",
        articles: [{ description: "Sac", quantite: 999, prixUnitaire: 1, total: 999 }],
      }),
    ];

    const result = computeTopProduits(factures, 5);

    expect(result[0]).toEqual({ nom: "Sac", quantite: 5, montant: 25000 });
    expect(result[1]).toEqual({ nom: "Chapeau", quantite: 1, montant: 3000 });
  });
});

describe("computeClientStats", () => {
  it("retourne des stats vides pour un client sans facture payée", () => {
    const stats = computeClientStats("Inconnu", []);

    expect(stats.totalDepense).toBe(0);
    expect(stats.nbTransactions).toBe(0);
    expect(stats.derniereVisite).toBeNull();
    expect(stats.frequenceMoyenneJours).toBeNull();
    expect(stats.produitsFavoris).toEqual([]);
    expect(stats.timeline).toEqual([]);
  });

  it("calcule total dépensé, dernière visite, fréquence moyenne et produits favoris", () => {
    const factures: Facture[] = [
      facture({
        id: "f1",
        numero: "FAC-001",
        client: "Aminata",
        montant: 10000,
        dateCreation: "2026-06-01",
        statut: "payee",
        articles: [{ description: "Riz", quantite: 2, prixUnitaire: 2500, total: 5000 }],
      }),
      facture({
        id: "f2",
        numero: "FAC-002",
        client: "Aminata",
        montant: 20000,
        dateCreation: "2026-07-01",
        statut: "payee",
        articles: [{ description: "Riz", quantite: 1, prixUnitaire: 2500, total: 2500 }],
      }),
      facture({
        id: "f3",
        numero: "FAC-003",
        client: "Aminata",
        montant: 999,
        dateCreation: "2026-07-15",
        statut: "en_attente",
        articles: [],
      }),
    ];

    const stats = computeClientStats("Aminata", factures);

    expect(stats.totalDepense).toBe(30000);
    expect(stats.nbTransactions).toBe(2);
    expect(stats.derniereVisite).toBe("2026-07-01");
    expect(stats.frequenceMoyenneJours).toBe(30);
    expect(stats.produitsFavoris[0]).toEqual({ nom: "Riz", count: 3 });
    expect(stats.timeline).toHaveLength(2);
    expect(stats.timeline[0]).toEqual({ numero: "FAC-002", date: "2026-07-01", montant: 20000 });
  });
});
