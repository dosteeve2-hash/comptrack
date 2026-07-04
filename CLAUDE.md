# CompTrack — Guide développement

## Contexte

CompTrack = comptabilité simplifiée pour TPE/PME africaines.
Produit de **FORGE Afrika** — même écosystème que TAAMA et les autres apps SDC.

Repo : `dosteeve2-hash/comptrack`
Deploy : https://comptrack.vercel.app (à déployer)

---

## Stack

```
Frontend  : Next.js 15 (App Router) + TypeScript strict
Styling   : Tailwind CSS v3
Charts    : Recharts (avec 'use client' + mounted pattern)
Icons     : Lucide React
Auth/DB   : Supabase SSR (MVP = données locales)
Deploy    : Vercel
```

---

## Design System

| Token CSS | Hex | Usage |
|---|---|---|
| `--green` | `#22c55e` | Revenus, croissance, CTAs primaires |
| `--green2` | `#16a34a` | Green hover/foncé |
| `--blue` | `#3b82f6` | Actions secondaires, liens |
| `--red` | `#ef4444` | Dépenses, erreurs, alertes |
| `--amber` | `#f59e0b` | En attente, neutre |
| `--bg` | `#0d1117` | Fond principal |
| `--bg2` | `#161b22` | Cards, sidebar |
| `--bg3` | `#1c2333` | Inputs, nested cards |
| `--border` | `#21262d` | Bordures légères |
| `--border2` | `#30363d` | Bordures normales |
| `--text` | `#e6edf3` | Texte principal |
| `--text2` | `#8b949e` | Texte secondaire |
| `--text3` | `#4e5f82` | Placeholders |

Tailwind prefix : `ct-` (ex: `bg-ct-bg`, `text-ct-text2`)

---

## Règles impératives

### Auth & Supabase
- `getUser()` → **jamais** `getSession()` (sécurité)
- RLS activé sur toutes les tables
- Validation Zod côté serveur sur tous les inputs

### Code
- TypeScript strict — zéro `any`, zéro `@ts-ignore`
- `npm run build` → 0 erreur avant tout push
- Server Components par défaut, `'use client'` seulement si nécessaire
- Recharts : toujours utiliser le pattern `mounted` (useEffect + useState)

### Montants
- Toujours en **FCFA** par défaut
- Formatage via `formatMontant()` de `lib/utils.ts`
- Jamais hardcoder "F CFA" ou "XOF" directement

---

## Structure pages

```
/                    → Landing page (server component)
/connexion           → Auth login (client)
/inscription         → Auth register (client)
/dashboard           → KPIs + charts (client - recharts)
/transactions        → Liste + modal ajout (client - useState)
/rapports            → Graphiques (client - recharts)
/clients             → Carnet clients (client - useState)
/factures            → Factures + PDF print (client)
/parametres          → Settings (client - useState)
```

---

## Données

Fichier `lib/data.ts` — données mock pour le MVP.
Types exportés : `Transaction`, `Client`, `Facture`, `FactureArticle`, `Categorie`, `DonneesMensuelles`

Pour migrer vers Supabase : remplacer les imports `from '@/lib/data'` par des appels Supabase SSR.

---

## PDF / Impression

Les factures utilisent `window.print()` avec la classe `.no-print` pour masquer l'UI.
CSS print dans `globals.css` : `.print-facture` force fond blanc + texte noir.

---

## Commandes

```bash
npm run dev      # Développement local
npm run build    # Build production (doit passer 0 erreur)
npm run lint     # Lint ESLint
```

---

*Dernière mise à jour : 2026-06-27*
*Maintenu par Steeve Donald Compaoré*
