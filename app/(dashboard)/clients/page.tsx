import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientsClient from "./ClientsClient";

export interface ClientRecord {
  id: string;
  user_id: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  ville: string | null;
  secteur: string | null;
  notes: string | null;
  created_at: string;
}

const mockClients: ClientRecord[] = [
  {
    id: "mock-1",
    user_id: "mock",
    nom: "Aminata Konaté",
    email: "aminata.konate@gmail.com",
    telephone: "+226 70 12 34 56",
    ville: "Ouagadougou",
    secteur: "Commerce",
    notes: "Cliente fidèle, commandes régulières de tissus wax.",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "mock-2",
    user_id: "mock",
    nom: "Ibrahima Diallo",
    email: "i.diallo@ferme-sahel.bf",
    telephone: "+226 76 55 44 33",
    ville: "Koudougou",
    secteur: "Agriculture",
    notes: "Producteur de sésame, achète du matériel agricole.",
    created_at: "2026-02-05T09:00:00Z",
  },
  {
    id: "mock-3",
    user_id: "mock",
    nom: "Fatoumata Traoré",
    email: "fatoumata.t@conseil-rh.sn",
    telephone: "+221 77 234 56 78",
    ville: "Dakar",
    secteur: "Service",
    notes: "Consultante RH, partenaire pour formations digitales.",
    created_at: "2026-03-20T10:00:00Z",
  },
  {
    id: "mock-4",
    user_id: "mock",
    nom: "Moussa Coulibaly",
    email: "moussa.c@transport-mali.ml",
    telephone: "+223 66 78 90 12",
    ville: "Bamako",
    secteur: "Transport",
    notes: "Transporteur longue distance, axe Bamako-Ouaga.",
    created_at: "2026-04-12T11:00:00Z",
  },
  {
    id: "mock-5",
    user_id: "mock",
    nom: "Adjoa Mensah",
    email: "adjoa.mensah@artisanat-gh.com",
    telephone: "+233 50 123 4567",
    ville: "Accra",
    secteur: "Artisanat",
    notes: "Artisane spécialisée en bijoux en bronze et cuir.",
    created_at: "2026-05-08T12:00:00Z",
  },
];

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  let clients: ClientRecord[] = [];
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .order("nom", { ascending: true });

    if (error) throw error;
    clients = (data as ClientRecord[]) ?? [];
  } catch {
    clients = mockClients;
  }

  return <ClientsClient clients={clients} userId={user.id} />;
}
