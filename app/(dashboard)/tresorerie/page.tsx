"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Wallet, AlertTriangle, TrendingUp, TrendingDown,
  Building2, ArrowUpRight, ArrowDownRight, Settings2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CompteBancaire {
  id: string;
  banque: string;
  numero: string;
  solde: number;
  couleur: string;
}

interface MouvementTresorerie {
  date: string;
  libelle: string;
  debit: number;
  credit: number;
  soldeApres: number;
  type: "credit" | "debit";
}

interface DonneeJournaliere {
  date: string;
  solde: number;
}

interface PrevisionMensuel {
  libelle: string;
  montant: number;
  type: "entree" | "sortie";
}

// ─── Données mock ────────────────────────────────────────────────────────────

const comptesBancaires: CompteBancaire[] = [
  { id: "coris",   banque: "Coris Bank International", numero: "BF062 01234 56789 0",  solde: 6_800_000, couleur: "var(--gold)"  },
  { id: "uba",     banque: "UBA Burkina Faso",         numero: "BF062 09876 54321 0",  solde: 2_150_000, couleur: "var(--cyan)"  },
  { id: "ecobank", banque: "Ecobank Burkina",          numero: "BF062 05555 11111 0",  solde: -100_000,  couleur: "var(--amber)" },
];

const mouvementsRecents: MouvementTresorerie[] = [
  { date: "2025-06-30", libelle: "Vente marchandises — Famille Sawadogo",    debit: 0,          credit: 1_250_000, soldeApres: 6_800_000, type: "credit" },
  { date: "2025-06-29", libelle: "Règlement fournisseur SCIMA-BF",           debit: 750_000,    credit: 0,         soldeApres: 5_550_000, type: "debit"  },
  { date: "2025-06-27", libelle: "Loyer mensuel — Quartier Gounghin",        debit: 320_000,    credit: 0,         soldeApres: 6_300_000, type: "debit"  },
  { date: "2025-06-26", libelle: "Virement client — Entreprise Kaboré",      debit: 0,          credit: 2_100_000, soldeApres: 6_620_000, type: "credit" },
  { date: "2025-06-25", libelle: "Salaires — Juin 2025",                     debit: 1_800_000,  credit: 0,         soldeApres: 4_520_000, type: "debit"  },
  { date: "2025-06-23", libelle: "Vente comptoir — Clientèle diverse",       debit: 0,          credit: 680_000,   soldeApres: 6_320_000, type: "credit" },
  { date: "2025-06-20", libelle: "Cotisations CNSS/CNAMGS",                  debit: 420_000,    credit: 0,         soldeApres: 5_640_000, type: "debit"  },
  { date: "2025-06-18", libelle: "Encaissement facture FA-2025-089",         debit: 0,          credit: 950_000,   soldeApres: 6_060_000, type: "credit" },
  { date: "2025-06-15", libelle: "Remboursement emprunt BF — tranche mensuelle", debit: 350_000, credit: 0,        soldeApres: 5_110_000, type: "debit"  },
  { date: "2025-06-12", libelle: "Facture téléphonie & internet",            debit: 85_000,     credit: 0,         soldeApres: 5_460_000, type: "debit"  },
];

// Génère 90 jours de solde quotidien (données simulées)
function genererSoldeQuotidien(): DonneeJournaliere[] {
  const data: DonneeJournaliere[] = [];
  let solde = 4_200_000;
  const debut = new Date("2025-04-01");
  for (let i = 0; i < 90; i++) {
    const d = new Date(debut);
    d.setDate(debut.getDate() + i);
    const variation = (Math.random() - 0.42) * 600_000;
    solde = Math.max(500_000, solde + variation);
    data.push({
      date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      solde: Math.round(solde),
    });
  }
  // Forcer le dernier point = solde actuel
  data[data.length - 1].solde = 8_850_000;
  return data;
}

const soldesQuotidiens = genererSoldeQuotidien();

const previsionsEntrees: PrevisionMensuel[] = [
  { libelle: "Ventes prévisionnelles juillet",    montant: 9_500_000, type: "entree" },
  { libelle: "Règlement créances clients",        montant: 3_200_000, type: "entree" },
  { libelle: "Remboursement TVA",                 montant: 450_000,   type: "entree" },
];

const previsionsSorties: PrevisionMensuel[] = [
  { libelle: "Salaires juillet",                  montant: 1_800_000, type: "sortie" },
  { libelle: "Fournisseurs SCIMA-BF & autres",    montant: 4_100_000, type: "sortie" },
  { libelle: "Loyers & charges locatives",        montant: 320_000,   type: "sortie" },
  { libelle: "Remboursement emprunt",             montant: 350_000,   type: "sortie" },
  { libelle: "Charges fiscales & sociales",       montant: 780_000,   type: "sortie" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function fmtDate(s: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(s));
}

// ─── Tooltip custom ──────────────────────────────────────────────────────────

interface TooltipPayloadItem { value: number; }
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="p-3 rounded-xl text-xs shadow-lg"
      style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
    >
      <p className="font-semibold mb-1">{label}</p>
      <p className="font-mono" style={{ color: "var(--cyan)" }}>
        Solde : {fmt(payload[0].value)}
      </p>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function TresoreriePage() {
  const [mounted, setMounted] = useState(false);
  const [seuilAlerte, setSeuilAlerte] = useState(1_000_000);
  const [editSeuil, setEditSeuil] = useState(false);
  const [seuilInput, setSeuilInput] = useState("1000000");

  useEffect(() => { setMounted(true); }, []);

  const soldeTotal = comptesBancaires.reduce((a, c) => a + c.solde, 0);
  const soldePositif = soldeTotal >= 0;
  const alerteActive = soldeTotal < seuilAlerte;

  const totalEntrees  = previsionsEntrees.reduce((a, p) => a + p.montant, 0);
  const totalSorties  = previsionsSorties.reduce((a, p) => a + p.montant, 0);
  const soldeProjecte = soldeTotal + totalEntrees - totalSorties;

  const handleSeuil = () => {
    const v = parseInt(seuilInput.replace(/\D/g, ""), 10);
    if (!isNaN(v) && v > 0) setSeuilAlerte(v);
    setEditSeuil(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5" style={{ color: "var(--cyan)" }} />
            <h1 className="text-2xl font-bold">Trésorerie</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            Suivi temps réel · 3 comptes bancaires · Juillet 2025
          </p>
        </div>
        <button
          onClick={() => setEditSeuil(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:opacity-80 no-print"
          style={{ borderColor: "var(--border2)", color: "var(--text2)", background: "var(--bg2)" }}
        >
          <Settings2 className="w-4 h-4" />
          Seuil d&apos;alerte : {fmt(seuilAlerte)}
        </button>
      </div>

      {/* ── Bannière alerte solde bas ────────────────────────────────────── */}
      {alerteActive && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold"
          style={{
            background: "rgba(245,158,11,0.1)",
            borderColor: "rgba(245,158,11,0.35)",
            color: "var(--amber)",
          }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          Attention : solde global ({fmt(soldeTotal)}) est en dessous du seuil d&apos;alerte ({fmt(seuilAlerte)})
        </div>
      )}

      {/* ── Modal seuil ─────────────────────────────────────────────────── */}
      {editSeuil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }}>
            <h3 className="font-bold">Modifier le seuil d&apos;alerte</h3>
            <input
              type="number"
              value={seuilInput}
              onChange={(e) => setSeuilInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
              style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)" }}
            />
            <div className="flex gap-3">
              <button onClick={() => setEditSeuil(false)} className="flex-1 py-2 rounded-xl text-sm border" style={{ borderColor: "var(--border2)", color: "var(--text2)" }}>Annuler</button>
              <button onClick={handleSeuil} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--gold)", color: "var(--navy)" }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Solde actuel + comptes ──────────────────────────────────────── */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Solde global */}
        <div
          className="md:col-span-1 p-6 rounded-2xl border flex flex-col justify-center"
          style={{
            background: soldePositif ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            borderColor: soldePositif ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
          }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text2)" }}>Solde global</p>
          <p
            className="text-3xl font-bold font-mono"
            style={{ color: soldePositif ? "var(--green)" : "var(--red)" }}
          >
            {fmt(soldeTotal)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text3)" }}>Tous comptes confondus</p>
        </div>

        {/* Comptes bancaires */}
        {comptesBancaires.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl border flex flex-col gap-2"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: c.couleur }} />
              <span className="text-xs font-semibold truncate" style={{ color: c.couleur }}>{c.banque}</span>
            </div>
            <p
              className="text-xl font-bold font-mono"
              style={{ color: c.solde >= 0 ? "var(--text)" : "var(--red)" }}
            >
              {fmt(c.solde)}
            </p>
            <p className="text-xs font-mono" style={{ color: "var(--text3)" }}>{c.numero}</p>
          </div>
        ))}
      </div>

      {/* ── AreaChart 90 jours ──────────────────────────────────────────── */}
      <div
        className="p-6 rounded-2xl border"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold">Évolution du solde</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>90 derniers jours</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--cyan)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--cyan)" }} />
            Solde quotidien
          </span>
        </div>
        {mounted ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={soldesQuotidiens} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00BCD4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00BCD4" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--text2)", fontSize: 10 }} axisLine={false} tickLine={false} interval={14} />
              <YAxis tick={{ fill: "var(--text2)", fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="solde" stroke="#00BCD4" strokeWidth={2} fill="url(#gradCyan)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-56 rounded-xl animate-pulse" style={{ background: "var(--bg3)" }} />
        )}
      </div>

      {/* ── Tableau mouvements récents ───────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Mouvements récents</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>10 dernières opérations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg3)", color: "var(--text3)" }}>
                <th className="text-left px-4 py-3 text-xs font-medium">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium">Libellé</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "var(--red)" }}>Débit</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "var(--green)" }}>Crédit</th>
                <th className="text-right px-4 py-3 text-xs font-medium">Solde après</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {mouvementsRecents.map((m, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: "var(--text2)" }}>
                    {fmtDate(m.date)}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      {m.type === "credit"
                        ? <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--green)" }} />
                        : <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--red)" }} />
                      }
                      <span className="truncate">{m.libelle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" style={{ color: m.debit > 0 ? "var(--red)" : "var(--text3)" }}>
                    {m.debit > 0 ? `- ${fmt(m.debit)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" style={{ color: m.credit > 0 ? "var(--green)" : "var(--text3)" }}>
                    {m.credit > 0 ? `+ ${fmt(m.credit)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold">
                    {fmt(m.soldeApres)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Prévisionnel 30 jours ───────────────────────────────────────── */}
      <div
        className="rounded-2xl border"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold">Prévisionnel — Juillet 2025</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>Estimation sur 30 jours</p>
        </div>
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "var(--border)" }}>
          {/* Entrées */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: "var(--green)" }} />
              <span className="font-semibold text-sm">Entrées prévues</span>
              <span className="ml-auto font-bold font-mono text-sm" style={{ color: "var(--green)" }}>{fmt(totalEntrees)}</span>
            </div>
            <div className="space-y-2.5">
              {previsionsEntrees.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--text2)" }}>{p.libelle}</span>
                  <span className="font-mono font-medium" style={{ color: "var(--green)" }}>+{fmt(p.montant)}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Sorties */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4" style={{ color: "var(--red)" }} />
              <span className="font-semibold text-sm">Sorties prévues</span>
              <span className="ml-auto font-bold font-mono text-sm" style={{ color: "var(--red)" }}>{fmt(totalSorties)}</span>
            </div>
            <div className="space-y-2.5">
              {previsionsSorties.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--text2)" }}>{p.libelle}</span>
                  <span className="font-mono font-medium" style={{ color: "var(--red)" }}>-{fmt(p.montant)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Solde projeté */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between"
          style={{ borderColor: "var(--border)", background: "var(--bg3)" }}
        >
          <span className="text-sm font-semibold">Solde projeté fin juillet</span>
          <span
            className="font-bold font-mono text-lg"
            style={{ color: soldeProjecte >= 0 ? "var(--green)" : "var(--red)" }}
          >
            {fmt(soldeProjecte)}
          </span>
        </div>
      </div>

    </div>
  );
}
