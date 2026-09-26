import { beforeEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientsPage from "../app/(dashboard)/clients/page";
import type { Client } from "../lib/data";

const STORAGE_KEY = "comptrack_clients";

function client(overrides: Partial<Client>): Client {
  return {
    id: "cl1",
    nom: "Client",
    type: "client",
    ville: "Ouagadougou",
    pays: "Burkina Faso",
    totalTransactions: 0,
    dernierContact: "2026-08-01",
    ...overrides,
  };
}

const SEED: Client[] = [
  client({ id: "cl1", nom: "Boutique Aminata", ville: "Ouagadougou", email: "aminata@exemple.com" }),
  client({ id: "cl2", nom: "Fournisseur Bassirou", type: "fournisseur", ville: "Bobo-Dioulasso" }),
  client({ id: "cl3", nom: "Sarah Traoré", ville: "Koudougou", email: "sarah@exemple.com" }),
];

describe("ClientsPage — recherche", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
  });

  it("affiche tous les contacts quand la recherche est vide", async () => {
    render(<ClientsPage />);

    expect(await screen.findByText("Boutique Aminata")).toBeInTheDocument();
    expect(screen.getByText("Fournisseur Bassirou")).toBeInTheDocument();
    expect(screen.getByText("Sarah Traoré")).toBeInTheDocument();
    expect(screen.getByText("3 contacts affichés")).toBeInTheDocument();
  });

  it("filtre par nom, insensible à la casse", async () => {
    const user = userEvent.setup();
    render(<ClientsPage />);
    await screen.findByText("Boutique Aminata");

    await user.type(screen.getByPlaceholderText(/rechercher un client/i), "aminata");

    expect(screen.getByText("Boutique Aminata")).toBeInTheDocument();
    expect(screen.queryByText("Fournisseur Bassirou")).not.toBeInTheDocument();
    expect(screen.queryByText("Sarah Traoré")).not.toBeInTheDocument();
  });

  it("filtre par ville", async () => {
    const user = userEvent.setup();
    render(<ClientsPage />);
    await screen.findByText("Boutique Aminata");

    await user.type(screen.getByPlaceholderText(/rechercher un client/i), "Bobo");

    expect(screen.getByText("Fournisseur Bassirou")).toBeInTheDocument();
    expect(screen.queryByText("Boutique Aminata")).not.toBeInTheDocument();
  });

  it("filtre par email", async () => {
    const user = userEvent.setup();
    render(<ClientsPage />);
    await screen.findByText("Boutique Aminata");

    await user.type(screen.getByPlaceholderText(/rechercher un client/i), "sarah@exemple.com");

    expect(screen.getByText("Sarah Traoré")).toBeInTheDocument();
    expect(screen.queryByText("Boutique Aminata")).not.toBeInTheDocument();
    expect(screen.queryByText("Fournisseur Bassirou")).not.toBeInTheDocument();
  });

  it("affiche l'état vide quand aucun contact ne correspond", async () => {
    const user = userEvent.setup();
    render(<ClientsPage />);
    await screen.findByText("Boutique Aminata");

    await user.type(screen.getByPlaceholderText(/rechercher un client/i), "zzz-inconnu");

    expect(screen.getByText("Aucun contact trouvé")).toBeInTheDocument();
    expect(screen.queryByText("Boutique Aminata")).not.toBeInTheDocument();
  });

  it("combine la recherche texte avec le filtre de type", async () => {
    const user = userEvent.setup();
    render(<ClientsPage />);
    await screen.findByText("Boutique Aminata");

    await user.click(screen.getByRole("button", { name: "Fournisseurs" }));

    expect(screen.getByText("Fournisseur Bassirou")).toBeInTheDocument();
    expect(screen.queryByText("Boutique Aminata")).not.toBeInTheDocument();
    expect(screen.queryByText("Sarah Traoré")).not.toBeInTheDocument();
  });
});
