export type Money = {
  amount: number;
  currency: "USD" | "EUR" | "TRY";
};

export type ClientStatus = "active" | "risk" | "vip";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  outstanding: Money;
  lastActivity: string;
  score: number;
};

export type Invoice = {
  id: string;
  client: string;
  issuedAt: string;
  dueAt: string;
  status: "draft" | "sent" | "paid" | "late";
  total: Money;
  taxRate: number;
  lineItems: number;
};

export type Sale = {
  id: string;
  channel: "Store" | "Online" | "B2B" | "Marketplace";
  client: string;
  product: string;
  quantity: number;
  total: Money;
  paidBy: "Cash" | "Card" | "Transfer";
  createdAt: string;
};

export type Expense = {
  id: string;
  vendor: string;
  category: "Inventory" | "Payroll" | "Rent" | "Marketing" | "Software" | "Tax";
  total: Money;
  status: "approved" | "pending" | "scheduled";
  date: string;
};

export type Product = {
  sku: string;
  name: string;
  stock: number;
  reorderAt: number;
  unitPrice: Money;
  margin: number;
};

export type CashflowPoint = {
  month: string;
  revenue: number;
  expense: number;
};

export type LedgerEntry = {
  label: string;
  debit: Money;
  credit: Money;
  account: string;
};

export type Connector = {
  name: string;
  category: "Banking" | "Payment" | "Commerce" | "Accounting" | "Automation";
  state: "ready" | "planned" | "needs-access";
  description: string;
};

export type Automation = {
  name: string;
  cadence: string;
  output: string;
  enabled: boolean;
};

export type ComplianceRule = {
  name: string;
  status: "ok" | "watch" | "missing";
  detail: string;
};

export const clients: Client[] = [
  {
    id: "CL-1001",
    name: "Nora Benali",
    company: "Atlas Market",
    email: "finance@atlas.example",
    status: "vip",
    outstanding: { amount: 12840, currency: "USD" },
    lastActivity: "Invoice paid today",
    score: 94,
  },
  {
    id: "CL-1002",
    name: "Kenji Sato",
    company: "Kyoto Supply",
    email: "kenji@kyotosupply.example",
    status: "active",
    outstanding: { amount: 4680, currency: "USD" },
    lastActivity: "Quote approved",
    score: 82,
  },
  {
    id: "CL-1003",
    name: "Maya Rossi",
    company: "Studio Forma",
    email: "maya@studioforma.example",
    status: "risk",
    outstanding: { amount: 2140, currency: "USD" },
    lastActivity: "Payment 8 days late",
    score: 59,
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-2026-1048",
    client: "Atlas Market",
    issuedAt: "2026-06-03",
    dueAt: "2026-06-17",
    status: "sent",
    total: { amount: 6840, currency: "USD" },
    taxRate: 0.08,
    lineItems: 4,
  },
  {
    id: "INV-2026-1047",
    client: "Kyoto Supply",
    issuedAt: "2026-06-02",
    dueAt: "2026-06-09",
    status: "paid",
    total: { amount: 3210, currency: "USD" },
    taxRate: 0.08,
    lineItems: 2,
  },
  {
    id: "INV-2026-1046",
    client: "Studio Forma",
    issuedAt: "2026-05-29",
    dueAt: "2026-06-05",
    status: "late",
    total: { amount: 2140, currency: "USD" },
    taxRate: 0.08,
    lineItems: 1,
  },
];

export const sales: Sale[] = [
  {
    id: "SALE-8841",
    channel: "Store",
    client: "Atlas Market",
    product: "Retail bundle",
    quantity: 18,
    total: { amount: 8640, currency: "USD" },
    paidBy: "Card",
    createdAt: "2026-06-03 09:42",
  },
  {
    id: "SALE-8842",
    channel: "Online",
    client: "Walk-in / Online",
    product: "Accessory pack",
    quantity: 37,
    total: { amount: 4210, currency: "USD" },
    paidBy: "Card",
    createdAt: "2026-06-03 11:15",
  },
  {
    id: "SALE-8843",
    channel: "B2B",
    client: "Kyoto Supply",
    product: "Wholesale case",
    quantity: 12,
    total: { amount: 5790, currency: "USD" },
    paidBy: "Transfer",
    createdAt: "2026-06-03 14:08",
  },
];

export const expenses: Expense[] = [
  {
    id: "EXP-4401",
    vendor: "Northline Logistics",
    category: "Inventory",
    total: { amount: 3180, currency: "USD" },
    status: "approved",
    date: "2026-06-03",
  },
  {
    id: "EXP-4402",
    vendor: "Team payroll",
    category: "Payroll",
    total: { amount: 9200, currency: "USD" },
    status: "scheduled",
    date: "2026-06-05",
  },
  {
    id: "EXP-4403",
    vendor: "Cloud tools",
    category: "Software",
    total: { amount: 640, currency: "USD" },
    status: "pending",
    date: "2026-06-02",
  },
];

export const products: Product[] = [
  {
    sku: "SKU-2201",
    name: "Retail bundle",
    stock: 126,
    reorderAt: 45,
    unitPrice: { amount: 480, currency: "USD" },
    margin: 0.41,
  },
  {
    sku: "SKU-2202",
    name: "Accessory pack",
    stock: 72,
    reorderAt: 80,
    unitPrice: { amount: 114, currency: "USD" },
    margin: 0.36,
  },
  {
    sku: "SKU-2203",
    name: "Wholesale case",
    stock: 38,
    reorderAt: 30,
    unitPrice: { amount: 482, currency: "USD" },
    margin: 0.44,
  },
];

export const cashflow: CashflowPoint[] = [
  { month: "Jan", revenue: 42000, expense: 23600 },
  { month: "Feb", revenue: 38600, expense: 25200 },
  { month: "Mar", revenue: 51200, expense: 28100 },
  { month: "Apr", revenue: 46800, expense: 27100 },
  { month: "May", revenue: 57300, expense: 30200 },
  { month: "Jun", revenue: 31800, expense: 18400 },
];

export const ledgerPreview: LedgerEntry[] = [
  {
    label: "Sale recorded",
    debit: { amount: 6840, currency: "USD" },
    credit: { amount: 6840, currency: "USD" },
    account: "Accounts receivable / Sales revenue",
  },
  {
    label: "Card processor fee",
    debit: { amount: 198, currency: "USD" },
    credit: { amount: 198, currency: "USD" },
    account: "Payment fees / Cash",
  },
  {
    label: "Inventory adjustment",
    debit: { amount: 1430, currency: "USD" },
    credit: { amount: 1430, currency: "USD" },
    account: "Cost of goods sold / Inventory",
  },
];

export const connectors: Connector[] = [
  {
    name: "Stripe",
    category: "Payment",
    state: "needs-access",
    description: "Collect card payments and sync fees, refunds, and payouts.",
  },
  {
    name: "Bank feed",
    category: "Banking",
    state: "planned",
    description: "Import transactions for reconciliation and cash-flow checks.",
  },
  {
    name: "Shopify",
    category: "Commerce",
    state: "ready",
    description: "Map orders, customers, products, discounts, and taxes.",
  },
  {
    name: "Zapier / Make",
    category: "Automation",
    state: "planned",
    description: "Trigger workflows for reminders, exports, and approvals.",
  },
];

export const automations: Automation[] = [
  {
    name: "Relance facture",
    cadence: "Every morning",
    output: "Email + task when an invoice is 3 days late",
    enabled: true,
  },
  {
    name: "Rapport cash-flow",
    cadence: "Friday 17:00",
    output: "PDF summary for owner and accountant",
    enabled: true,
  },
  {
    name: "Alerte stock",
    cadence: "Realtime",
    output: "Purchase request when stock crosses reorder level",
    enabled: false,
  },
];

export const complianceRules: ComplianceRule[] = [
  {
    name: "Audit trail",
    status: "ok",
    detail: "Every invoice, payment and expense keeps a traceable event.",
  },
  {
    name: "Tax mapping",
    status: "watch",
    detail: "Default rate is configured; jurisdiction-specific rules come next.",
  },
  {
    name: "User access",
    status: "missing",
    detail: "Needs authentication provider before production use.",
  },
];

export const formatMoney = ({ amount, currency }: Money) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const sumMoney = (items: Money[], currency: Money["currency"] = "USD") => ({
  amount: items.reduce((total, item) => total + item.amount, 0),
  currency,
});
