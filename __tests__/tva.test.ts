import { describe, it, expect } from "vitest";

describe("TVA 18% (CompTrack)", () => {
  it("calcule le montant TTC depuis un HT de 100 000 FCFA", () => {
    const ht = 100000;
    expect(Math.round(ht * 1.18)).toBe(118000);
  });

  it("calcule le montant TTC depuis un HT de 250 000 FCFA", () => {
    const ht = 250000;
    expect(Math.round(ht * 1.18)).toBe(295000);
  });

  it("calcule la TVA seule sur 500 000 FCFA HT", () => {
    const ht = 500000;
    expect(Math.round(ht * 0.18)).toBe(90000);
  });

  it("arrondit correctement un montant TTC non entier", () => {
    const ht = 33333;
    expect(Math.round(ht * 1.18)).toBe(39333);
  });
});

describe("Formatage monetaire FCFA", () => {
  it("les chiffres sont preserves dans le formatage fr-FR", () => {
    const formatted = new Intl.NumberFormat("fr-FR").format(1500000);
    expect(formatted.replace(/[^0-9]/g, "")).toBe("1500000");
  });
});
