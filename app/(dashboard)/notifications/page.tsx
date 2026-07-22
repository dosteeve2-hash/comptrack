import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NotificationsClient from "./NotificationsClient";

export const metadata = { title: "Notifications — CompTrack" };

export interface Notification {
  id: string;
  user_id: string;
  titre: string;
  message: string;
  type: "info" | "succes" | "alerte" | "erreur";
  categorie: "facture" | "depense" | "objectif" | "client" | "fournisseur" | "general";
  lue: boolean;
  lien: string | null;
  created_at: string;
}

const MOCKS: Omit<Notification, "id" | "user_id">[] = [
  {
    titre: "Facture #F-2026-012 payée",
    message: "Orange CI a réglé 850 000 FCFA",
    type: "succes",
    categorie: "facture",
    lue: false,
    lien: "/factures",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    titre: "Objectif atteint !",
    message: "Félicitations — Fonds de roulement Q3 est complété",
    type: "succes",
    categorie: "objectif",
    lue: false,
    lien: null,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    titre: "Facture en retard",
    message: "La facture #F-2026-009 de MTN CI (1 200 000 FCFA) est en retard de 15 jours",
    type: "alerte",
    categorie: "facture",
    lue: false,
    lien: "/factures",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    titre: "Dépense enregistrée",
    message: "Transport livraison — 45 000 FCFA ajoutée",
    type: "info",
    categorie: "depense",
    lue: true,
    lien: "/transactions",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    titre: "Nouveau client",
    message: "Société Agro Plus CI ajoutée à vos clients",
    type: "info",
    categorie: "client",
    lue: true,
    lien: "/clients",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    titre: "Budget dépassé",
    message: "Le budget Marketing dépasse de 23% ce mois-ci",
    type: "alerte",
    categorie: "general",
    lue: false,
    lien: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    titre: "Objectif à 80%",
    message: "Investissement nouvelle machine — encore 1 600 000 FCFA",
    type: "info",
    categorie: "objectif",
    lue: true,
    lien: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    titre: "Fournisseur mis à jour",
    message: "Agri Inputs SA — coordonnées modifiées",
    type: "info",
    categorie: "fournisseur",
    lue: true,
    lien: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

function buildMocks(userId: string): Notification[] {
  return MOCKS.map((m, i) => ({
    ...m,
    id: `mock-${i}`,
    user_id: userId,
  }));
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/connexion");
  }

  let notifications: Notification[] = [];

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      notifications = buildMocks(user.id);
    } else {
      notifications = data as Notification[];
    }
  } catch {
    notifications = buildMocks(user.id);
  }

  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <NotificationsClient
      notifications={notifications}
      userId={user.id}
      nonLues={nonLues}
    />
  );
}
