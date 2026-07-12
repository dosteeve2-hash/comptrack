import { Truck, Plus } from "lucide-react";

export default function FournisseursPage() {
  const mockFournisseurs = [
    { id: 1, nom: "CFAO Motors", pays: "Côte d'Ivoire", encours: 320000, statut: "À jour" },
    { id: 2, nom: "Total Energie BF", pays: "Burkina Faso", encours: 0, statut: "Soldé" },
    { id: 3, nom: "Sonabel", pays: "Burkina Faso", encours: 18000, statut: "À jour" },
    { id: 4, nom: "ONATEL SA", pays: "Burkina Faso", encours: 25000, statut: "En retard" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fournisseurs</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Gérez vos fournisseurs et encours</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Plus className="w-4 h-4" />
          Ajouter fournisseur
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg2)", borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              {["Fournisseur", "Pays", "Encours (FCFA)", "Statut"].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "var(--text2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockFournisseurs.map((f) => (
              <tr key={f.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "var(--border)" }}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,188,212,0.1)" }}>
                    <Truck className="w-4 h-4" style={{ color: "var(--cyan)" }} />
                  </div>
                  <span className="font-medium">{f.nom}</span>
                </td>
                <td className="px-6 py-4" style={{ color: "var(--text2)" }}>{f.pays}</td>
                <td className="px-6 py-4 font-mono font-semibold">{f.encours.toLocaleString("fr-FR")}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                    background: f.statut === "À jour" ? "rgba(34,197,94,0.1)" : f.statut === "Soldé" ? "rgba(100,116,139,0.1)" : "rgba(239,68,68,0.1)",
                    color: f.statut === "À jour" ? "var(--green)" : f.statut === "Soldé" ? "var(--text2)" : "var(--red)",
                  }}>
                    {f.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
