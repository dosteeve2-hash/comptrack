import {
  automations,
  clients,
  complianceRules,
  connectors,
  expenses,
  invoices,
  ledgerPreview,
  products,
  sales,
} from "@/lib/comptrack-data";

export function GET() {
  return Response.json({
    exportedAt: new Date().toISOString(),
    version: "comptrack-demo-v1",
    clients,
    invoices,
    sales,
    expenses,
    products,
    ledgerPreview,
    connectors,
    automations,
    complianceRules,
  });
}
