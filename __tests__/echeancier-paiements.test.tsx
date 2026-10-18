import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EcheancierPaiements from "../components/EcheancierPaiements";

const toastSuccess = vi.fn();

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn((...args: unknown[]) => toastSuccess(...args)) }),
  Toaster: () => null,
}));

const STORAGE_KEY = "comptrack_echeances";

function jourDecale(jours: number): string {
  const d = new Date();
  d.setDate(d.getDate() + jours);
  return d.toISOString().split("T")[0];
}

// Données de test uniquement : l'application ne contient aucune échéance par défaut.
const FIXTURES = [
  { id: "t1", libelle: "Échéance test en retard", montant: 100000, dateLimite: jourDecale(-10), statut: "En retard" },
  { id: "t2", libelle: "Échéance test lointaine", montant: 50000, dateLimite: jourDecale(60), statut: "En attente" },
  { id: "t3", libelle: "Échéance test payée", montant: 25000, dateLimite: jourDecale(-30), statut: "Payé" },
];

describe("EcheancierPaiements", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    localStorage.clear();
  });

  describe("sans aucune donnée", () => {
    it("affiche un état vide honnête avec une action", () => {
      render(<EcheancierPaiements />);
      expect(screen.getByText("Échéancier des paiements")).toBeInTheDocument();
      expect(screen.getByText(/aucune échéance enregistrée pour le moment/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /ajouter une échéance/i })).toBeInTheDocument();
    });

    it("n'affiche aucune échéance inventée", () => {
      render(<EcheancierPaiements />);
      for (const faux of ["Loyer bureau", "Abonnement Orange Money", "Facture Fournisseur Keita"]) {
        expect(screen.queryByText(faux)).not.toBeInTheDocument();
      }
      expect(screen.getByText(/Restant : 0 FCFA/)).toBeInTheDocument();
    });

    it("ajoute une échéance et la garde après rechargement", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<EcheancierPaiements />);

      await user.click(screen.getByRole("button", { name: /ajouter une échéance/i }));
      await user.type(screen.getByLabelText("Libellé"), "Ma charge");
      await user.type(screen.getByLabelText("Montant (FCFA)"), "42000");
      await user.type(screen.getByLabelText("Date limite"), jourDecale(30));
      await user.click(screen.getByRole("button", { name: /enregistrer/i }));

      expect(screen.getByText("Ma charge")).toBeInTheDocument();
      expect(screen.getAllByText(/42\s*000 FCFA/).length).toBeGreaterThan(0);

      unmount();
      render(<EcheancierPaiements />);
      expect(await screen.findByText("Ma charge")).toBeInTheDocument();
    });

    it("refuse une échéance incomplète", async () => {
      const user = userEvent.setup();
      render(<EcheancierPaiements />);
      await user.click(screen.getByRole("button", { name: /ajouter une échéance/i }));
      await user.click(screen.getByRole("button", { name: /enregistrer/i }));
      expect(screen.getByText(/indiquez un libellé/i)).toBeInTheDocument();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("avec des échéances saisies", () => {
    beforeEach(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(FIXTURES)));

    it("affiche les badges selon le statut", async () => {
      render(<EcheancierPaiements />);
      await screen.findByText("Échéance test en retard");
      expect(screen.getByTestId("badge-t1")).toHaveTextContent("En retard");
      expect(screen.getByTestId("badge-t1")).toHaveStyle({ color: "#ef4444" });
      expect(screen.getByTestId("badge-t3")).toHaveTextContent("Payé");
      expect(screen.getByTestId("badge-t2")).toHaveTextContent("En attente");
    });

    it('cache "Marquer payé" pour une échéance déjà payée', async () => {
      render(<EcheancierPaiements />);
      await screen.findByText("Échéance test payée");
      expect(screen.queryByTestId("btn-payer-t3")).not.toBeInTheDocument();
      expect(screen.getByTestId("btn-payer-t1")).toBeInTheDocument();
    });

    it("calcule le total restant puis le met à jour après paiement", async () => {
      const user = userEvent.setup();
      render(<EcheancierPaiements />);
      await screen.findByText("Échéance test en retard");
      expect(screen.getByText(/Restant : 150\s*000 FCFA/)).toBeInTheDocument();

      await user.click(screen.getByTestId("btn-payer-t1"));
      expect(screen.getByTestId("badge-t1")).toHaveTextContent("Payé");
      expect(screen.getByText(/Restant : 50\s*000 FCFA/)).toBeInTheDocument();
    });

    it("annonce le paiement avec le libellé de l'échéance", async () => {
      const user = userEvent.setup();
      render(<EcheancierPaiements />);
      await screen.findByText("Échéance test lointaine");
      await user.click(screen.getByTestId("btn-payer-t2"));
      expect(toastSuccess).toHaveBeenCalledOnce();
      expect(toastSuccess.mock.calls[0][0]).toContain("Échéance test lointaine");
    });
  });
});
