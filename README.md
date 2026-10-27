<p align="center"><img src="public/brand/mark.svg" alt="CompTrack" width="72" height="72"></p>

<h1 align="center">📊 CompTrack</h1>

> Aperçu en développement : un logiciel de comptabilité simple pour les PMEs africaines, avec un plan comptable SYSCOHADA simplifié. Pas de certification de conformité.

![Statut](https://img.shields.io/badge/statut-aper%C3%A7u%20en%20d%C3%A9veloppement-blue?style=for-the-badge&color=0A1628)
![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
[![Demo](https://img.shields.io/badge/Demo-Voir%20live-D4AF37?style=for-the-badge)](https://comptrack-chi.vercel.app)

**[📄 PRD](./PRD.md)**

## 🌍 Aperçu en ligne

**Aperçu (démonstration) :** https://comptrack-chi.vercel.app

> Les données saisies restent dans le navigateur (localStorage) ; aucune base de données ni client réel derrière l'aperçu. La facturation de l'abonnement n'est pas activée.

---

## 🎯 Problème résolu

Les PMEs africaines n'ont pas accès à des logiciels comptables adaptés à leur contexte : les solutions occidentales sont trop complexes, trop chères et non conformes aux normes locales (SYSCOHADA). Résultat (constat de départ) : comptabilité approximative, impossibilité d'obtenir des financements, décisions stratégiques prises à l'aveugle.

## 💡 Solution

CompTrack est un logiciel de comptabilité pour PMEs africaines, en développement. L'aperçu permet de saisir clients, fournisseurs, factures, dépenses et revenus, avec des tableaux de bord, des projections de trésorerie par scénarios (calcul simple à partir de l'historique saisi, sans IA) et des exports. Il n'est pas certifié conforme SYSCOHADA : le plan comptable est une version simplifiée.

**Cible :** Dirigeants de PMEs, comptables et DAF d'entreprises africaines de 5 à 200 employés.

---

## 🖥️ Pages & Fonctionnalités

Toutes les pages ci-dessous existent dans l'aperçu ; les données sont stockées localement dans le navigateur.

| Page | Description |
|------|-------------|
| `/` — Dashboard | Synthèse financière : trésorerie, revenus/dépenses du mois, alertes |
| `/clients` | Gestion du portefeuille clients — fiches, historique, encours de facturation |
| `/fournisseurs` | Carnet fournisseurs — contacts, conditions de paiement, historique achats |
| `/factures` | Création et suivi des factures — statuts, export PDF ; pas d'envoi ni de relances automatiques |
| `/revenus` | Journal des revenus — catégorisation, graphiques d'évolution |
| `/depenses` | Suivi des dépenses — catégories (pas de dépôt de justificatifs) |
| `/objectifs` | Définition et suivi d'objectifs financiers par période |
| `/previsions` | Projections de trésorerie par scénarios, calculées à partir de l'historique saisi |
| `/rapports` | Rapports : aperçu, bilan et compte de résultat simplifiés |
| `/notifications` | Centre d'alertes : factures en retard, échéances |

S'ajoutent d'autres écrans d'aperçu : transactions, trésorerie, budgets, bilan, paie, employés, contrats, déclarations, vente rapide, apprendre (voir `app/(dashboard)/`).

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Styles | Tailwind CSS |
| Animations | Framer Motion |
| Données | localStorage (navigateur) ; migration vers Supabase prévue |
| Authentification | Supabase Auth (si configuré sur le déploiement) |
| Monitoring | Sentry |
| Déploiement | Vercel |
| Graphiques / PDF | Recharts, jsPDF |

**Charte graphique :** Navy `#0A1628` · Gold `#D4AF37` · Cyan `#00BCD4`

---

## 🚀 Installation

```bash
git clone https://github.com/dosteeve2-hash/comptrack.git
cd comptrack
npm install
cp .env.local.example .env.local
```

Pour activer la connexion, ajouter dans `.env.local` (sans elles, l'aperçu fonctionne sans compte) :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

`.env.local.example` ne contient que les variables Sentry (`NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`).

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Structure du Projet

```
comptrack/
├── app/
│   ├── (auth)/          # connexion, inscription
│   ├── (dashboard)/     # clients, factures, transactions, rapports, ...
│   ├── tarifs/          # tarifs prévus (facturation non activée)
│   └── layout.tsx
├── components/          # composants partagés et public/
├── lib/                 # store (localStorage), data, export, supabase/
├── supabase/migrations/
├── specs/
└── public/
```

---

## 🌍 Partie de l'écosystème FORGE Afrika

CompTrack est un produit de **[FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika)** — la forge technologique panafricaine qui construit les outils numériques de la prochaine génération d'entrepreneurs africains.

> *Forger l'Afrique de demain, un produit à la fois.*

**Autres produits de l'écosystème :**
- 🏭 [MillTrack](https://github.com/dosteeve2-hash/milltrack) — suivi de production et traçabilité des usines de transformation (TAAMA en est devenu le module Qualité)
- 🌱 [FORJA](https://github.com/dosteeve2-hash/forja) — Plateforme SaaS d'exportation de café burkinabè
- 🛍️ [MIFA Life](https://github.com/dosteeve2-hash/Mifa_Life_shop) — Marketplace de produits locaux africains

---

## 📬 Contact

**Steve Donald Compaore** — Fondateur, FORGE Afrika

📧 [docompaore2@gmail.com](mailto:docompaore2@gmail.com)
🐙 [github.com/dosteeve2-hash](https://github.com/dosteeve2-hash)

---

<div align="center">
  <sub>Construit avec ❤️ au Burkina Faso · FORGE Afrika © 2025</sub>
</div>
