import { describe, it, expect } from "vitest";
import { formatMontant, formatDate, calcVariation } from "../lib/utils";

describe("formatMontant()", () => {
  it("formate 1 500 000 en FCFA", () => {
    // normalise les espaces (U+202F → espace normale)
    const result = formatMontant(1_500_000).replace(/ /g, " ");
    expect(result).toBe("1 500 000 FCFA");
  });

  it("formate 0 FCFA", () => {
    expect(formatMontant(0)).toBe("0 FCFA");
  });

  it("formate un montant négatif et contient FCFA", () => {
    const result = formatMontant(-50_000);
    expect(result).toContain("FCFA");
    expect(result).toContain("-");
  });

  it("ne contient pas de décimales", () => {
    const result = formatMontant(12345.99);
    expect(result).not.toMatch(/[.,]\d{2}/);
  });
});

describe("formatDate()", () => {
  it("retourne une chaîne contenant l'année", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("2024");
  });

  it("retourne une chaîne contenant le jour", () => {
    expect(formatDate("2025-06-01")).toContain("01");
  });

  it("retourne une valeur non vide pour toute date valide", () => {
    expect(formatDate("2025-12-31")).toBeTruthy();
  });
});

describe("calcVariation()", () => {
  it("calcule +100% quand le montant double", () => {
    expect(calcVariation(2000, 1000)).toBe(100);
  });

  it("calcule -50% quand le montant est divisé par 2", () => {
    expect(calcVariation(500, 1000)).toBe(-50);
  });

  it("retourne 0 quand le précédent est 0 (pas de division par zéro)", () => {
    expect(calcVariation(999, 0)).toBe(0);
  });

  it("retourne 0 quand les montants sont identiques", () => {
    expect(calcVariation(1000, 1000)).toBe(0);
  });

  it("arrondit à l'entier le plus proche", () => {
    // (1100 - 1000) / 1000 * 100 = 10 exact
    expect(calcVariation(1100, 1000)).toBe(10);
  });
});
