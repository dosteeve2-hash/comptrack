export function GET() {
  return Response.json({
    ok: true,
    service: "comptrack-app",
    version: "0.1.0",
    checkedAt: new Date().toISOString(),
  });
}
