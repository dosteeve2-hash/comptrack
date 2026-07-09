import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ObjectifsClient from "./ObjectifsClient";

export type Objectif = {
  id: string;
  user_id: string;
  titre: string;
  description: string | null;
  categorie: "revenu" | "epargne" | "investissement" | "remboursement" | "autre";
  montant_cible: number;
  montant_actuel: number;
  date_echeance: string | null;
  statut: "en_cours" | "atteint" | "abandonne";
};

const mockObjectifs: Objectif[] = [
  {
    id: "mock-1",
    user_id: "mock",
    titre: "Fonds de roulement Q3",
    description: null,
    categorie: "epargne",
    montant_cible: 5000000,
    montant_actuel: 3200000,
    date_echeance: "2026-09-30",
    statut: "en_cours",
  },
  {
    id: "mock-2",
    user_id: "mock",
    titre: "Remboursement prêt équipement",
    description: null,
    categorie: "remboursement",
    montant_cible: 2500000,
    montant_actuel: 2500000,
    date_echeance: "2026-07-01",
    statut: "atteint",
  },
  {
    id: "mock-3",
    user_id: "mock",
    titre: "Investissement nouvelle machine",
    description: null,
    categorie: "investissement",
    montant_cible: 8000000,
    montant_actuel: 1500000,
    date_echeance: "2026-12-31",
    statut: "en_cours",
  },
  {
    id: "mock-4",
    user_id: "mock",
    titre: "Objectif chiffre d'affaires S2",
    description: null,
    categorie: "revenu",
    montant_cible: 12000000,
    montant_actuel: 4800000,
    date_echeance: "2026-12-31",
    statut: "en_cours",
  },
  {
    id: "mock-5",
    user_id: "mock",
    titre: "Réserve de trésorerie",
    description: null,
    categorie: "epargne",
    montant_cible: 3000000,
    montant_actuel: 500000,
    date_echeance: "2027-01-01",
    statut: "en_cours",
  },
];

export default async function ObjectifsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let objectifs: Objectif[] = mockObjectifs;

  try {
    const { data, error } = await supabase
      .from("objectifs")
      .select(
        "id, user_id, titre, description, categorie, montant_cible, montant_actuel, date_echeance, statut"
      )
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      objectifs = data as Objectif[];
    }
  } catch {
    // Table inexistante ou erreur réseau → fallback mocks
  }

  return <ObjectifsClient objectifs={objectifs} userId={user.id} />;
}
