# CompTrack — Lovable Protocol

## Vision
CompTrack est le logiciel de comptabilité B2B cloud conçu spécifiquement pour les PMEs africaines. Il couvre la gestion complète des clients, fournisseurs, factures, dépenses et prévisions financières — sans formation comptable avancée, conforme aux normes SYSCOHADA, en FCFA.

## URL de production
https://comptrack.vercel.app

## Utilisateurs cibles
- **Persona 1 — Seydou, Dirigeant PME import-export (Ouagadougou, 15 employés)** : Pas de DAF interne. Besoin : voir sa trésorerie en temps réel, envoyer des factures professionnelles, préparer les bilans pour les banques.
- **Persona 2 — Awa, Comptable (PME agroalimentaire, Abidjan)** : Utilise Excel. Besoin : centraliser revenus/dépenses, relances automatiques clients, exports rapports pour l'expert-comptable.
- **Persona 3 — Ibrahim, DAF (entreprise BTP, Dakar, 80 employés)** : Besoin : prévisions trésorerie, suivi objectifs financiers par trimestre, rapports SYSCOHADA.

## Fonctionnalités core
### P0 (MVP live)
- Dashboard financier (trésorerie, revenus/dépenses du mois, alertes retards)
- Gestion portefeuille clients (fiches, historique, encours facturation)
- Carnet fournisseurs (contacts, conditions paiement, historique achats)
- Création et suivi factures (statuts, relances automatiques)
- Journal revenus (catégorisation, graphiques évolution)
- Suivi dépenses (catégories, justificatifs, validation)
- Définition et suivi objectifs financiers par période
- Prévisions trésorerie et projections intelligentes
- Rapports comptables (bilan, compte de résultat, flux de trésorerie)
- Centre notifications (factures en retard, seuils atteints, échéances)

### P1 (prochaine itération)
- Auth Supabase multi-rôles (Dirigeant / Comptable / Auditeur)
- Envoi factures par email direct depuis l'app (Resend API)
- Conformité SYSCOHADA (plan comptable OHADA intégré)
- Réconciliation bancaire automatique (import relevés CSV/OFX)
- Relances automatiques clients (J+15, J+30, J+60)

### P2 (roadmap)
- Application mobile pour saisie dépenses terrain (photos justificatifs)
- Intégration Mobile Money (Orange Money, Moov, Wave) pour paiements
- Module paie simplifié (déclarations CNSS Burkina)
- Multi-devises (FCFA, EUR, USD) avec taux de change temps réel
- API ouverte pour intégration ERP tiers (TAAMA)

## Design System
- **Couleurs** : Navy `#0A1628` (fond principal), Gold `#D4AF37` (accents, CTA), Cyan `#00BCD4` (highlights, statuts)
- **Typographie** : Inter (corps), Geist (monospace/chiffres)
- **Animations** : Framer Motion (fadeInUp, hoverScale)
- **Icônes** : Lucide React

## Stack Technique
- **Frontend** : Next.js 15 (App Router), React 19, TypeScript
- **Styles** : Tailwind CSS v3
- **Animations** : Framer Motion v12
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **Charts** : Recharts
- **Tests** : Vitest + Testing Library
- **Déploiement** : Vercel

## Modèle de données

### Table `companies`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| name | text | Nom PME |
| country | text | Pays (BF, CI, SN...) |
| currency | text | FCFA par défaut |
| syscohada_plan | boolean | Conformité OHADA |

### Table `invoices`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| client_id | uuid | FK clients |
| amount | numeric | Montant HT |
| tax | numeric | TVA |
| status | enum | brouillon / envoyée / payée / en_retard |
| due_date | date | Échéance |
| sent_at | timestamp | Date envoi |

### Table `transactions`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| type | enum | revenu / dépense |
| category | text | Catégorie comptable |
| amount | numeric | Montant FCFA |
| date | date | Date transaction |
| description | text | Libellé |

### Table `financial_goals`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| name | text | Nom objectif |
| target_amount | numeric | Montant cible |
| current_amount | numeric | Réalisé |
| period | text | Q1 2025, Annuel 2025... |
| deadline | date | Échéance |

## Flux utilisateur clé — Envoi facture et suivi paiement

1. Dirigeant PME se connecte → Dashboard affiche trésorerie et factures en retard
2. Clique `/factures` → "Nouvelle facture"
3. Sélectionne client, ajoute lignes (prestation, quantité, prix unitaire FCFA)
4. Aperçu de la facture → clique "Envoyer" → email client + statut "Envoyée"
5. J+15 : relance automatique si non payée → notification dirigeant
6. Client paie → marquer "Payée" → revenu automatiquement enregistré dans `/revenus`
7. Fin de mois : `/rapports` → export bilan mensuel pour expert-comptable

## Critères de succès
- Dashboard financier charge en < 2 secondes
- Création facture complète en < 3 minutes (UX guidée)
- Rapports conformes SYSCOHADA (plan comptable OHADA)
- Zéro erreur `npm run build` (TypeScript strict, ESLint)
- Tests Vitest couvrent les calculs financiers critiques
- Compatible mobile (dirigeants accèdent depuis smartphone)
- Score Lighthouse Performance > 85 sur Vercel

---
*Lovable Protocol v1.0 — FORGE Afrika © 2025 — Steeve Donald Compaore*
