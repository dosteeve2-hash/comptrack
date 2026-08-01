"use client";

import {
  CSSProperties,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  automations,
  cashflow,
  clients as seedClients,
  complianceRules,
  connectors,
  expenses as seedExpenses,
  formatMoney,
  invoices as seedInvoices,
  ledgerPreview,
  products,
  sales as seedSales,
  sumMoney,
  type Client,
  type Expense,
  type Invoice,
  type Money,
  type Sale,
} from "@/lib/comptrack-data";

type Module =
  | "Dashboard"
  | "Clients"
  | "Ventes"
  | "Factures"
  | "Depenses"
  | "Inventaire"
  | "Comptabilite"
  | "Rapports"
  | "Connecteurs";

type IconName =
  | "activity"
  | "bank"
  | "box"
  | "chart"
  | "check"
  | "client"
  | "download"
  | "file"
  | "grid"
  | "invoice"
  | "lock"
  | "plus"
  | "refresh"
  | "search"
  | "settings"
  | "spark"
  | "wallet";

type DashboardTotals = {
  revenue: Money;
  expenseTotal: Money;
  openInvoices: Money;
  cash: Money;
  margin: number;
};

type WorkspaceSnapshot = {
  clients: Client[];
  invoices: Invoice[];
  sales: Sale[];
  expenses: Expense[];
};

const storageKey = "comptrack.workspace.v2";

const navGroups: Array<{ title: string; items: Array<{ name: Module; icon: IconName }> }> = [
  {
    title: "Pilotage",
    items: [{ name: "Dashboard", icon: "grid" }],
  },
  {
    title: "Operations",
    items: [
      { name: "Clients", icon: "client" },
      { name: "Ventes", icon: "wallet" },
      { name: "Factures", icon: "invoice" },
      { name: "Depenses", icon: "file" },
      { name: "Inventaire", icon: "box" },
    ],
  },
  {
    title: "Finance OS",
    items: [
      { name: "Comptabilite", icon: "bank" },
      { name: "Rapports", icon: "chart" },
      { name: "Connecteurs", icon: "settings" },
    ],
  },
];

const moduleCopy: Record<Module, { title: string; eyebrow: string; description: string }> = {
  Dashboard: {
    title: "Cockpit financier",
    eyebrow: "Live command center",
    description:
      "Vue consolidee du cash, des ventes, des creances, du risque client et des operations critiques.",
  },
  Clients: {
    title: "Clients & comptes",
    eyebrow: "CRM financier",
    description:
      "Suivi des contacts, encours, score de risque, historique et creation rapide de nouveaux comptes.",
  },
  Ventes: {
    title: "Ventes omnicanales",
    eyebrow: "Revenue engine",
    description:
      "Capture des ventes boutique, web, B2B et marketplace avec preparation des ecritures comptables.",
  },
  Factures: {
    title: "Facturation intelligente",
    eyebrow: "Billing desk",
    description:
      "Generation de factures, suivi des echeances, relances et paiement en un seul flux.",
  },
  Depenses: {
    title: "Depenses & fournisseurs",
    eyebrow: "Spend control",
    description:
      "Controle des sorties de cash, categorisation, approbations et preparation du rapprochement bancaire.",
  },
  Inventaire: {
    title: "Inventaire & marge",
    eyebrow: "Stock intelligence",
    description:
      "Surveillance du stock, seuils de reapprovisionnement, prix unitaire et marges par produit.",
  },
  Comptabilite: {
    title: "Comptabilite en partie double",
    eyebrow: "Ledger core",
    description:
      "Preview des ecritures, balance rapide, comptes et logique de journalisation pour une future base robuste.",
  },
  Rapports: {
    title: "Rapports & automatisations",
    eyebrow: "Executive reporting",
    description:
      "P&L instantane, automatisations operationnelles, conformite et signaux pour decision rapide.",
  },
  Connecteurs: {
    title: "Ecosysteme connecte",
    eyebrow: "Integrations hub",
    description:
      "Paiements, banques, commerce et automatisations prets a etre branches au noyau comptable.",
  },
};

const maxCashflow = Math.max(
  ...cashflow.flatMap((point) => [point.revenue, point.expense]),
);

function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    activity: <path d="M4 12h3l2-6 4 12 2-6h5" />,
    bank: <path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M4 18h16M12 3l8 5H4z" />,
    box: <path d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10" />,
    chart: <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-9" />,
    check: <path d="M20 6 9 17l-5-5" />,
    client: <path d="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 21v-2a3 3 0 0 0-2-3" />,
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />,
    file: <path d="M7 3h7l5 5v13H7zM14 3v6h5M9 14h6M9 17h6" />,
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    invoice: <path d="M7 3h10v18l-2-1-2 1-2-1-2 1-2-1zM9 8h6M9 12h6M9 16h4" />,
    lock: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    refresh: <path d="M20 6v5h-5M4 18v-5h5M18 11a6 6 0 0 0-10-4L4 11m16 2-4 4a6 6 0 0 1-10-4" />,
    search: <path d="m21 21-4-4M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15" />,
    settings: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 12h2m12 0h2M12 4v2m0 12v2m-5.7-2.3 1.4-1.4m8.6-8.6 1.4-1.4m0 11.4-1.4-1.4M7.7 7.7 6.3 6.3" />,
    spark: <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6zM19 15l.8 3.2L23 19l-3.2.8L19 23l-.8-3.2L15 19l3.2-.8z" />,
    wallet: <path d="M4 7h14a2 2 0 0 1 2 2v9H4zM4 7l2-3h12v3M16 13h4" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function toneClass(status: string) {
  const normalized = status.toLowerCase();

  if (["vip", "paid", "approved", "ready", "ok"].some((item) => normalized.includes(item))) {
    return "border-emerald-400/25 bg-emerald-400/12 text-emerald-200";
  }

  if (["late", "missing", "risk", "needs-access"].some((item) => normalized.includes(item))) {
    return "border-rose-400/25 bg-rose-400/12 text-rose-200";
  }

  if (["pending", "watch", "planned"].some((item) => normalized.includes(item))) {
    return "border-amber-400/25 bg-amber-400/12 text-amber-200";
  }

  if (["sent", "scheduled", "active"].some((item) => normalized.includes(item))) {
    return "border-sky-400/25 bg-sky-400/12 text-sky-200";
  }

  return "border-white/10 bg-white/7 text-zinc-300";
}

function Badge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClass(label)}`}
    >
      {label.replace("-", " ")}
    </span>
  );
}

function ShellCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={`surface-card reveal ${className}`} style={style}>
      {children}
    </section>
  );
}

function GhostButton({
  children,
  icon,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  icon?: IconName;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-100 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
      onClick={onClick}
      type={type}
    >
      {icon ? <Icon name={icon} /> : null}
      {children}
    </button>
  );
}

function PrimaryButton({
  children,
  icon,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  icon?: IconName;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 text-sm font-semibold text-zinc-950 shadow-[0_18px_45px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-200"
      onClick={onClick}
      type={type}
    >
      {icon ? <Icon name={icon} /> : null}
      {children}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-300">
      {label}
      <input
        className="h-11 rounded-2xl border border-white/10 bg-zinc-950/55 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300 focus:bg-zinc-950"
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-300">
      {label}
      <select
        className="h-11 rounded-2xl border border-white/10 bg-zinc-950/55 px-4 text-sm text-white outline-none transition focus:border-cyan-300 focus:bg-zinc-950"
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Array<ReactNode>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
                key={column}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="transition hover:bg-white/[0.03]" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td className="border-b border-white/10 px-4 py-4 text-zinc-300" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompTrackApp() {
  const [activeModule, setActiveModule] = useState<Module>("Dashboard");
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices);
  const [sales, setSales] = useState<Sale[]>(seedSales);
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);
  const [notice, setNotice] = useState("Workspace pret: donnees de demo chargees.");

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);

      if (!saved) {
        return;
      }

      try {
        const parsed = JSON.parse(saved) as WorkspaceSnapshot;
        setClients(parsed.clients ?? seedClients);
        setInvoices(parsed.invoices ?? seedInvoices);
        setSales(parsed.sales ?? seedSales);
        setExpenses(parsed.expenses ?? seedExpenses);
        setNotice("Workspace restaure depuis la sauvegarde locale.");
      } catch {
        setNotice("Sauvegarde locale illisible: donnees de demo conservees.");
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    const snapshot: WorkspaceSnapshot = { clients, invoices, sales, expenses };
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  }, [clients, expenses, invoices, sales]);

  const totals = useMemo(() => {
    const revenue = sumMoney(sales.map((sale) => sale.total));
    const expenseTotal = sumMoney(expenses.map((expense) => expense.total));
    const openInvoices = sumMoney(
      invoices
        .filter((invoice) => invoice.status !== "paid")
        .map((invoice) => invoice.total),
    );
    const cash = {
      amount: 184920 + revenue.amount - expenseTotal.amount,
      currency: "USD" as const,
    };
    const margin = revenue.amount
      ? ((revenue.amount - expenseTotal.amount) / revenue.amount) * 100
      : 0;

    return { revenue, expenseTotal, openInvoices, cash, margin };
  }, [expenses, invoices, sales]);

  const filteredClients = clients.filter((client) =>
    `${client.company} ${client.name} ${client.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const filteredInvoices = invoices.filter((invoice) =>
    `${invoice.id} ${invoice.client} ${invoice.status}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  function addClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("company") || "").trim();
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();

    if (!company || !name) {
      setNotice("Client incomplet: entreprise et contact requis.");
      return;
    }

    setClients((current) => [
      {
        id: `CL-${1001 + current.length}`,
        company,
        name,
        email: email || "contact@example.com",
        status: "active",
        outstanding: { amount: 0, currency: "USD" },
        lastActivity: "Created just now",
        score: 76,
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setNotice(`Client ${company} ajoute.`);
  }

  function addInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const client = String(data.get("client") || clients[0]?.company || "Client");
    const amount = Number(data.get("amount") || 0);

    if (amount <= 0) {
      setNotice("Facture refusee: le montant doit etre positif.");
      return;
    }

    setInvoices((current) => [
      {
        id: `INV-2026-${1049 + current.length}`,
        client,
        issuedAt: "2026-06-24",
        dueAt: "2026-07-08",
        status: "sent",
        total: { amount, currency: "USD" },
        taxRate: 0.08,
        lineItems: 1,
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setNotice(`Facture de ${formatMoney({ amount, currency: "USD" })} envoyee.`);
  }

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const vendor = String(data.get("vendor") || "").trim();
    const amount = Number(data.get("amount") || 0);
    const category = String(data.get("category") || "Software") as Expense["category"];

    if (!vendor || amount <= 0) {
      setNotice("Depense incomplete: fournisseur et montant requis.");
      return;
    }

    setExpenses((current) => [
      {
        id: `EXP-${4404 + current.length}`,
        vendor,
        category,
        total: { amount, currency: "USD" },
        status: "pending",
        date: "2026-06-24",
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setNotice(`Depense ${vendor} ajoutee.`);
  }

  function addSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const product = String(data.get("product") || products[0].name);
    const client = String(data.get("client") || "Walk-in / Online");
    const amount = Number(data.get("amount") || 0);
    const quantity = Number(data.get("quantity") || 1);

    if (amount <= 0 || quantity <= 0) {
      setNotice("Vente incomplete: montant et quantite requis.");
      return;
    }

    setSales((current) => [
      {
        id: `SALE-${8844 + current.length}`,
        channel: "Store",
        client,
        product,
        quantity,
        total: { amount, currency: "USD" },
        paidBy: "Cash",
        createdAt: "2026-06-24 14:30",
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setNotice(`Vente ${product} enregistree.`);
  }

  function markPaid(id: string) {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "paid" } : invoice,
      ),
    );
    setNotice(`${id} marquee comme payee.`);
  }

  function exportWorkspace() {
    const payload = JSON.stringify(
      { clients, invoices, sales, expenses, exportedAt: new Date().toISOString() },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "comptrack-workspace.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Export JSON genere.");
  }

  function resetWorkspace() {
    setClients(seedClients);
    setInvoices(seedInvoices);
    setSales(seedSales);
    setExpenses(seedExpenses);
    window.localStorage.removeItem(storageKey);
    setNotice("Workspace remis a zero.");
  }

  const currentCopy = moduleCopy[activeModule];

  return (
    <main className="min-h-screen overflow-hidden bg-[#080a0d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_22%),radial-gradient(circle_at_70%_95%,rgba(16,185,129,0.12),transparent_26%)]" />
      <div className="grid min-h-screen lg:grid-cols-[304px_1fr]">
        <aside className="border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-2xl lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                <span className="absolute inset-0 rounded-2xl bg-cyan-300/20 blur-xl" />
                <Icon className="relative h-5 w-5" name="spark" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
                  CompTrack
                </p>
                <h1 className="text-xl font-semibold tracking-tight text-white">Finance OS</h1>
              </div>
            </div>
            <Badge label="v1 lab" />
          </div>

          <nav className="mt-7 grid gap-6 md:grid-cols-3 lg:grid-cols-1">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                  {group.title}
                </p>
                <div className="mt-3 grid gap-2">
                  {group.items.map((item) => {
                    const isActive = activeModule === item.name;
                    return (
                      <button
                        className={`group flex h-11 items-center justify-between rounded-2xl px-3 text-left text-sm transition ${
                          isActive
                            ? "bg-white text-zinc-950 shadow-[0_16px_45px_rgba(255,255,255,0.12)]"
                            : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                        }`}
                        key={item.name}
                        onClick={() => setActiveModule(item.name)}
                        type="button"
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 ${isActive ? "text-zinc-950" : "text-cyan-300/70"}`}
                            name={item.icon}
                          />
                          {item.name}
                        </span>
                        {isActive ? <span className="h-2 w-2 rounded-full bg-cyan-400" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-7 rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Security posture</p>
              <Icon className="h-4 w-4 text-emerald-300" name="lock" />
            </div>
            <div className="mt-4 grid gap-3 text-sm text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Audit log</span>
                <span className="text-emerald-300">Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Roles</span>
                <span className="text-sky-300">Modeled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>2FA</span>
                <span className="text-amber-300">Next</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080a0d]/80 px-4 py-4 backdrop-blur-2xl lg:px-7">
            <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  {currentCopy.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {currentCopy.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                  {currentCopy.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="relative block min-w-0 lg:w-80">
                  <Icon
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                    name="search"
                  />
                  <input
                    className="h-11 w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search clients, invoices, sales..."
                    value={query}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <GhostButton icon="download" onClick={exportWorkspace}>
                    Export
                  </GhostButton>
                  <GhostButton icon="refresh" onClick={resetWorkspace}>
                    Reset
                  </GhostButton>
                  <PrimaryButton icon="plus" onClick={() => setActiveModule("Factures")}>
                    Invoice
                  </PrimaryButton>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-4 py-2 text-sm text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.8)]" />
              {notice}
            </div>
          </header>

          <div className="px-4 py-5 lg:px-7">
            {activeModule === "Dashboard" && (
              <Dashboard
                clients={clients}
                expenses={expenses}
                invoices={invoices}
                sales={sales}
                totals={totals}
              />
            )}
            {activeModule === "Clients" && (
              <ClientsModule clients={filteredClients} onAddClient={addClient} />
            )}
            {activeModule === "Ventes" && (
              <SalesModule clients={clients} onAddSale={addSale} sales={sales} />
            )}
            {activeModule === "Factures" && (
              <InvoicesModule
                clients={clients}
                invoices={filteredInvoices}
                onAddInvoice={addInvoice}
                onMarkPaid={markPaid}
              />
            )}
            {activeModule === "Depenses" && (
              <ExpensesModule expenses={expenses} onAddExpense={addExpense} />
            )}
            {activeModule === "Inventaire" && <InventoryModule />}
            {activeModule === "Comptabilite" && <AccountingModule totals={totals} />}
            {activeModule === "Rapports" && <ReportsModule totals={totals} />}
            {activeModule === "Connecteurs" && <ConnectorsModule />}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone: string;
}) {
  return (
    <ShellCard className="group overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-zinc-400">{detail}</p>
        </div>
        <div className={`rounded-2xl border p-3 ${tone}`}>
          <Icon className="h-5 w-5" name={icon} />
        </div>
      </div>
    </ShellCard>
  );
}

function Dashboard({
  clients,
  expenses,
  invoices,
  sales,
  totals,
}: {
  clients: Client[];
  expenses: Expense[];
  invoices: Invoice[];
  sales: Sale[];
  totals: DashboardTotals;
}) {
  const openInvoiceCount = invoices.filter((invoice) => invoice.status !== "paid").length;
  const riskClients = clients.filter((client) => client.status === "risk").length;

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          detail="+12.4% rolling month"
          icon="wallet"
          label="Cash disponible"
          tone="border-cyan-300/25 bg-cyan-300/12 text-cyan-100"
          value={formatMoney(totals.cash)}
        />
        <MetricCard
          detail={`${sales.length} transactions today`}
          icon="activity"
          label="Ventes"
          tone="border-emerald-300/25 bg-emerald-300/12 text-emerald-100"
          value={formatMoney(totals.revenue)}
        />
        <MetricCard
          detail={`${openInvoiceCount} invoices to collect`}
          icon="invoice"
          label="Creances"
          tone="border-amber-300/25 bg-amber-300/12 text-amber-100"
          value={formatMoney(totals.openInvoices)}
        />
        <MetricCard
          detail={`${riskClients} account needs attention`}
          icon="chart"
          label="Marge nette"
          tone="border-violet-300/25 bg-violet-300/12 text-violet-100"
          value={`${totals.margin.toFixed(1)}%`}
        />
      </section>

      <section className="grid gap-5 2xl:grid-cols-[1.25fr_0.75fr]">
        <ShellCard className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Treasury graph
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Cash-flow six mois</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Comparaison revenus / depenses avec lecture immediate des cycles.
              </p>
            </div>
            <div className="flex gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-cyan-300" /> Revenue
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-rose-300" /> Expense
              </span>
            </div>
          </div>

          <div className="mt-6 grid h-80 grid-cols-6 items-end gap-3 rounded-[28px] border border-white/10 bg-black/20 p-4">
            {cashflow.map((point, index) => (
              <div
                className="flex h-full flex-col justify-end gap-3"
                key={point.month}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="grid flex-1 grid-cols-2 items-end gap-1">
                  <div
                    className="chart-bar rounded-t-xl bg-cyan-300/85"
                    style={{ height: `${(point.revenue / maxCashflow) * 100}%` }}
                    title={`Revenue ${point.revenue}`}
                  />
                  <div
                    className="chart-bar rounded-t-xl bg-rose-300/75"
                    style={{ height: `${(point.expense / maxCashflow) * 100}%` }}
                    title={`Expense ${point.expense}`}
                  />
                </div>
                <span className="text-center text-xs font-medium text-zinc-500">{point.month}</span>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Operating pulse
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Timeline live</h3>
            </div>
            <Badge label="scheduled" />
          </div>
          <div className="mt-6 grid gap-3">
            {[
              ["09:42", "Store sale captured", "Retail bundle - card payment"],
              ["11:15", "Online order synced", "Accessory pack - Shopify ready"],
              ["14:08", "Invoice generated", "Kyoto Supply - net 7"],
              ["16:30", "Reconciliation queue", "3 payments need matching"],
            ].map(([time, title, detail]) => (
              <div
                className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.045]"
                key={time}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{title}</p>
                  <span className="font-mono text-xs text-zinc-500">{time}</span>
                </div>
                <p className="mt-1 text-sm text-zinc-400">{detail}</p>
              </div>
            ))}
          </div>
        </ShellCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <ShellCard className="p-5">
          <h3 className="text-lg font-semibold text-white">Risque client</h3>
          <div className="mt-4 grid gap-3">
            {clients.map((client) => (
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4" key={client.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{client.company}</p>
                    <p className="mt-1 text-sm text-zinc-400">{client.lastActivity}</p>
                  </div>
                  <Badge label={client.status} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-rose-300 via-amber-300 to-emerald-300"
                    style={{ width: `${client.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="p-5">
          <h3 className="text-lg font-semibold text-white">Ventes recentes</h3>
          <div className="mt-4 grid gap-3">
            {sales.slice(0, 4).map((sale) => (
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-4" key={sale.id}>
                <div>
                  <p className="font-semibold text-white">{sale.product}</p>
                  <p className="text-sm text-zinc-400">{sale.channel} - {sale.client}</p>
                </div>
                <p className="font-semibold text-emerald-200">{formatMoney(sale.total)}</p>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="p-5">
          <h3 className="text-lg font-semibold text-white">Depenses recentes</h3>
          <div className="mt-4 grid gap-3">
            {expenses.slice(0, 4).map((expense) => (
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-4" key={expense.id}>
                <div>
                  <p className="font-semibold text-white">{expense.vendor}</p>
                  <p className="text-sm text-zinc-400">{expense.category}</p>
                </div>
                <p className="font-semibold text-rose-200">{formatMoney(expense.total)}</p>
              </div>
            ))}
          </div>
        </ShellCard>
      </section>
    </div>
  );
}

function ClientsModule({
  clients,
  onAddClient,
}: {
  clients: Client[];
  onAddClient: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[0.8fr_1.2fr]">
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Nouveau client</h3>
        <p className="mt-2 text-sm text-zinc-400">Ajoute un compte, son contact et sa fiche risque.</p>
        <form className="mt-5 grid gap-4" onSubmit={onAddClient}>
          <Field label="Entreprise" name="company" placeholder="Ex: Nova Retail" />
          <Field label="Contact" name="name" placeholder="Nom du responsable" />
          <Field label="Email" name="email" placeholder="finance@example.com" type="email" />
          <PrimaryButton icon="plus" type="submit">Ajouter client</PrimaryButton>
        </form>
      </ShellCard>

      <ShellCard className="p-0">
        <div className="border-b border-white/10 p-5">
          <h3 className="text-xl font-semibold text-white">Portefeuille clients</h3>
          <p className="mt-2 text-sm text-zinc-400">Vue relationnelle, scoring et encours.</p>
        </div>
        <MiniTable
          columns={["Compte", "Contact", "Encours", "Score", "Statut"]}
          rows={clients.map((client) => [
            <div key={`${client.id}-account`}>
              <p className="font-semibold text-white">{client.company}</p>
              <p className="font-mono text-xs text-zinc-500">{client.id}</p>
            </div>,
            <div key={`${client.id}-contact`}>
              <p>{client.name}</p>
              <p className="text-xs text-zinc-500">{client.email}</p>
            </div>,
            formatMoney(client.outstanding),
            `${client.score}/100`,
            <Badge key={`${client.id}-badge`} label={client.status} />,
          ])}
        />
      </ShellCard>
    </div>
  );
}

function SalesModule({
  clients,
  onAddSale,
  sales,
}: {
  clients: Client[];
  onAddSale: (event: FormEvent<HTMLFormElement>) => void;
  sales: Sale[];
}) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[0.8fr_1.2fr]">
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Capture vente</h3>
        <p className="mt-2 text-sm text-zinc-400">Enregistre une vente et prepare le flux facture/paiement.</p>
        <form className="mt-5 grid gap-4" onSubmit={onAddSale}>
          <SelectField label="Client" name="client" options={["Walk-in / Online", ...clients.map((client) => client.company)]} />
          <SelectField label="Produit" name="product" options={products.map((product) => product.name)} />
          <Field label="Quantite" name="quantity" type="number" />
          <Field label="Montant" name="amount" type="number" />
          <PrimaryButton icon="check" type="submit">Enregistrer vente</PrimaryButton>
        </form>
      </ShellCard>
      <ShellCard className="p-0">
        <div className="border-b border-white/10 p-5">
          <h3 className="text-xl font-semibold text-white">Journal des ventes</h3>
          <p className="mt-2 text-sm text-zinc-400">Transactions par canal et moyen de paiement.</p>
        </div>
        <MiniTable
          columns={["ID", "Canal", "Client", "Produit", "Paiement", "Total"]}
          rows={sales.map((sale) => [
            <span className="font-mono text-xs" key={`${sale.id}-id`}>{sale.id}</span>,
            sale.channel,
            sale.client,
            `${sale.quantity} x ${sale.product}`,
            sale.paidBy,
            formatMoney(sale.total),
          ])}
        />
      </ShellCard>
    </div>
  );
}

function InvoicesModule({
  clients,
  invoices,
  onAddInvoice,
  onMarkPaid,
}: {
  clients: Client[];
  invoices: Invoice[];
  onAddInvoice: (event: FormEvent<HTMLFormElement>) => void;
  onMarkPaid: (id: string) => void;
}) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[0.8fr_1.2fr]">
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Nouvelle facture</h3>
        <p className="mt-2 text-sm text-zinc-400">Cree une facture et declenche le suivi de paiement.</p>
        <form className="mt-5 grid gap-4" onSubmit={onAddInvoice}>
          <SelectField label="Client" name="client" options={clients.map((client) => client.company)} />
          <Field label="Montant HT" name="amount" type="number" />
          <PrimaryButton icon="invoice" type="submit">Envoyer facture</PrimaryButton>
        </form>
      </ShellCard>
      <ShellCard className="p-0">
        <div className="border-b border-white/10 p-5">
          <h3 className="text-xl font-semibold text-white">Factures</h3>
          <p className="mt-2 text-sm text-zinc-400">Echeances, statuts et action paiement.</p>
        </div>
        <MiniTable
          columns={["ID", "Client", "Emission", "Echeance", "Total", "Statut", "Action"]}
          rows={invoices.map((invoice) => [
            <span className="font-mono text-xs" key={`${invoice.id}-id`}>{invoice.id}</span>,
            invoice.client,
            invoice.issuedAt,
            invoice.dueAt,
            formatMoney(invoice.total),
            <Badge key={`${invoice.id}-status`} label={invoice.status} />,
            <button
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-200 transition hover:border-cyan-300/40 hover:text-cyan-100 disabled:opacity-40"
              disabled={invoice.status === "paid"}
              key={`${invoice.id}-action`}
              onClick={() => onMarkPaid(invoice.id)}
              type="button"
            >
              Payee
            </button>,
          ])}
        />
      </ShellCard>
    </div>
  );
}

function ExpensesModule({
  expenses,
  onAddExpense,
}: {
  expenses: Expense[];
  onAddExpense: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[0.8fr_1.2fr]">
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Nouvelle depense</h3>
        <p className="mt-2 text-sm text-zinc-400">Controle les sorties et prepare la reconciliation.</p>
        <form className="mt-5 grid gap-4" onSubmit={onAddExpense}>
          <Field label="Fournisseur" name="vendor" />
          <SelectField label="Categorie" name="category" options={["Inventory", "Payroll", "Rent", "Marketing", "Software", "Tax"]} />
          <Field label="Montant" name="amount" type="number" />
          <PrimaryButton icon="plus" type="submit">Ajouter depense</PrimaryButton>
        </form>
      </ShellCard>
      <ShellCard className="p-0">
        <div className="border-b border-white/10 p-5">
          <h3 className="text-xl font-semibold text-white">Depenses</h3>
          <p className="mt-2 text-sm text-zinc-400">Fournisseurs, categories, dates et statuts.</p>
        </div>
        <MiniTable
          columns={["ID", "Fournisseur", "Categorie", "Date", "Total", "Statut"]}
          rows={expenses.map((expense) => [
            <span className="font-mono text-xs" key={`${expense.id}-id`}>{expense.id}</span>,
            expense.vendor,
            expense.category,
            expense.date,
            formatMoney(expense.total),
            <Badge key={`${expense.id}-status`} label={expense.status} />,
          ])}
        />
      </ShellCard>
    </div>
  );
}

function InventoryModule() {
  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {products.map((product) => {
        const ratio = Math.min(100, (product.stock / (product.reorderAt * 2)) * 100);
        const state = product.stock <= product.reorderAt ? "watch" : "ok";
        return (
          <ShellCard className="p-5" key={product.sku}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-zinc-500">{product.sku}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{product.name}</h3>
              </div>
              <Badge label={state} />
            </div>
            <div className="mt-6 h-3 rounded-full bg-white/10">
              <div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${ratio}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/[0.04] p-3">
                <p className="text-xs text-zinc-500">Stock</p>
                <p className="mt-1 font-semibold text-white">{product.stock}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.04] p-3">
                <p className="text-xs text-zinc-500">Prix</p>
                <p className="mt-1 font-semibold text-white">{formatMoney(product.unitPrice)}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.04] p-3">
                <p className="text-xs text-zinc-500">Marge</p>
                <p className="mt-1 font-semibold text-white">{Math.round(product.margin * 100)}%</p>
              </div>
            </div>
          </ShellCard>
        );
      })}
    </div>
  );
}

function AccountingModule({ totals }: { totals: DashboardTotals }) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[1.1fr_0.9fr]">
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Ledger preview</h3>
        <p className="mt-2 text-sm text-zinc-400">Ecritures en partie double pretes pour une future table journal.</p>
        <div className="mt-5 grid gap-3">
          {ledgerPreview.map((entry) => (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4" key={entry.label}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{entry.label}</p>
                  <p className="mt-1 text-sm text-zinc-500">{entry.account}</p>
                </div>
                <p className="font-semibold text-cyan-100">{formatMoney(entry.credit)}</p>
              </div>
            </div>
          ))}
        </div>
      </ShellCard>
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Balance rapide</h3>
        <div className="mt-5 grid gap-3">
          <BalanceRow label="Revenus" value={formatMoney(totals.revenue)} />
          <BalanceRow label="Depenses" value={formatMoney(totals.expenseTotal)} />
          <BalanceRow label="Creances" value={formatMoney(totals.openInvoices)} />
          <BalanceRow label="Cash simule" value={formatMoney(totals.cash)} />
        </div>
      </ShellCard>
    </div>
  );
}

function ReportsModule({ totals }: { totals: DashboardTotals }) {
  return (
    <div className="grid gap-5 2xl:grid-cols-3">
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">P&L instantane</h3>
        <div className="mt-5 grid gap-3">
          <BalanceRow label="Revenue" value={formatMoney(totals.revenue)} />
          <BalanceRow label="Expenses" value={formatMoney(totals.expenseTotal)} />
          <BalanceRow label="Margin" value={`${totals.margin.toFixed(1)}%`} />
        </div>
      </ShellCard>
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Automatisations</h3>
        <div className="mt-5 grid gap-3">
          {automations.map((automation) => (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4" key={automation.name}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-white">{automation.name}</p>
                <Badge label={automation.enabled ? "ok" : "planned"} />
              </div>
              <p className="mt-2 text-sm text-zinc-400">{automation.cadence} - {automation.output}</p>
            </div>
          ))}
        </div>
      </ShellCard>
      <ShellCard className="p-5">
        <h3 className="text-xl font-semibold text-white">Conformite</h3>
        <div className="mt-5 grid gap-3">
          {complianceRules.map((rule) => (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4" key={rule.name}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-white">{rule.name}</p>
                <Badge label={rule.status} />
              </div>
              <p className="mt-2 text-sm text-zinc-400">{rule.detail}</p>
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

function ConnectorsModule() {
  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
      {connectors.map((connector, index) => (
        <ShellCard
          className="p-5"
          key={connector.name}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-200">
              <Icon name={connector.category === "Banking" ? "bank" : connector.category === "Payment" ? "wallet" : "settings"} />
            </div>
            <Badge label={connector.state} />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-white">{connector.name}</h3>
          <p className="mt-1 text-sm text-zinc-500">{connector.category}</p>
          <p className="mt-4 min-h-24 text-sm leading-6 text-zinc-400">{connector.description}</p>
          <GhostButton icon="settings">Configurer</GhostButton>
        </ShellCard>
      ))}
    </div>
  );
}

function BalanceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
