# PRD — CompTrack

## Résumé exécutif
CompTrack est un logiciel de comptabilité B2B cloud pour les PME et entrepreneurs formels africains. Il remplace les tableurs Excel par un outil métier complet : clients, fournisseurs, factures, dépenses, revenus, budgets, objectifs, prévisions et rapports — conforme aux normes comptables locales (SYSCOHADA) et natif FCFA.

## Motivation originale
> "Logiciel de comptabilité africain. Pour les PME, les entrepreneurs formels. KPIs financiers, revenus, dépenses, objectifs, factures, clients, fournisseurs. Remplacer les tableurs Excel par un vrai outil métier."
> — Steeve Donald Compaoré

## Vision et ambition
CompTrack est le produit "Finance" de l'écosystème FORGE Afrika (statut "Actif" dans `forge-afrika/lib/constants.ts`). Il répond directement au problème n°4 identifié dans `forge-afrika/VISION.md` : l'accès au financement bloqué pour les PME africaines faute de données financières historiques fiables — un logiciel de comptabilité qui produit des états financiers structurés augmente drastiquement l'accès au crédit. À terme, CompTrack doit s'intégrer avec TAAMA (production) et MIFA Life (ventes) pour former la "suite intégrée" visée en Phase 2 de la roadmap FORGE Afrika : les données de production et de vente alimentent automatiquement la comptabilité.

## Problème résolu
Les PME africaines n'ont pas accès à des logiciels comptables adaptés à leur contexte : les solutions occidentales (SAP, Oracle) sont trop complexes, trop chères et non conformes aux normes locales (SYSCOHADA). Résultat : comptabilité approximative, impossibilité d'obtenir des financements bancaires, décisions stratégiques prises à l'aveugle.

## Utilisateurs cibles
Dirigeants de PME, comptables et DAF d'entreprises africaines de 5 à 200 employés — entrepreneurs formels (par opposition au secteur informel ciblé par SUGU).

## Fonctionnalités clés (MVP)
Construites (routes réelles dans `app/`) :
- **Landing page** (`app/page.tsx`, server component).
- **Auth** (`(auth)/connexion`, `(auth)/inscription`, `app/auth/callback`) — Supabase Auth.
- **Onboarding** (`(dashboard)/onboarding`) — configuration initiale du compte entreprise.
- **Dashboard** (`(dashboard)/dashboard`) — synthèse financière, trésorerie, KPIs (Recharts, pattern `mounted`).
- **Transactions** (`(dashboard)/transactions`) — liste et ajout via modal.
- **Clients** (`(dashboard)/clients`) — portefeuille clients, historique, encours de facturation.
- **Fournisseurs** (`(dashboard)/fournisseurs`) — carnet fournisseurs, conditions de paiement.
- **Factures** (`(dashboard)/factures`) — création, statuts, impression PDF via `window.print()` (classe `.no-print`, CSS `.print-facture` fond blanc/texte noir).
- **Revenus** (`(dashboard)/revenus`) — journal des revenus, catégorisation, graphiques.
- **Dépenses** (`(dashboard)/depenses`) — suivi par catégorie, justificatifs.
- **Budgets** (`(dashboard)/budgets`) — gestion budgétaire.
- **Objectifs** (`(dashboard)/objectifs`) — définition et suivi d'objectifs financiers par période.
- **Rapports** (`(dashboard)/rapports`) — rapports comptables (bilan, compte de résultat, flux).
- **Notifications** (`(dashboard)/notifications`) — alertes factures en retard, seuils, échéances.
- **Apprendre** (`(dashboard)/apprendre`) — contenu pédagogique pour utilisateurs non-experts comptables.
- **Tarifs** (`app/tarifs`) — plans d'abonnement.
- **Paramètres** (`(dashboard)/parametres`).

## Stack technique
```
Frontend     Next.js 15 (App Router) + TypeScript strict (0 any, 0 @ts-ignore)
Styling      Tailwind CSS v3 (préfixe utilitaire ct-, ex: bg-ct-bg, text-ct-text2)
Charts       Recharts (pattern mounted via useEffect + useState)
Icons        Lucide React
Auth/DB      Supabase SSR — getUser() jamais getSession(), MVP en données mock (lib/data.ts)
Validation   Zod côté serveur sur tous les inputs
Déploiement  Vercel (comptrack-chi.vercel.app)
```
Design system : vert `#22c55e` (revenus/croissance), bleu `#3b82f6` (actions secondaires), rouge `#ef4444` (dépenses/erreurs), ambre `#f59e0b` (en attente), fond `#0d1117`.

## Intégration écosystème FORGE Afrika
CompTrack est le maillon comptabilité du flux de données FORGE Afrika : *BurkinaCollect/AgroTrack → TAAMA/MillTrack → **CompTrack** (bilans SYSCOHADA, export fiscal multi-devises FCFA)*. Objectif Phase 2 de la roadmap groupe : une suite intégrée TAAMA + CompTrack + MIFA Life où les flux de production et de vente alimentent directement la comptabilité, sans ressaisie.

## Feuille de route
### Phase 1 — MVP (actuel)
Toutes les pages listées ci-dessus sont construites avec des données mock (`lib/data.ts` — types `Transaction`, `Client`, `Facture`, `FactureArticle`, `Categorie`, `DonneesMensuelles`). L'auth Supabase existe mais les données métier ne sont pas encore branchées sur la base.

### Phase 2 — Croissance
Migration complète de `lib/data.ts` vers Supabase (RLS activé sur toutes les tables) ; intégration réelle avec TAAMA et MIFA Life pour l'alimentation automatique des revenus/dépenses ; conformité SYSCOHADA vérifiée sur les rapports générés.

### Phase 3 — Scale
Génération d'états financiers exploitables pour les demandes de financement bancaire ; export fiscal multi-pays CEDEAO ; module d'apprentissage comptable étoffé pour les dirigeants non-formés en comptabilité.

## Métriques de succès
- Nombre de PME clientes actives, transactions et CA transitant par la plateforme (métriques déjà consolidées dans `forge-afrika/lib/constants.ts`).
- Taux de migration des données mock vers Supabase (indicateur de maturité technique).
- Nombre de rapports/bilans générés utilisés effectivement pour des demandes de financement.

## Contraintes et décisions clés
- **Montants toujours en FCFA**, formatés via `formatMontant()` de `lib/utils.ts` — jamais de "F CFA" ou "XOF" hardcodé.
- **`getUser()` toujours, `getSession()` jamais** côté serveur.
- **Validation Zod obligatoire côté serveur** sur tous les inputs.
- **`npm run build` zéro erreur avant tout push.**
- **Le code gère l'absence de variables d'environnement Supabase avec des valeurs placeholder** pour que le build Vercel passe même sans configuration complète — décision explicite pour ne pas bloquer les déploiements de démo.
- **Server Components par défaut**, `'use client'` uniquement si nécessaire (Recharts, formulaires avec état).

---
*PRD rédigé par Claude (COO) sur instruction de Steve Donald Compaore (PDG FORGE Afrika)*
*Dernière mise à jour : 2026-07-25*
