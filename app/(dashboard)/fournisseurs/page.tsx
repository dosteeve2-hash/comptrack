import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FournisseursClient from "./FournisseursClient";

export type Fournisseur = {
  id: string;
  nom: string;
  contact_nom: string | null;
  email: string | null;
  telephone: string | null;
  ville: string | null;
  pays: string | null;
  categorie: "intrants" | "equipements" | "services" | "transport" | "autre";
  numero_ifu: string | null;
  notes: string | null;
  created_at?: string;
};

const mockFournisseurs: Fournisseur[] = [
  {
    id: "1",
    nom: "Agri-Intrants SARL",
    contact_nom: "Adama Konaté",
    email: "akonati@agriintrants.bf",
    telephone: "+226 70 11 22 33",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    categorie: "intrants",
    numero_ifu: "BF-2024-1234",
    notes: "Fournisseur d'engrais et semences",
  },
  {
    id: "2",
    nom: "Mécanique Sahel",
    contact_nom: "Ibrahim Traoré",
    email: null,
    telephone: "+226 76 55 44 22",
    ville: "Bobo-Dioulasso",
    pays: "Burkina Faso",
    categorie: "equipements",
    numero_ifu: null,
    notes: "Réparation tracteurs",
  },
  {
    id: "3",
    nom: "Transport Express BF",
    contact_nom: "Fatima Ouédraogo",
    email: "transport@expressbf.com",
    telephone: "+226 65 33 77 88",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    categorie: "transport",
    numero_ifu: "BF-2023-5678",
    notes: "Camions frigorifiques",
  },
  {
    id: "4",
    nom: "Conseil Agro-Mali",
    contact_nom: "Moussa Coulibaly",
    email: "m.coulibaly@agromail.ml",
    telephone: "+223 90 12 34 56",
    ville: "Bamako",
    pays: "Mali",
    categorie: "services",
    numero_ifu: null,
    notes: "Consultant certification bio",
  },
  {
    id: "5",
    nom: "PackAgri Dakar",
    contact_nom: "Aminata Sow",
    email: "packagri@dakar.sn",
    telephone: "+221 77 000 11 22",
    ville: "Dakar",
    pays: "Sénégal",
    categorie: "autre",
    numero_ifu: null,
    notes: "Emballages et packaging",
  },
];

export default async function FournisseursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let fournisseurs: Fournisseur[] = [];

  const { data, error } = await supabase
    .from("fournisseurs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    fournisseurs = mockFournisseurs;
  } else {
    fournisseurs = data as Fournisseur[];
  }

  return <FournisseursClient initialFournisseurs={fournisseurs} />;
}
