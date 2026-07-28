// lib/data.ts — Types + taxonomie de catégories pour CompTrack.
// Les données métier (transactions, clients, factures) sont chargées
// dynamiquement via lib/store.ts — voir CLAUDE.md.

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
  statut: "brouillon" | "envoyee" | "en_attente" | "payee" | "retard";
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

export interface ProduitCatalogue {
  id: string;
  nom: string;
  description?: string;
  categorie: "produit" | "service" | "immobilier" | "autre";
  prixUnitaire: number;
  unite: string;
  stock?: number;
  dateCreation: string;
}

export interface DonneesMensuelles {
  mois: string;
  revenus: number;
  depenses: number;
  benefice: number;
}

// ─── Catégories ───────────────────────────────────────────────────────────────
// Taxonomie de l'application (pas une donnée utilisateur) — utilisée pour
// classer les transactions et alimenter les listes déroulantes.

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
