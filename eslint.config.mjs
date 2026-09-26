import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * Next 15 : `eslint-config-next` n'expose pas encore ses configs en flat natif,
 * elles passent donc par FlatCompat. À la montée en Next 16, remplacer ce bloc
 * par des imports directs de `eslint-config-next/core-web-vitals` et
 * `eslint-config-next/typescript` — FlatCompat y produit une structure
 * circulaire qui fait planter ESLint.
 */
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
