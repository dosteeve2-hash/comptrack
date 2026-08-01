const modules = [
  "Dashboard",
  "Clients",
  "Ventes",
  "Factures",
  "Depenses",
  "Inventaire",
  "Comptabilite",
  "Rapports",
  "Connecteurs",
];

export function GET() {
  return Response.json({
    name: "CompTrack Finance OS",
    version: "0.1.0",
    status: "prototype",
    modules,
    endpoints: ["/api/health", "/api/summary", "/api/export", "/api/manifest"],
    generatedAt: new Date().toISOString(),
  });
}
