import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EcheancierPaiements from "../components/EcheancierPaiements";

// ── Mock sonner ──────────────────────────────────────────────────────────────
const toastSuccess = vi.fn();

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn((...args: unknown[]) => toastSuccess(...args)) }),
  Toaster: () => null,
}));

// ── Mock lucide-react icons ──────────────────────────────────────────────────
vi.mock("lucide-react", () => ({
  CalendarClock: () => <span data-testid="icon-calendar" />,
  CheckCircle2:  () => <span data-testid="icon-check" />,
}));

describe("EcheancierPaiements", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
  });

  // ── Rendu initial ──────────────────────────────────────────────────────────
  it("affiche le titre et les 5 échéances", () => {
    render(<EcheancierPaiements />);
    expect(screen.getByText("Échéancier des paiements")).toBeInTheDocument();
    expect(screen.getByText("Loyer bureau")).toBeInTheDocument();
    expect(screen.getByText("Abonnement Orange Money")).toBeInTheDocument();
    expect(screen.getByText("Facture Fournisseur Keita")).toBeInTheDocument();
    expect(screen.getByText("Remboursement prêt bancaire")).toBeInTheDocument();
    expect(screen.getByText("Prestation consultant web")).toBeInTheDocument();
  });

  // ── Badge statut ───────────────────────────────────────────────────────────
  it('affiche le badge "En retard" (rouge) pour l\'échéance en retard', () => {
    render(<EcheancierPaiements />);
    const badge = screen.getByTestId("badge-1");
    expect(badge).toHaveTextContent("En retard");
    expect(badge).toHaveStyle({ color: "#ef4444" });
  });

  it('affiche le badge "Payé" (vert) pour l\'échéance déjà payée', () => {
    render(<EcheancierPaiements />);
    const badge = screen.getByTestId("badge-5");
    expect(badge).toHaveTextContent("Payé");
    expect(badge).toHaveStyle({ color: "#22c55e" });
  });

  it('affiche un badge "En attente" ou "Urgent" pour les échéances futures', () => {
    render(<EcheancierPaiements />);
    const badge3 = screen.getByTestId("badge-3");
    expect(["En attente", "Urgent"]).toContain(badge3.textContent);
  });

  // ── Bouton "Marquer payé" ──────────────────────────────────────────────────
  it('n\'affiche pas le bouton "Marquer payé" pour une échéance déjà payée', () => {
    render(<EcheancierPaiements />);
    expect(screen.queryByTestId("btn-payer-5")).not.toBeInTheDocument();
  });

  it('affiche le bouton "Marquer payé" pour une échéance non payée', () => {
    render(<EcheancierPaiements />);
    expect(screen.getByTestId("btn-payer-1")).toBeInTheDocument();
    expect(screen.getByTestId("btn-payer-2")).toBeInTheDocument();
    expect(screen.getByTestId("btn-payer-3")).toBeInTheDocument();
    expect(screen.getByTestId("btn-payer-4")).toBeInTheDocument();
  });

  // ── Interaction clic "Marquer payé" ───────────────────────────────────────
  it("marque une échéance comme payée et cache le bouton après le clic", async () => {
    const user = userEvent.setup();
    render(<EcheancierPaiements />);

    const btn = screen.getByTestId("btn-payer-2");
    await user.click(btn);

    // Le bouton disparaît et le badge passe à "Payé"
    expect(screen.queryByTestId("btn-payer-2")).not.toBeInTheDocument();
    expect(screen.getByTestId("badge-2")).toHaveTextContent("Payé");
  });

  it("appelle toast.success avec le libellé de l'échéance au clic sur Marquer payé", async () => {
    const user = userEvent.setup();
    render(<EcheancierPaiements />);

    await user.click(screen.getByTestId("btn-payer-3"));

    expect(toastSuccess).toHaveBeenCalledOnce();
    const firstArg = toastSuccess.mock.calls[0][0] as string;
    expect(firstArg).toContain("Facture Fournisseur Keita");
  });

  // ── Calcul du total restant ────────────────────────────────────────────────
  it("affiche le total des échéances non payées dans le header", () => {
    render(<EcheancierPaiements />);
    // Total = 150000 + 25000 + 320000 + 200000 = 695000
    expect(screen.getByText(/695\s*000 FCFA/)).toBeInTheDocument();
  });

  it("met à jour le total restant après avoir marqué une échéance payée", async () => {
    const user = userEvent.setup();
    render(<EcheancierPaiements />);

    // Marquer "Loyer bureau" (150 000) comme payé
    await user.click(screen.getByTestId("btn-payer-1"));

    // Nouveau total = 695000 - 150000 = 545000
    expect(screen.getByText(/545\s*000 FCFA/)).toBeInTheDocument();
  });

  // ── Montants affichés ──────────────────────────────────────────────────────
  it("affiche les montants formatés en FCFA", () => {
    render(<EcheancierPaiements />);
    expect(screen.getByText(/150\s*000 FCFA/)).toBeInTheDocument();
    expect(screen.getByText(/320\s*000 FCFA/)).toBeInTheDocument();
    expect(screen.getByText(/80\s*000 FCFA/)).toBeInTheDocument();
  });
});
