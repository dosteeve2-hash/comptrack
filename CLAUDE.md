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

---

## Déploiement

**URL production :** https://comptrack-chi.vercel.app

**Plateforme :** Vercel (projet `comptrack`, org `dosteeve2-8163s-projects`)
**Repo :** https://github.com/dosteeve2-hash/comptrack

### Variables d'environnement à configurer sur vercel.com

Dans Settings → Environment Variables du projet Vercel :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de ton projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anon de Supabase |

Sans ces variables, l'auth Supabase ne fonctionnera pas en prod.
Le code gère l'absence avec des valeurs placeholder pour que le build passe.

---

*Dernière mise à jour : 2026-07-08*
*Maintenu par Steeve Donald Compaoré*

---

## Karpathy Guidelines — Comportement Claude Code

Dérivé des observations d'Andrej Karpathy sur les pièges des agents de coding IA.

**Biais : prudence plutôt que vitesse. Pour les tâches triviales, utilise le jugement.**

### 1. Réfléchis avant de coder

**Ne suppose pas. Ne cache pas ta confusion. Expose les compromis.**

Avant d'implémenter :
- Énonce tes hypothèses explicitement. En cas de doute, pose la question.
- Si plusieurs interprétations existent, présente-les — ne choisis pas silencieusement.
- Si une approche plus simple existe, dis-le. Pousse en arrière si nécessaire.
- Si quelque chose n'est pas clair, arrête-toi. Nomme ce qui est confus. Pose la question.

### 2. Simplicité d'abord

**Code minimal qui résout le problème. Rien de spéculatif.**

- Pas de fonctionnalités au-delà de ce qui a été demandé.
- Pas d'abstractions pour du code à usage unique.
- Pas de "flexibilité" ou "configurabilité" non demandées.
- Pas de gestion d'erreurs pour des scénarios impossibles.
- Si tu écris 200 lignes et que 50 suffiraient, réécris-le.

Demande-toi : "Un ingénieur senior dirait-il que c'est trop compliqué ?" Si oui, simplifie.

### 3. Modifications chirurgicales

**Touche seulement ce qui est nécessaire. Nettoie uniquement ton propre désordre.**

En éditant du code existant :
- Ne "améliore" pas le code adjacent, les commentaires, ou le formatage.
- Ne refactorise pas ce qui n'est pas cassé.
- Correspond au style existant, même si tu ferais autrement.
- Si tu remarques du code mort non lié, mentionne-le — ne le supprime pas.

Quand tes changements créent des orphelins :
- Supprime les imports/variables/fonctions que TES changements ont rendus inutilisés.
- Ne supprime pas le code mort préexistant sauf si demandé.

Le test : chaque ligne modifiée doit tracer directement à la demande de l'utilisateur.

### 4. Exécution orientée objectif

**Définis des critères de succès. Boucle jusqu'à vérification.**

Transforme les tâches en objectifs vérifiables :
- "Ajouter une validation" → "Écrire des tests pour les entrées invalides, puis les faire passer"
- "Corriger le bug" → "Écrire un test qui le reproduit, puis le faire passer"
- "Refactoriser X" → "S'assurer que les tests passent avant et après"

Pour les tâches multi-étapes, énonce un plan bref :
```
1. [Étape] → vérifier : [check]
2. [Étape] → vérifier : [check]
3. [Étape] → vérifier : [check]
```

**Ces guidelines fonctionnent si :** moins de changements inutiles dans les diffs, moins de réécritures dues à la surcomplication, et les questions de clarification viennent avant l'implémentation plutôt qu'après les erreurs.

## Principes Karpathy

> Andrej Karpathy (ex-Tesla AI / OpenAI) sur comment coder avec l'IA.

### 1. Reflechis avant de coder
Ne genere pas de code immediatement. Quel est le vrai probleme ? Quelle est la solution la plus simple ?

### 2. Simplicite d'abord
Le meilleur code est celui qui n'existe pas. Prefere 50 lignes claires a 200 lignes "intelligentes".

### 3. Modifications chirurgicales
Ne reecris pas ce qui fonctionne. Identifie le changement minimal qui resout le probleme.

### 4. Execution orientee objectif
Garde l'objectif final en vue. Livre quelque chose qui fonctionne, ameliore ensuite.

## Regles IA -- Securite

### Rate Limiting endpoints IA
Tout endpoint touchant Anthropic/OpenAI doit avoir un rate limit.
Max 20 requetes/utilisateur/heure.

### Protection injection de prompt
Ne jamais concatener l'input utilisateur dans un system prompt.
Utiliser des delimiteurs XML : <user_input>${userText}</user_input>

### Variables d'environnement
- .env.local JAMAIS commite (dans .gitignore)
- SUPABASE_SERVICE_ROLE_KEY : chiffre dans Vercel, jamais dans le code

### Authentification Supabase
- getUser() TOUJOURS cote serveur
- getSession() JAMAIS cote serveur
- Valider l'utilisateur dans chaque Server Action
