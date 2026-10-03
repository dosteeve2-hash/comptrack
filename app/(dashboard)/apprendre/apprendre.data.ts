// app/(dashboard)/apprendre/apprendre.data.ts
import { ArrowLeftRight, FileText, BarChart3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Concept {
  terme: string
  definition: string
  exemple: string
}

export interface MiniCours {
  id: string
  titre: string
  module: string
  etapes: { titre: string; contenu: string }[]
}

export interface TipSection {
  module: string
  icon: LucideIcon
  couleur: string
  astuces: string[]
}

export const concepts: Concept[] = [
  {
    terme: 'Débit',
    definition: 'Entrée dans un compte ou diminution d\'un passif. Dans la comptabilité double-entrée, le débit est toujours à gauche du journal.',
    exemple: 'Vous achetez du stock pour 50 000 FCFA : vous débitez le compte « Stock » (il augmente) et créditez le compte « Banque » (il diminue).',
  },
  {
    terme: 'Crédit',
    definition: 'Sortie d\'un compte actif ou augmentation d\'un passif. Toujours à droite dans le journal comptable.',
    exemple: 'Vous vendez un produit : vous créditez le compte « Ventes » (revenu) et débitez le compte « Banque » (trésorerie augmente).',
  },
  {
    terme: 'Actif',
    definition: 'Tout ce que votre entreprise possède : trésorerie, équipements, stock, créances clients…',
    exemple: 'Trésorerie 4 250 000 FCFA + Stock 800 000 FCFA + Matériel 650 000 FCFA = Actif total 5 700 000 FCFA.',
  },
  {
    terme: 'Passif',
    definition: 'Ce que votre entreprise doit à des tiers (dettes) + les capitaux propres. Toujours égal à l\'Actif.',
    exemple: 'Dettes fournisseurs 180 000 FCFA + Capitaux propres 5 520 000 FCFA = Passif 5 700 000 FCFA.',
  },
  {
    terme: 'Capitaux propres',
    definition: 'La valeur nette de votre entreprise = Actif total − Dettes. C\'est ce que vous auriez s\'il fallait tout rembourser.',
    exemple: 'Si votre actif vaut 5 700 000 FCFA et vos dettes 180 000 FCFA, vos capitaux propres = 5 520 000 FCFA.',
  },
  {
    terme: 'Résultat net',
    definition: 'Bénéfice (ou perte) final après déduction de toutes les charges sur une période donnée.',
    exemple: 'Revenus 1 395 000 − Charges 693 000 = Résultat net 702 000 FCFA pour juin.',
  },
  {
    terme: 'Charges',
    definition: 'Toutes les dépenses engagées pour faire fonctionner votre activité : salaires, loyer, achats, télécoms…',
    exemple: 'Loyer 120 000 + Salaires 250 000 + Stock 180 000 = 550 000 FCFA de charges.',
  },
  {
    terme: 'Produits',
    definition: 'Tous les revenus générés par votre activité : ventes, prestations, commissions…',
    exemple: 'Vente tissus 450 000 + Prestation 320 000 + Formation 195 000 = 965 000 FCFA de produits.',
  },
  {
    terme: 'Créance',
    definition: 'Argent que vos clients vous doivent mais n\'ont pas encore payé (factures émises, non réglées).',
    exemple: 'Vous avez émis la facture FAC-2026-002 de 320 000 FCFA. Elle n\'est pas payée → vous avez une créance de 320 000 FCFA.',
  },
  {
    terme: 'Trésorerie',
    definition: 'L\'argent liquide disponible immédiatement (solde bancaire + caisse). Indicateur vital de santé financière.',
    exemple: 'Solde banque 3 500 000 FCFA + Caisse 750 000 FCFA = Trésorerie 4 250 000 FCFA.',
  },
  {
    terme: 'Amortissement',
    definition: 'Étalement dans le temps du coût d\'un bien durable (matériel, véhicule). Réduit le résultat imposable.',
    exemple: 'Vous achetez un ordinateur à 600 000 FCFA. Sur 3 ans, vous amortissez 200 000 FCFA/an.',
  },
  {
    terme: 'Marge brute',
    definition: 'Revenus − Coût des marchandises vendues. Mesure la rentabilité avant les charges fixes.',
    exemple: 'Ventes 1 395 000 − Achats 180 000 = Marge brute 1 215 000 FCFA (taux : 87%).',
  },
]

export const miniCours: MiniCours[] = [
  {
    id: 'transactions',
    titre: 'Comprendre les transactions',
    module: 'Transactions',
    etapes: [
      { titre: 'Revenu vs Dépense', contenu: 'Un revenu est une entrée d\'argent dans votre entreprise (vente, prestation). Une dépense est une sortie d\'argent (achat, loyer, salaire). Chaque transaction doit être classée dans l\'une de ces deux catégories.' },
      { titre: 'Les catégories', contenu: 'Chaque transaction doit avoir une catégorie (Ventes, Salaires, Loyer…). Bien catégoriser est crucial pour lire vos rapports et identifier où va votre argent.' },
      { titre: 'Le statut de la transaction', contenu: 'Validée : confirmée et comptabilisée. En attente : à vérifier ou à encaisser. Annulée : erreur ou remboursement. Gardez vos transactions à jour pour avoir une image fidèle de votre activité.' },
      { titre: 'La double-entrée', contenu: 'En comptabilité formelle, chaque transaction génère deux écritures : un débit et un crédit d\'égale valeur. Par exemple, une vente de 100 000 FCFA débite la Banque (+) et crédite les Ventes (+). CompTrack gère cela automatiquement en vue journal.' },
    ],
  },
  {
    id: 'factures',
    titre: 'Maîtriser la facturation',
    module: 'Factures',
    etapes: [
      { titre: 'Pourquoi une facture ?', contenu: 'La facture est un document légal qui prouve une vente ou prestation. Elle sécurise votre relation avec le client, vous permet de suivre les paiements et est indispensable pour la comptabilité.' },
      { titre: 'Le cycle de vie d\'une facture', contenu: 'Brouillon → vous la préparez. Envoyée → le client la reçoit. En attente → vous attendez le règlement. Payée → encaissée. En retard → délai dépassé, relancez ! CompTrack avance le statut en 1 clic.' },
      { titre: 'Numérotation séquentielle', contenu: 'Les factures doivent être numérotées sans interruption (FAC-2026-001, 002, 003…). Cela est souvent exigé par la loi pour la conformité fiscale. CompTrack le fait automatiquement.' },
      { titre: 'Quand marquer payée ?', contenu: 'Dès réception du paiement (mobile money, virement, espèces). Marquer payée dans CompTrack crée automatiquement une transaction revenu — votre trésorerie est mise à jour instantanément.' },
    ],
  },
  {
    id: 'rapports',
    titre: 'Lire vos rapports financiers',
    module: 'Rapports',
    etapes: [
      { titre: 'Le tableau de bord vs Rapports', contenu: 'Le dashboard montre le mois en cours en temps réel. Les rapports permettent des analyses sur plusieurs mois, comparaisons et exports. Consultez les rapports au moins 1 fois par mois.' },
      { titre: 'Comprendre le bilan', contenu: 'Le bilan est une photo de votre patrimoine à un instant T. Actif (ce que vous avez) = Passif (ce que vous devez + capitaux propres). Si vos capitaux propres augmentent, votre entreprise prend de la valeur !' },
      { titre: 'Le compte de résultat', contenu: 'Il mesure votre PERFORMANCE sur une période : Produits (revenus) − Charges = Résultat net. Un résultat positif = bénéfice. Négatif = perte. C\'est votre vrai indicateur de rentabilité.' },
      { titre: 'La marge nette', contenu: 'Marge = Résultat net / Revenus × 100. Si vous gagnez 1 395 000 FCFA et votre résultat est 702 000 FCFA, votre marge est 50%. Visez >20% pour être sain. En-dessous de 10%, revoyez vos charges.' },
      { titre: 'Analyser les dépenses', contenu: 'Le graphique camembert montre votre répartition des dépenses. Si les salaires dépassent 40% de vos revenus, c\'est une vigilance. Si le loyer dépasse 15%, envisagez de renégocier. Ces ratios varient selon votre secteur.' },
    ],
  },
]

export const tips: TipSection[] = [
  {
    module: 'Transactions',
    icon: ArrowLeftRight,
    couleur: 'var(--green)',
    astuces: [
      'Enregistrez vos transactions au quotidien — le rétroactif est fastidieux et source d\'erreurs.',
      'Un débit augmente votre trésorerie (argent reçu). Un crédit la diminue (argent donné).',
      'Utilisez des descriptions précises : «Loyer local Zogona — Juin 2026» plutôt que «Loyer».',
      'Récurrences : configurez salaires, loyer, abonnements en entrées récurrentes pour ne pas oublier.',
    ],
  },
  {
    module: 'Factures',
    icon: FileText,
    couleur: 'var(--amber)',
    astuces: [
      'Envoyez la facture dès la prestation terminée — plus vous attendez, plus le client oublie.',
      'Relancez à J+3 si pas de paiement après l\'envoi. La relance est normale et professionnelle.',
      'Une facture en retard depuis +30 jours nécessite une mise en demeure formelle.',
      'Le numéro séquentiel est obligatoire pour la fiscalité : ne sautez jamais un numéro.',
    ],
  },
  {
    module: 'Rapports',
    icon: BarChart3,
    couleur: 'var(--blue)',
    astuces: [
      'Consultez votre bilan 1× par trimestre pour mesurer l\'évolution de vos capitaux propres.',
      'Comparez les mois entre eux pour identifier les cycles saisonniers de votre activité.',
      'Si votre marge baisse, cherchez d\'abord si vos prix n\'ont pas bougé face à des charges qui augmentent.',
      'Le bénéfice net n\'est pas de la trésorerie disponible : des créances impayées peuvent gonfler le bénéfice mais pas la banque.',
    ],
  },
]
