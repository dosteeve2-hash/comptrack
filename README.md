# CompTrack

<div align="center">

![CompTrack Banner](https://img.shields.io/badge/CompTrack-La_comptabilité_africaine-22c55e?style=for-the-badge&labelColor=0d1117)

**La comptabilité simple pour les entreprises africaines**

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![License MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![FORGE Afrika](https://img.shields.io/badge/FORGE_Afrika-Produit-22c55e?style=flat-square)](https://github.com/dosteeve2-hash)

</div>

---

## Pourquoi CompTrack ?

Les TPE/PME africaines gèrent encore leurs finances dans des **cahiers** ou des **fichiers Excel désordonnés**. Les solutions existantes (Sage, QuickBooks) coûtent cher, sont en anglais, et ne correspondent pas aux réalités locales.

**CompTrack** est né pour combler ce vide :
- ✅ 100% en français
- ✅ Montants en FCFA et autres devises africaines
- ✅ Interface simple — aucune formation comptable requise
- ✅ Offline-first — fonctionne sans connexion internet
- ✅ Gratuit pour commencer

---

## Fonctionnalités MVP

| Fonctionnalité | Description |
|---|---|
| **Tableau de bord** | KPIs en temps réel : solde, revenus, dépenses, bénéfice net |
| **Transactions** | Enregistrement rapide avec catégories personnalisables |
| **Rapports** | Graphiques mensuels, trimestriels et annuels |
| **Clients & Fournisseurs** | Carnet d'adresses avec historique |
| **Factures** | Création et export PDF en 30 secondes |
| **Paramètres** | Catégories personnalisées, profil entreprise |

---

## Stack technique

```
Frontend   : Next.js 15 (App Router) + TypeScript strict
Styling    : Tailwind CSS v3 + design system CompTrack
Charts     : Recharts
Icons      : Lucide React
Backend    : Supabase (Auth + PostgreSQL + Storage)
Deploy     : Vercel
```

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/dosteeve2-hash/comptrack.git
cd comptrack

# Installer les dépendances
npm install

# Variables d'environnement (copier et compléter)
cp .env.example .env.local

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Pour le MVP, CompTrack fonctionne sans Supabase avec des données locales.

---

## Structure du projet

```
comptrack/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── connexion/page.tsx      # Connexion
│   │   └── inscription/page.tsx   # Inscription
│   └── (dashboard)/
│       ├── layout.tsx              # Sidebar navigation
│       ├── dashboard/page.tsx      # KPIs + graphiques
│       ├── transactions/page.tsx   # Liste + formulaire
│       ├── rapports/page.tsx       # Rapports et analyses
│       ├── clients/page.tsx        # Carnet clients
│       ├── factures/page.tsx       # Factures PDF
│       └── parametres/page.tsx    # Paramètres
├── lib/
│   ├── data.ts                     # Données et types
│   └── utils.ts                    # Utilitaires
└── ...
```

---

## Design System CompTrack

| Token | Couleur | Usage |
|---|---|---|
| `--green` | `#22c55e` | Revenus, croissance, CTAs |
| `--blue` | `#3b82f6` | Actions, liens, confiance |
| `--red` | `#ef4444` | Dépenses, alertes |
| `--amber` | `#f59e0b` | En attente, neutre |
| `--bg` | `#0d1117` | Fond principal |

---

## Roadmap

- [ ] Intégration Supabase complète (Auth + DB)
- [ ] Mode offline avec sync automatique
- [ ] Export Excel des transactions
- [ ] Multi-devises (FCFA, GHS, NGN, KES)
- [ ] Application mobile (React Native)
- [ ] Intégration paiement mobile money (Orange, MTN)
- [ ] API pour intégration ERP

---

## Contexte — FORGE Afrika

CompTrack fait partie de l'écosystème **FORGE Afrika** — une famille de produits tech conçus pour les entreprises et entrepreneurs africains.

> **Vision** : Des logiciels simples, puissants, adaptés aux réalités africaines — pour que chaque entrepreneur du continent puisse gérer son business comme une entreprise mondiale.

---

## Auteur

**Steve Donald Compaoré** — Étudiant en Software Engineering, Université GOP Tokat, Turquie.

- 🌍 Burkina Faso / Turquie
- 🐙 [@dosteeve2-hash](https://github.com/dosteeve2-hash)
- 💼 [Portfolio](https://steeve-portfolio-mocha.vercel.app)

---

<div align="center">

Si ce projet vous inspire, laissez une ⭐ — **Fait avec ❤️ depuis Ouagadougou et Istanbul**

</div>
