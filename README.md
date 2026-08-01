# CompTrack Finance OS

CompTrack is a modern accounting and business operations prototype for shops,
agencies and high-cash-flow businesses. It combines clients, sales, invoices,
expenses, inventory, reporting, double-entry accounting previews and connector
management in one workspace.

## Run

```bash
npm run dev
npm run lint
npm run build
```

Local URL:

```text
http://127.0.0.1:3000
```

## Current Modules

- Dashboard with cash, sales, open invoices, margin and cash-flow chart.
- Clients with search and quick creation.
- Sales journal with quick sale entry.
- Invoices with quick generation and paid status action.
- Expenses with supplier, category and approval status.
- Inventory cards with reorder alerts.
- Accounting preview with double-entry ledger rows and quick balance.
- Reports with P&L, automations and compliance status.
- Connectors for payments, bank feeds, commerce and automation platforms.
- Browser local storage persistence and JSON export.
- API endpoints:
  - `/api/health`
  - `/api/manifest`
  - `/api/summary`
  - `/api/export`

## Interface Direction

- Premium dark command center with glass surfaces, strong hierarchy and dense SaaS layouts.
- Responsive module shell with grouped navigation, sticky command bar and global search.
- Motion layer with soft reveal animations, animated chart bars, hover elevation and accessible reduced-motion support.
- Built-in SVG icon system, avoiding extra UI dependencies while keeping controls readable.
- Local design primitives for badges, cards, tables, forms and action buttons.

## Production Roadmap

1. Add authentication, organizations, roles and two-factor authentication.
2. Add a database with migrations for clients, invoices, payments and ledger.
3. Implement server actions or API mutations with validation.
4. Generate invoice PDFs and email reminders.
5. Add bank/payment connectors such as Stripe and bank transaction feeds.
6. Add tax rules, jurisdiction mapping and reconciliation workflows.
7. Add audit logs, backups, import tools and accountant exports.

## Project Docs

- Architecture: `docs/ARCHITECTURE.md`
- Security notes: `docs/SECURITY.md`
- Environment template: `.env.example`
