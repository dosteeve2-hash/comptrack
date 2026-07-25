# 📊 CompTrack

> La comptabilité B2B pensée pour les PMEs africaines — simple, fiable, conforme.

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge&color=0A1628)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**[📄 PRD](./PRD.md)**

---

## 🎯 Problème résolu

Les PMEs africaines n'ont pas accès à des logiciels comptables adaptés à leur contexte : les solutions occidentales sont trop complexes, trop chères et non conformes aux normes locales (SYSCOHADA). Résultat : comptabilité approximative, impossibilité d'obtenir des financements, décisions stratégiques prises à l'aveugle.

## 💡 Solution

CompTrack est un logiciel de comptabilité B2B cloud conçu pour les PMEs africaines. Il couvre la gestion complète des clients, fournisseurs, factures, dépenses et revenus, avec des tableaux de bord financiers clairs, des prévisions intelligentes et des rapports exportables — sans nécessiter de formation comptable avancée.

**Cible :** Dirigeants de PMEs, comptables et DAF d'entreprises africaines de 5 à 200 employés.

---

## 🖥️ Pages & Fonctionnalités

| Page | Description |
|------|-------------|
| `/` — Dashboard | Synthèse financière : trésorerie, revenus/dépenses du mois, alertes |
| `/clients` | Gestion du portefeuille clients — fiches, historique, encours de facturation |
| `/fournisseurs` | Carnet fournisseurs — contacts, conditions de paiement, historique achats |
| `/factures` | Création, envoi et suivi des factures — statuts, relances automatiques |
| `/revenus` | Journal des revenus — catégorisation, graphiques d'évolution |
| `/depenses` | Suivi des dépenses — catégories, justificatifs, validation |
| `/objectifs` | Définition et suivi d'objectifs financiers par période |
| `/previsions` | Prévisions de trésorerie et projections financières intelligentes |
| `/rapports` | Génération de rapports comptables (bilan, compte de résultat, flux) |
| `/notifications` | Centre d'alertes : factures en retard, seuils atteints, échéances |

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Styles | Tailwind CSS |
| Animations | Framer Motion |
| Base de données | Supabase (PostgreSQL + Auth + Storage) |
| Déploiement | Vercel |
| UI Components | shadcn/ui |

**Charte graphique :** Navy `#0A1628` · Gold `#D4AF37` · Cyan `#00BCD4`

---

## 🚀 Installation

```bash
git clone https://github.com/dosteeve2-hash/comptrack.git
cd comptrack
npm install
cp .env.example .env.local
```

Configure les variables dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Structure du Projet

```
comptrack/
├── app/
│   ├── (dashboard)/
│   │   ├── clients/
│   │   ├── fournisseurs/
│   │   ├── factures/
│   │   ├── revenus/
│   │   ├── depenses/
│   │   ├── objectifs/
│   │   ├── previsions/
│   │   ├── rapports/
│   │   └── notifications/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── finance/
│   └── shared/
├── lib/
│   ├── supabase/
│   └── utils/
├── public/
└── types/
```

---

## 🌍 Partie de l'écosystème FORGE Afrika

CompTrack est un produit de **[FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika)** — la forge technologique panafricaine qui construit les outils numériques de la prochaine génération d'entrepreneurs africains.

> *Forger l'Afrique de demain, un produit à la fois.*

**Autres produits de l'écosystème :**
- 🏭 [TAAMA](https://github.com/dosteeve2-hash/taama) — ERP industriel pour PMEs de transformation
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
