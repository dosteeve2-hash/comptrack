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

    if (!error && data) {
      notifications = data as Notification[];
    }
  } catch {
    notifications = [];
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
