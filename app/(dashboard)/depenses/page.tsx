import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DepensesClient from "./DepensesClient";

export type Depense = {
  id: string;
  libelle: string;
  categorie: string;
  montant: number;
  fournisseur_nom: string | null;
  date_depense: string;
  notes: string | null;
};

const mockDepenses: Depense[] = [
  {
    id: "1",
    libelle: "Engrais NPK 50kg",
    categorie: "intrants",
    montant: 45000,
    fournisseur_nom: "Agri-Intrants SARL",
    date_depense: "2026-07-05",
    notes: null,
  },
  {
    id: "2",
    libelle: "Réparation tracteur",
    categorie: "equipement",
    montant: 120000,
    fournisseur_nom: "Mécanique Sahel",
    date_depense: "2026-07-03",
    notes: "Remplacement pompe à eau",
  },
  {
    id: "3",
    libelle: "Transport récolte Ouaga",
    categorie: "transport",
    montant: 35000,
    fournisseur_nom: "Transport Express BF",
    date_depense: "2026-06-28",
    notes: null,
  },
  {
    id: "4",
    libelle: "Main d'œuvre saisonnière (5 personnes)",
    categorie: "main_oeuvre",
    montant: 75000,
    fournisseur_nom: null,
    date_depense: "2026-06-20",
    notes: "Récolte café Arabica lot #3",
  },
  {
    id: "5",
    libelle: "Frais audit certification bio",
    categorie: "certification",
    montant: 200000,
    fournisseur_nom: "Ecocert",
    date_depense: "2026-06-15",
    notes: "Audit annuel renouvellement",
  },
  {
    id: "6",
    libelle: "Taxes et frais export",
    categorie: "frais_admin",
    montant: 28500,
    fournisseur_nom: null,
    date_depense: "2026-06-10",
    notes: null,
  },
];

export default async function DepensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("depenses")
    .select("id, libelle, categorie, montant, fournisseur_nom, date_depense, notes")
    .order("date_depense", { ascending: false });

  const depenses: Depense[] = error || !data || data.length === 0 ? mockDepenses : (data as Depense[]);

  return <DepensesClient depenses={depenses} />;
}
