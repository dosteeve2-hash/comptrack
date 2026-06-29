import { createClient } from "@/lib/supabase/server";
import RevenueChartBar, { type MonthlyData } from "./RevenueChartBar";

const MOIS_FR = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

interface TransactionRow {
  montant: number;
  type: string;
  date: string;
}

async function fetchMonthlyData(): Promise<MonthlyData[]> {
  const now = new Date();

  // Build 6-month skeleton (oldest first)
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const months: MonthlyData[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ mois: MOIS_FR[d.getMonth()], revenus: 0, depenses: 0 });
  }

  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("transactions")
      .select("montant, type, date")
      .gte("date", startDate.toISOString())
      .in("type", ["recette", "depense"]);

    if (!data) return months;

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    (data as TransactionRow[]).forEach((tx) => {
      const txDate = new Date(tx.date);
      const idx =
        (txDate.getFullYear() - startYear) * 12 +
        (txDate.getMonth() - startMonth);

      if (idx < 0 || idx > 5) return;

      if (tx.type === "recette") {
        months[idx].revenus += tx.montant ?? 0;
      } else if (tx.type === "depense") {
        months[idx].depenses += tx.montant ?? 0;
      }
    });
  } catch {
    // Supabase unavailable — return empty skeleton (empty state shown in chart)
  }

  return months;
}

export default async function RevenueChart() {
  const data = await fetchMonthlyData();
  return <RevenueChartBar data={data} />;
}
