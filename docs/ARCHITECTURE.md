# CompTrack Architecture

CompTrack is currently a single-tenant product prototype built on Next.js App
Router, React, TypeScript and Tailwind CSS v4.

## Current Layers

- `src/app`: application routes, metadata, API handlers and system states.
- `src/components`: interactive product shell and local UI primitives.
- `src/lib`: typed domain data, finance helpers and seed fixtures.
- `vercel.json`: deployment and security header configuration.
- `.github/workflows/ci.yml`: GitHub Actions lint/build pipeline.

## Runtime Shape

The interface is client-interactive and stores demo workspace state in browser
local storage. API endpoints expose read-only snapshots for health checks,
summary panels and export workflows.

Current endpoints:

- `GET /api/health`
- `GET /api/summary`
- `GET /api/export`

## Production Target

The next backend step is to replace mock data with persistent multi-tenant
storage:

1. Organizations and users.
2. Role-based permissions.
3. Clients, products, sales, invoices, expenses and payments.
4. Double-entry ledger tables.
5. Audit events for every business mutation.
6. Connectors for payment, banking, commerce and email.

## Suggested Data Model

- `organizations`
- `organization_members`
- `clients`
- `products`
- `sales`
- `invoices`
- `invoice_items`
- `expenses`
- `payments`
- `ledger_accounts`
- `ledger_entries`
- `ledger_lines`
- `audit_events`
- `connector_accounts`

## Security Principles

- Never trust client-side totals for production accounting.
- Validate every mutation on the server.
- Store money as integer minor units.
- Write immutable audit events for financial changes.
- Keep connector secrets server-side only.
- Separate read permissions from mutation permissions.
