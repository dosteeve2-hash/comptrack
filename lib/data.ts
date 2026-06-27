// lib/data.ts — Données fictives réalistes pour CompTrack MVP

export interface Transaction {
  id: string;
  type: "revenu" | "depense";
  montant: number;
  categorie: string;
  description: string;
  date: string;
  client?: string;
  statut: "validee" | "en_attente" | "annulee";
}

export interface Client {
  id: string;
  nom: string;
  type: "client" | "fournisseur";
  email?: string;
  telephone?: string;
  ville: string;
  pays: string;
  totalTransactions: number;
  dernierContact: string;
}

export interface Facture {
  id: string;
  numero: string;
  client: string;
  montant: number;
  dateCreation: string;
  dateEcheance: string;
  statut: "payee" | "en_attente" | "retard";
  articles: FactureArticle[];
}

export interface FactureArticle {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Categorie {
  id: string;
  nom: string;
  type: "revenu" | "depense" | "les_deux";
  couleur: string;
}

export interface DonneesMensuelles {
  mois: string;
  revenus: number;
  depenses: number;
  benefice: number;
}

// ─── Catégories ───────────────────────────────────────────────────────────────

export const categories: Categorie[] = [
  { id: "c1", nom: "Ventes produits", type: "revenu", couleur: "#22c55e" },
  { id: "c2", nom: "Prestations services", type: "revenu", couleur: "#16a34a" },
  { id: "c3", nom: "Consultations", type: "revenu", couleur: "#4ade80" },
  { id: "c4", nom: "Achat stock", type: "depense", couleur: "#ef4444" },
  { id: "c5", nom: "Salaires", type: "depense", couleur: "#dc2626" },
  { id: "c6", nom: "Loyer", type: "depense", couleur: "#f97316" },
  { id: "c7", nom: "Transport", type: "depense", couleur: "#f59e0b" },
  { id: "c8", nom: "Télécommunications", type: "depense", couleur: "#8b5cf6" },
  { id: "c9", nom: "Électricité/Eau", type: "depense", couleur: "#3b82f6" },
  { id: "c10", nom: "Fournitures bureau", type: "depense", couleur: "#06b6d4" },
  { id: "c11", nom: "Marketing", type: "depense", couleur: "#ec4899" },
  { id: "c12", nom: "Maintenance", type: "depense", couleur: "#84cc16" },
];

// ─── Transactions ──────────────────────────────────────────────────────────────

export const transactions: Transaction[] = [
  {
    id: "t1",
    type: "revenu",
    montant: 450000,
    categorie: "Ventes produits",
    description: "Vente tissus wax — commande Marché Rood Wooko",
    date: "2026-06-25",
    client: "Boutique Aminata",
    statut: "validee",
  },
  {
    id: "t2",
    type: "depense",
    montant: 180000,
    categorie: "Achat stock",
    description: "Réapprovisionnement tissu bazin — fournisseur Dakar",
    date: "2026-06-24",
    client: "Textile Sénégal SARL",
    statut: "validee",
  },
  {
    id: "t3",
    type: "revenu",
    montant: 320000,
    categorie: "Prestations services",
    description: "Développement site e-commerce client",
    date: "2026-06-22",
    client: "SuperMarché Ouaga",
    statut: "validee",
  },
  {
    id: "t4",
    type: "depense",
    montant: 75000,
    categorie: "Transport",
    description: "Livraison commandes — zone Pissy et Gounghin",
    date: "2026-06-21",
    statut: "validee",
  },
  {
    id: "t5",
    type: "depense",
    montant: 250000,
    categorie: "Salaires",
    description: "Salaire assistant commercial — Juin 2026",
    date: "2026-06-20",
    statut: "validee",
  },
  {
    id: "t6",
    type: "revenu",
    montant: 195000,
    categorie: "Consultations",
    description: "Formation digital marketing — PME partenaires",
    date: "2026-06-18",
    client: "GIE Commerce Ouagadougou",
    statut: "validee",
  },
  {
    id: "t7",
    type: "depense",
    montant: 45000,
    categorie: "Télécommunications",
    description: "Abonnement internet fibre + forfaits téléphoniques",
    date: "2026-06-15",
    statut: "validee",
  },
  {
    id: "t8",
    type: "depense",
    montant: 120000,
    categorie: "Loyer",
    description: "Loyer local commercial — Quartier Zogona",
    date: "2026-06-01",
    statut: "validee",
  },
  {
    id: "t9",
    type: "revenu",
    montant: 280000,
    categorie: "Ventes produits",
    description: "Commande en gros — articles artisanat",
    date: "2026-06-10",
    client: "Export Africa Trading",
    statut: "validee",
  },
  {
    id: "t10",
    type: "depense",
    montant: 35000,
    categorie: "Électricité/Eau",
    description: "Facture SONABEL + ONEA — Juin 2026",
    date: "2026-06-05",
    statut: "validee",
  },
  {
    id: "t11",
    type: "depense",
    montant: 65000,
    categorie: "Marketing",
    description: "Publicité Facebook + design flyers",
    date: "2026-06-12",
    statut: "validee",
  },
  {
    id: "t12",
    type: "revenu",
    montant: 150000,
    categorie: "Prestations services",
    description: "Maintenance application mobile — contrat mensuel",
    date: "2026-06-08",
    client: "FinTech Burkina",
    statut: "en_attente",
  },
  {
    id: "t13",
    type: "depense",
    montant: 28000,
    categorie: "Fournitures bureau",
    description: "Papeterie, cartouches imprimante, matériel divers",
    date: "2026-06-03",
    statut: "validee",
  },
  {
    id: "t14",
    type: "revenu",
    montant: 500000,
    categorie: "Ventes produits",
    description: "Commande spéciale — tenues uniformes scolaires",
    date: "2026-06-02",
    client: "Lycée Philippe Zinda",
    statut: "validee",
  },
  {
    id: "t15",
    type: "depense",
    montant: 95000,
    categorie: "Maintenance",
    description: "Réparation climatiseur + maintenance groupe électrogène",
    date: "2026-05-28",
    statut: "validee",
  },
];

// ─── Clients & Fournisseurs ───────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: "cl1",
    nom: "Boutique Aminata",
    type: "client",
    email: "aminata.boutique@gmail.com",
    telephone: "+226 70 12 34 56",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    totalTransactions: 1250000,
    dernierContact: "2026-06-25",
  },
  {
    id: "cl2",
    nom: "SuperMarché Ouaga",
    type: "client",
    email: "contact@supermarche-ouaga.bf",
    telephone: "+226 25 33 44 55",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    totalTransactions: 980000,
    dernierContact: "2026-06-22",
  },
  {
    id: "cl3",
    nom: "Export Africa Trading",
    type: "client",
    email: "info@exportafrica.com",
    telephone: "+233 50 123 4567",
    ville: "Accra",
    pays: "Ghana",
    totalTransactions: 2100000,
    dernierContact: "2026-06-10",
  },
  {
    id: "cl4",
    nom: "GIE Commerce Ouagadougou",
    type: "client",
    email: "gie.commerce@yahoo.fr",
    telephone: "+226 70 98 76 54",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    totalTransactions: 450000,
    dernierContact: "2026-06-18",
  },
  {
    id: "cl5",
    nom: "Lycée Philippe Zinda",
    type: "client",
    email: "lycee.zinda@education.bf",
    telephone: "+226 25 44 55 66",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    totalTransactions: 750000,
    dernierContact: "2026-06-02",
  },
  {
    id: "cl6",
    nom: "FinTech Burkina",
    type: "client",
    email: "dev@fintechburkina.com",
    telephone: "+226 07 11 22 33",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    totalTransactions: 600000,
    dernierContact: "2026-06-08",
  },
  {
    id: "cl7",
    nom: "Textile Sénégal SARL",
    type: "fournisseur",
    email: "textile.senegal@orange.sn",
    telephone: "+221 77 234 56 78",
    ville: "Dakar",
    pays: "Sénégal",
    totalTransactions: 850000,
    dernierContact: "2026-06-24",
  },
  {
    id: "cl8",
    nom: "Grossiste Textiles Abidjan",
    type: "fournisseur",
    email: "grossiste@textileabj.ci",
    telephone: "+225 07 08 09 10",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    totalTransactions: 1200000,
    dernierContact: "2026-05-15",
  },
];

// ─── Factures ─────────────────────────────────────────────────────────────────

export const factures: Facture[] = [
  {
    id: "f1",
    numero: "FAC-2026-001",
    client: "Export Africa Trading",
    montant: 280000,
    dateCreation: "2026-06-10",
    dateEcheance: "2026-07-10",
    statut: "payee",
    articles: [
      {
        description: "Articles artisanat — lot 50 pièces",
        quantite: 50,
        prixUnitaire: 4000,
        total: 200000,
      },
      {
        description: "Emballage premium + livraison",
        quantite: 1,
        prixUnitaire: 80000,
        total: 80000,
      },
    ],
  },
  {
    id: "f2",
    numero: "FAC-2026-002",
    client: "SuperMarché Ouaga",
    montant: 320000,
    dateCreation: "2026-06-22",
    dateEcheance: "2026-07-22",
    statut: "en_attente",
    articles: [
      {
        description: "Développement site e-commerce",
        quantite: 1,
        prixUnitaire: 250000,
        total: 250000,
      },
      {
        description: "Formation équipe (2 jours)",
        quantite: 2,
        prixUnitaire: 35000,
        total: 70000,
      },
    ],
  },
  {
    id: "f3",
    numero: "FAC-2026-003",
    client: "Lycée Philippe Zinda",
    montant: 500000,
    dateCreation: "2026-06-02",
    dateEcheance: "2026-06-30",
    statut: "en_attente",
    articles: [
      {
        description: "Uniformes scolaires — 100 ensembles",
        quantite: 100,
        prixUnitaire: 5000,
        total: 500000,
      },
    ],
  },
  {
    id: "f4",
    numero: "FAC-2026-004",
    client: "FinTech Burkina",
    montant: 150000,
    dateCreation: "2026-06-08",
    dateEcheance: "2026-06-20",
    statut: "retard",
    articles: [
      {
        description: "Maintenance application mobile — Juin",
        quantite: 1,
        prixUnitaire: 150000,
        total: 150000,
      },
    ],
  },
  {
    id: "f5",
    numero: "FAC-2026-005",
    client: "GIE Commerce Ouagadougou",
    montant: 195000,
    dateCreation: "2026-06-18",
    dateEcheance: "2026-07-18",
    statut: "payee",
    articles: [
      {
        description: "Formation digital marketing",
        quantite: 3,
        prixUnitaire: 65000,
        total: 195000,
      },
    ],
  },
  {
    id: "f6",
    numero: "FAC-2026-006",
    client: "Boutique Aminata",
    montant: 450000,
    dateCreation: "2026-06-25",
    dateEcheance: "2026-07-25",
    statut: "payee",
    articles: [
      {
        description: "Tissu wax hollandais — 45 mètres",
        quantite: 45,
        prixUnitaire: 8000,
        total: 360000,
      },
      {
        description: "Tissu bogolan artisanal — 15 mètres",
        quantite: 15,
        prixUnitaire: 6000,
        total: 90000,
      },
    ],
  },
];

// ─── Données graphiques ───────────────────────────────────────────────────────

export const donneesMensuelles: DonneesMensuelles[] = [
  { mois: "Jan", revenus: 850000, depenses: 420000, benefice: 430000 },
  { mois: "Fév", revenus: 920000, depenses: 490000, benefice: 430000 },
  { mois: "Mar", revenus: 1050000, depenses: 520000, benefice: 530000 },
  { mois: "Avr", revenus: 980000, depenses: 580000, benefice: 400000 },
  { mois: "Mai", revenus: 1150000, depenses: 610000, benefice: 540000 },
  { mois: "Jun", revenus: 1395000, depenses: 693000, benefice: 702000 },
];

// ─── KPIs mois en cours ───────────────────────────────────────────────────────

export const kpisMoisActuel = {
  solde: 4250000,
  revenusMois: 1395000,
  revenusMoisPrecedent: 1150000,
  depensesMois: 693000,
  depensesMoisPrecedent: 610000,
  beneficeNet: 702000,
  beneficeNetPrecedent: 540000,
};

// ─── Top catégories dépenses ──────────────────────────────────────────────────

export const topCategoriesDepenses = [
  { nom: "Salaires", montant: 250000, couleur: "#ef4444" },
  { nom: "Achat stock", montant: 180000, couleur: "#f97316" },
  { nom: "Loyer", montant: 120000, couleur: "#f59e0b" },
  { nom: "Transport", montant: 75000, couleur: "#8b5cf6" },
  { nom: "Marketing", montant: 65000, couleur: "#ec4899" },
  { nom: "Autres", montant: 3000, couleur: "#6b7280" },
];
