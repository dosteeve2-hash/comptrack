import { beforeEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "../lib/store";
import NotificationsClient from "../app/(dashboard)/notifications/NotificationsClient";
import type { Notification } from "../lib/data";

const STORAGE_KEY = "comptrack_notifications";

function notif(overrides: Partial<Notification>): Notification {
  return {
    id: "n1",
    titre: "Titre",
    message: "Message",
    type: "info",
    categorie: "general",
    lue: false,
    lien: null,
    createdAt: "2026-08-01T10:00:00.000Z",
    ...overrides,
  };
}

/** Harnais fidèle à app/(dashboard)/notifications/page.tsx : hook réel + composant. */
function Harness() {
  const [notifications, setNotifications, loaded] = useNotifications();
  if (!loaded) return null;
  return <NotificationsClient notifications={notifications} setNotifications={setNotifications} />;
}

describe("NotificationsClient — marquer comme lue", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("marque une notification comme lue au clic et retire son badge non-lue", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([notif({ id: "n1", titre: "Facture en retard", lue: false })])
    );
    const user = userEvent.setup();

    render(<Harness />);

    expect(screen.getByText("1 non lues")).toBeInTheDocument();
    const marquerBtn = screen.getByRole("button", { name: /marquer lue/i });
    await user.click(marquerBtn);

    expect(screen.queryByText(/non lues/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /marquer lue/i })).not.toBeInTheDocument();
  });

  it("persiste l'état lu dans localStorage après le clic", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([notif({ id: "n1", lue: false })])
    );
    const user = userEvent.setup();

    render(<Harness />);
    await user.click(screen.getByRole("button", { name: /marquer lue/i }));

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Notification[];
    expect(persisted).toHaveLength(1);
    expect(persisted[0].lue).toBe(true);
  });

  it("« Tout marquer comme lu » marque toutes les notifications et persiste le résultat", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        notif({ id: "n1", titre: "Un", lue: false }),
        notif({ id: "n2", titre: "Deux", lue: false }),
        notif({ id: "n3", titre: "Trois", lue: true }),
      ])
    );
    const user = userEvent.setup();

    render(<Harness />);

    expect(screen.getByText("2 non lues")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /tout marquer comme lu/i }));

    expect(screen.queryByText(/non lues/)).not.toBeInTheDocument();
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Notification[];
    expect(persisted.every((n) => n.lue)).toBe(true);
  });

  it("ne modifie pas les autres notifications quand on marque une seule notification comme lue", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        notif({ id: "n1", titre: "Cible", lue: false }),
        notif({ id: "n2", titre: "Intacte", lue: false }),
      ])
    );
    const user = userEvent.setup();

    render(<Harness />);
    const cibleCard = screen.getByText("Cible").closest("div.gap-4") as HTMLElement;
    await user.click(within(cibleCard).getByRole("button", { name: /marquer lue/i }));

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Notification[];
    expect(persisted.find((n) => n.id === "n1")?.lue).toBe(true);
    expect(persisted.find((n) => n.id === "n2")?.lue).toBe(false);
  });
});
