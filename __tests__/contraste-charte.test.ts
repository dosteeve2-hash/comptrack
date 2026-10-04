import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

/**
 * Le défaut que ce test verrouille : `--text3` valait `#4E6F8E`, soit 2,66 : 1 sur
 * `--bg3`, et `--red` valait `#ef4444`, soit 3,73 : 1 sur le même fond. WCAG 2.1 AA
 * exige 4,5 : 1 pour du texte normal — les deux échouaient.
 *
 * Ce ne sont pas des jetons décoratifs dans ce produit : `--text3` porte 65 usages
 * (libellés, mentions légales, sous-titres de KPI) et `--red` 81, dont le message
 * d'erreur du formulaire de connexion. Un message d'erreur qu'on ne lit pas ne sert
 * à rien.
 *
 * La charte SDC laisse les *valeurs* libres par projet depuis le 26/09/2026 ; le
 * seuil, lui, ne l'est pas. Ce test lit donc les jetons dans `globals.css` et refait
 * le calcul, pour qu'un futur changement de palette ne repasse pas sous le seuil en
 * silence.
 */
const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

function jeton(nom: string): string {
  const m = css.match(new RegExp(`--${nom}\\s*:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`jeton --${nom} introuvable dans app/globals.css`);
  return m[1];
}

/** Luminance relative sRGB, telle que la définit WCAG 2.1. */
function luminance(hex: string): number {
  const canal = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(a: string, b: string): number {
  const [clair, sombre] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (clair + 0.05) / (sombre + 0.05);
}

const FONDS = ["bg", "bg2", "bg3"] as const;
const SEUIL_AA = 4.5;

describe("charte CompTrack — contraste WCAG 2.1 AA", () => {
  it.each((["text", "text2", "text3"] as const).flatMap((t) => FONDS.map((f) => [t, f] as const)))(
    "--%s sur --%s atteint 4,5 : 1",
    (texte, fond) => {
      const r = contraste(jeton(texte), jeton(fond));
      expect(r, `--${texte} (${jeton(texte)}) sur --${fond} (${jeton(fond)}) = ${r.toFixed(2)}`)
        .toBeGreaterThanOrEqual(SEUIL_AA);
    },
  );

  // --red porte le message d'erreur de connexion, --green et --amber les états
  // d'une écriture comptable : tous sont du texte à lire, pas de la décoration.
  it.each((["red", "green", "amber"] as const).flatMap((c) => FONDS.map((f) => [c, f] as const)))(
    "--%s reste lisible sur --%s",
    (couleur, fond) => {
      const r = contraste(jeton(couleur), jeton(fond));
      expect(r, `--${couleur} (${jeton(couleur)}) sur --${fond} = ${r.toFixed(2)}`)
        .toBeGreaterThanOrEqual(SEUIL_AA);
    },
  );

  it("le calcul est juste : blanc sur noir vaut 21, une couleur sur elle-même vaut 1", () => {
    expect(contraste("#ffffff", "#000000")).toBeCloseTo(21, 1);
    expect(contraste("#4E6F8E", "#4E6F8E")).toBeCloseTo(1, 5);
  });
});
