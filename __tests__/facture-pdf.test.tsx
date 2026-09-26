import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FacturePDF } from "../components/FacturePDF";
import type { Facture, FactureArticle } from "../lib/data";

const TVA_RATE = 0.18;

/** Reproduit exactement fmtNum() de components/FacturePDF.tsx pour bâtir les attentes. */
function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("fr-FR");
}

const { textCalls, saveMock } = vi.hoisted(() => ({
  textCalls: [] as unknown[][],
  saveMock: vi.fn(),
}));

vi.mock("jspdf", () => ({
  jsPDF: vi.fn().mockImplementation(function () {
    return {
      setFillColor: vi.fn(),
      rect: vi.fn(),
      roundedRect: vi.fn(),
      setFont: vi.fn(),
      setFontSize: vi.fn(),
      setTextColor: vi.fn(),
      setDrawColor: vi.fn(),
      line: vi.fn(),
      text: vi.fn(function (...args: unknown[]) {
        textCalls.push(args);
      }),
      save: saveMock,
    };
  }),
}));

function article(overrides: Partial<FactureArticle>): FactureArticle {
  return { description: "Article", quantite: 1, prixUnitaire: 1000, total: 1000, ...overrides };
}

function facture(overrides: Partial<Facture>): Facture {
  return {
    id: "f1",
    numero: "FAC-2026-001",
    client: "Boutique Aminata",
    montant: 0,
    dateCreation: "2026-08-01",
    dateEcheance: "2026-08-15",
    statut: "envoyee",
    articles: [],
    ...overrides,
  };
}

/** Cherche un appel doc.text(str, ...) dont le premier argument correspond exactement. */
function textArg(expected: string) {
  return textCalls.find((call) => call[0] === expected);
}

describe("FacturePDF — calcul TVA 18%", () => {
  beforeEach(() => {
    textCalls.length = 0;
    saveMock.mockClear();
  });

  it("calcule TVA et TTC par article ainsi que les totaux pour une facture à deux articles", async () => {
    const user = userEvent.setup();
    const fact = facture({
      articles: [
        article({ description: "Sac", quantite: 2, prixUnitaire: 15000, total: 30000 }),
        article({ description: "Chapeau", quantite: 1, prixUnitaire: 5000, total: 5000 }),
      ],
    });

    render(<FacturePDF facture={fact} />);
    await user.click(screen.getByTitle("Télécharger PDF"));
    await waitFor(() => expect(saveMock).toHaveBeenCalledWith(`${fact.numero}.pdf`));

    const totalHT = 30000 + 5000;
    const totalTVA = totalHT * TVA_RATE;
    const totalTTC = totalHT * (1 + TVA_RATE);

    // Totaux de la facture.
    expect(textArg(`${fmtNum(totalHT)} FCFA`)).toBeDefined();
    expect(textArg(`${fmtNum(totalTVA)} FCFA`)).toBeDefined();
    expect(textArg(`${fmtNum(totalTTC)} FCFA`)).toBeDefined();

    // Ligne "Sac" : TVA = 30000 * 0.18 = 5400, TTC = 30000 * 1.18 = 35400.
    expect(textArg(fmtNum(30000 * TVA_RATE))).toBeDefined();
    expect(textArg(fmtNum(30000 * (1 + TVA_RATE)))).toBeDefined();

    // Ligne "Chapeau" : TVA = 900, TTC = 5900.
    expect(textArg(fmtNum(5000 * TVA_RATE))).toBeDefined();
    expect(textArg(fmtNum(5000 * (1 + TVA_RATE)))).toBeDefined();
  });

  it("gère un article à 0 FCFA sans fausser les totaux (TVA et TTC restent à 0 pour cette ligne)", async () => {
    const user = userEvent.setup();
    const fact = facture({
      articles: [
        article({ description: "Échantillon gratuit", quantite: 1, prixUnitaire: 0, total: 0 }),
        article({ description: "Sac", quantite: 1, prixUnitaire: 10000, total: 10000 }),
      ],
    });

    render(<FacturePDF facture={fact} />);
    await user.click(screen.getByTitle("Télécharger PDF"));
    await waitFor(() => expect(saveMock).toHaveBeenCalled());

    // L'article gratuit ne doit rien ajouter : TVA/TTC ligne = 0.
    expect(textArg(fmtNum(0))).toBeDefined();

    // Les totaux ne reflètent que l'article payant.
    const totalHT = 10000;
    expect(textArg(`${fmtNum(totalHT)} FCFA`)).toBeDefined();
    expect(textArg(`${fmtNum(totalHT * TVA_RATE)} FCFA`)).toBeDefined();
    expect(textArg(`${fmtNum(totalHT * (1 + TVA_RATE))} FCFA`)).toBeDefined();
  });

  it("additionne correctement la TVA et le TTC sur plusieurs articles (3+)", async () => {
    const user = userEvent.setup();
    const articles = [
      article({ description: "A", quantite: 1, prixUnitaire: 12345, total: 12345 }),
      article({ description: "B", quantite: 4, prixUnitaire: 2500, total: 10000 }),
      article({ description: "C", quantite: 1, prixUnitaire: 777, total: 777 }),
    ];
    const fact = facture({ articles });

    render(<FacturePDF facture={fact} />);
    await user.click(screen.getByTitle("Télécharger PDF"));
    await waitFor(() => expect(saveMock).toHaveBeenCalled());

    const totalHT = articles.reduce((s, a) => s + a.total, 0);
    const totalTVA = totalHT * TVA_RATE;
    const totalTTC = totalHT * (1 + TVA_RATE);

    expect(textArg(`${fmtNum(totalHT)} FCFA`)).toBeDefined();
    expect(textArg(`${fmtNum(totalTVA)} FCFA`)).toBeDefined();
    expect(textArg(`${fmtNum(totalTTC)} FCFA`)).toBeDefined();
  });
});
