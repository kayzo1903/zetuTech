# Full Website Structure — Monolith + DDD (Next.js + TypeScript)

Below is a complete, practical, **monolithic DDD** folder + file architecture for **ZetuTech** built on **Next.js (app dir)** with TypeScript, **shadcn** UI, **zod** validation, **Drizzle** / Neon (or Prisma) for DB, Redis + BullMQ for jobs, **pnpm** as package manager, **Turbo** for monorepo orchestration, **Resend** for email delivery, and adapters for MPESA/TigoPesa/AirtelMoney. This is purposely modular: every bounded context lives in its own module (domain + application + infra) so your monolith is easy to split later.

## Table of Contents

- [Project root (high-level)](#project-root-high-level)
- [Bounded contexts & folder responsibilities](#bounded-contexts--folder-responsibilities)
- [Full module list (bounded contexts)](#full-module-list-bounded-contexts)
- [Frontend (Next.js app folder) — structure](#frontend-nextjs-app-folder--structure)
- [API design (serverless/app routes) — canonical routes](#api-design-serverlessapp-routes--canonical-routes)
- [Shared services & cross-cutting concerns](#shared-services--cross-cutting-concerns)
- [i18n & localization](#i18n--localization)
- [UI components (shadcn)](#ui-components-shadcn)
- [Workers (background tasks)](#workers-background-tasks)
- [Tests](#tests)
- [CI / CD (basic)](#ci--cd-basic)
- [Security & compliance (short list)](#security--compliance-short-list)
- [Roadmap: from MVP -> scale](#roadmap-from-mvp---scale)

---

I'll start with a high-level tree, then explain each folder's purpose, key files, important patterns (aggregates, services, repos, commands), API routes, i18n, and dev/devops notes. I'll include short example stubs for crucial pieces (zod schemas, payment adapter interface, sample API route).

---

## Development Stack

- **Package Manager**: pnpm (fast, space-efficient, lockfile by default)
- **Monorepo Orchestration**: Turbo (parallel builds, smart caching)
- **Email Service**: Resend (transactional emails, Tanzania-friendly)
- **Domain**: zetutech.co.tz (primary) | api.zetutech.co.tz (API backend)

---

# Project root (high-level)

```
/zetutech
├─ .github/
├─ .env.example
├─ pnpm-workspace.yaml    # pnpm workspaces configuration
├─ turbo.json             # Turbo build orchestration config
├─ package.json
├─ pnpm-lock.yaml         # pnpm lockfile (auto-generated)
├─ tsconfig.json
├─ next.config.js
├─ prisma/ or drizzle/   # migrations + schema
├─ README.md
├─ /app                   # Next.js app dir (frontend + server components)
├─ /components            # shared React components (shadcn wrappers)
├─ /lib                   # shared libs (i18n, auth helpers, utils)
├─ /backend               # domain-driven modules & infra (server-only)
│   ├─ /modules
│   │   ├─ /auth
│   │   ├─ /seller-onboarding
│   │   ├─ /catalog
│   │   ├─ /listings
│   │   ├─ /orders
│   │   ├─ /payments
│   │   ├─ /search
│   │   ├─ /notifications
│   │   └─ /admin
│   ├─ /shared             # cross-cutting: db, email, storage, events
│   └─ /workers            # background workers (jobs)
├─ /scripts               # helpful scripts (seed, migrate)
├─ /tests                 # unit & integration tests
└─ /docs                  # ERD, architecture diagrams, operational docs
```

---

# Bounded contexts & folder responsibilities

Each `backend/modules/<context>` uses the same internal structure (DDD style):

```
/backend/modules/<context>/
├─ domain/
│  ├─ entities/
│  ├─ aggregates/
│  ├─ value-objects/
│  └─ domain-events/
├─ application/
│  ├─ commands/            # use-cases handlers (e.g., SubmitSellerRequest)
│  ├─ dtos/
│  └─ services/            # orchestrators / application services
├─ infra/
│  ├─ repository/          # DB repository implementations
│  ├─ adapters/            # external adapters specific to context
│  └─ validators/          # zod schemas
└─ api/                    # Next.js server route handlers OR controllers
```

This pattern repeats for `seller-onboarding`, `listings`, `payments`, `orders`, etc.

---

# Full module list (bounded contexts)

1. **auth** — users, roles (buyer, seller, admin), JWT/session logic, SSO/Auth.js.
2. **seller-onboarding** — SellerRegistrationRequest aggregate, review workflows, documents.
3. **catalog** — Product model, Brands, Categories, canonical attributes per electronics.
4. **listings** — Listing aggregate (price, stock, images, status).
5. **search** — indexing & search service (Postgres tsvector + ES adapter).
6. **orders** — Order aggregate, order lifecycle, fulfillment status.
7. **payments** — Payment aggregate, provider adapters (MPESA/Tigo/Airtel), webhooks, reconciliation.
8. **notifications** — Email/SMS/Push templates + queue.
9. **admin** — Admin panels, moderation tools, dispute management.
10. **analytics** — Event sinks, simple reports, dashboards.
11. **shared** — DB, object storage, Redis, job queue, event bus, metrics.

---

# Frontend (Next.js app folder) — structure

```
/app
├─ layout.tsx
├─ page.tsx             # homepage
├─ /[locale]            # localized routes (en | sw)
│  ├─ layout.tsx
│  └─ page.tsx
├─ /seller
│  ├─ register/page.tsx
│  ├─ dashboard/page.tsx
│  └─ listings/
├─ /product
│  └─ [id]/page.tsx
├─ /search/page.tsx
├─ /admin
│  ├─ seller-requests/page.tsx
│  └─ orders/page.tsx
├─ /api                 # API edge/server functions proxied to backend modules (optional)
└─ /components          # UI used only by pages (small helpers)
```

Notes:

* Use `next-intl` or `next-i18next` to handle translations. Keep translation namespaces modular (e.g., `seller-onboarding`, `auth`, `listing`).
* Use shadcn components and Tailwind for styling.
* Server components handle data fetching; client components handle interactive UI (forms, file upload).

---

# API design (serverless/app routes) — canonical routes

Prefer server-side controllers in `backend/modules/*/api` invoked by `/app/api/*` routes or custom Next.js API handlers. Examples:

```
POST  /api/seller-requests            -> backend/modules/seller-onboarding/api/submit.ts
GET   /api/admin/seller-requests     -> backend/modules/seller-onboarding/api/admin-list.ts
PUT   /api/admin/seller-requests/:id/approve -> backend/modules/seller-onboarding/api/approve.ts

POST  /api/listings                   -> backend/modules/listings/api/create.ts
GET   /api/listings?query=...         -> backend/modules/listings/api/search.ts
GET   /api/listings/:id               -> backend/modules/listings/api/get.ts

POST  /api/orders                     -> backend/modules/orders/api/create.ts
GET   /api/orders/:id                 -> backend/modules/orders/api/get.ts

POST  /api/payments/initiate          -> backend/modules/payments/api/initiate.ts
POST  /api/payments/webhook/:provider -> backend/modules/payments/api/webhook.ts
GET   /api/payments/:id/status        -> backend/modules/payments/api/status.ts
```


# Shared services & cross-cutting concerns

* **Auth**: `backend/shared/auth` — JWT/session helpers, role checks, middleware for Next API.
* **Storage**: `backend/shared/storage` — S3 client, signed URLs for uploads, lifecycle policies.
* **Email/SMS**: `backend/shared/notify` — **Resend** for transactional emails, SMS via BullMQ queue worker.
* **Queue**: `backend/shared/queue` — Redis + BullMQ; jobs: send-email (via Resend), reconcile-payments, resize-images, index-item.
* **Search indexer**: Postgres for MVP; ES adapter for more advanced later.
* **Metrics & logging**: centralized logger (pino/winston), Sentry, Prometheus counters.

---

# i18n & localization

* `app/i18n/*` or `lib/i18n/*` with translation JSONs:

  ```
  /locales/en/common.json
  /locales/sw/common.json
  /locales/en/seller-onboarding.json
  /locales/sw/seller-onboarding.json
  ```
* Detect locale by route prefix `/en/*` or `/sw/*` or user preference.
* Format currency with `Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS' })`.

---

# UI components (shadcn)

* `components/ui/*` — Buttons, Inputs, Modal, Table, Alert, Toast wrapper, FileUploader.
* `components/vendor/*` — StoreBadge, ProductSpecsTable, SellerProfileCard.
* `components/layout/*` — Header (locale selector + login), Footer, SearchBar.

---

# Workers (background tasks)

```
/backend/workers/
├─ image-processor.worker.ts    # generate thumbnails, sizes
├─ email.worker.ts              # send templated emails
├─ payment-reconcile.worker.ts  # reconcile provider reports
├─ search-indexer.worker.ts     # index new/updated listings
```

Workers subscribe to job queue; not part of Next.js server process in production — separate process (node dist/worker.js).

---

# Tests

* `tests/unit/*` for domain models (aggregate invariants), application command handlers.
* `tests/integration/*` for API flows: seller registration -> admin approve -> create seller.
* `tests/e2e/*` Cypress or Playwright for UI flows.

---

# CI / CD (basic)

`.github/workflows/ci.yml`:

* Install dependencies
* Run lint + typecheck
* Run unit tests
* Run integration tests (optional Postgres container)
* Build Next.js
* On `main` push: deploy to Vercel (frontend) and run migration + restart worker


---

---

# Security & compliance (short list)

* TLS everywhere
* Sign webhook payloads; verify HMAC
* Sanitize user input; validate with zod
* Object store signed URLs; documents accessible only to purchaser/admin
* RBAC for admin endpoints
* Rate-limiting & recaptcha for forms
* PII minimization and secure storage

---

# Roadmap: from MVP -> scale

1. **MVP (weeks 0–8)**

   * Seller onboarding, listings, search, payments integration (STK/webhooks), admin panel, i18n (EN/SW), basic analytics.
2. **Phase 2 (months 2–6)**

   * Reviews, richer search (Elasticsearch), featured listings + paid boosts, seller payouts, shipping integrations.
3. **Phase 3 (months 6–12)**

   * Split heavy modules (payments, search) into microservices if needed, mobile apps, regional expansion.

---
