# Security Notes

CompTrack is not production-ready until authentication, authorization,
server-side validation and persistent audit logs are added.

## Current Controls

- Security headers are configured in `vercel.json`.
- API endpoints are read-only.
- Demo data is stored locally in the browser.
- No production secrets are committed.

## Required Before Production

1. Authentication with secure session handling.
2. Organization-level tenant isolation.
3. Role-based access control for finance operations.
4. Server-side validation for every create/update/delete flow.
5. Immutable audit log for invoices, payments, expenses and ledger entries.
6. Webhook signature verification for payment providers.
7. Backup and restore plan for accounting data.
8. Rate limiting on public API routes.

## Secret Handling

Use environment variables for all secrets. Do not expose private keys through
`NEXT_PUBLIC_*` variables.

Expected future secrets:

- `DATABASE_URL`
- `AUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
