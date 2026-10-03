"use client";

import { useNotifications } from "@/lib/store";
import NotificationsClient from "./NotificationsClient";

export default function NotificationsPage() {
  const [notifications, setNotifications, loaded] = useNotifications();

  if (!loaded) return null;

  return <NotificationsClient notifications={notifications} setNotifications={setNotifications} />;
}
