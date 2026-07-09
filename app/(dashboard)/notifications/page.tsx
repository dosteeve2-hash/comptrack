import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FeedActivite, { type ActiviteItem } from "@/app/(dashboard)/activite/FeedActivite";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByDate(activites: ActiviteItem[]): Record<string, ActiviteItem[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  const groups: Record<string, ActiviteItem[]> = {
    "Aujourd'hui": [],
    "Cette semaine": [],
    "Plus ancien": [],
  };

  for (const item of activites) {
    const d = new Date(item.created_at);
    const itemDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (itemDay.getTime() === today.getTime()) {
      groups["Aujourd'hui"].push(item);
    } else if (d >= weekStart) {
      groups["Cette semaine"].push(item);
    } else {
      groups["Plus ancien"].push(item);
    }
  }

  return groups;
}

function formatDateComplete(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Mock data de secours ─────────────────────────────────────────────────────

const mockActivites: ActiviteItem[] = [
  {
    id: "mock-1",
    type: "revenu",
    description: "Vente de marchandises — Boutique Aminata",
    montant: 450000,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-2",
    type: "depense",
    description: "Achat stock tissu ankara — Grossiste Ouaga",
    montant: 185000,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-3",
    type: "objectif",
    description: "Objectif \"CA 5M FCFA\" atteint à 78%",
    montant: null,
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-4",
    type: "revenu",
    description: "Prestation de service — Client Koné & Frères",
    montant: 320000,
    created_at: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-5",
    type: "export",
    description: "Export rapport mensuel juin 2026 (PDF)",
    montant: null,
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-6",
    type: "depense",
    description: "Loyer local commercial — Juillet 2026",
    montant: 120000,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // Fetch activites — fallback gracieux si table absente
  let activites: ActiviteItem[] = [];
  try {
    const { data, error } = await supabase
      .from("activite")
      .select("id, type, description, montant, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    activites = (data ?? []) as ActiviteItem[];
  } catch {
    activites = mockActivites;
  }

  const groups = groupByDate(activites);
  const hasAny = activites.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>
          Historique de toute votre activité
        </p>
      </div>

      {!hasAny ? (
        <div
          className="py-16 text-center rounded-2xl border"
          style={{ background: "var(--bg2)", borderColor: "var(--border)", color: "var(--text3)" }}
        >
          <p className="text-sm">Aucune notification pour le moment.</p>
        </div>
      ) : (
        Object.entries(groups).map(([label, items]) => {
          if (items.length === 0) return null;
          return (
            <section key={label}>
              <h2
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--text3)" }}
              >
                {label}
              </h2>
              {/* Afficher la date complète pour chaque item */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="relative">
                    <FeedActivite activites={[item]} />
                    <p
                      className="text-xs mt-1 pl-14"
                      style={{ color: "var(--text3)" }}
                    >
                      {formatDateComplete(item.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
