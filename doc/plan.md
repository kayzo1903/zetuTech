Nice — let’s design **zetuTech**: a focused, well-structured **monolithic DDD** (Domain-Driven Design) marketplace for electronics in Tanzania (EN/SW), seller registration-by-request, and mobile-money payment integrations (M-Pesa, TigoPesa, Airtel Money). I’ll give you:

* high-level architecture & bounded contexts
* domain model (aggregates/entities, workflows)
* DB schema & indexes (starter SQL)
* API / Next.js structure + UI notes (shadcn + zod)
* Payment/webhook design (key concerns)
* Operational concerns: scaling, security, observability
* Path to evolve toward microservices

---

# High-level architecture (Monolith + DDD)

Keep a single deployable application (one codebase + one process) but **well-layered**:

1. **Presentation (Next.js)**

   * React pages + server components where appropriate.
   * Internationalization global layer (EN / SW).
   * UI library: shadcn components. Forms validated with **zod**.
   * Authentication: Auth.js (or NextAuth), JWT/session cookies.

2. **Application Layer (Use Cases / Commands)**

   * Orchestrates domain operations (e.g., SubmitSellerRequest, ApproveSeller).
   * Implements transactional boundaries.

3. **Domain Layer (Entities / Aggregates / Domain Services)**

   * Bounded contexts (see below).
   * Rich models with business invariants.

4. **Infrastructure Layer**

   * Database (Postgres via Neon / Drizzle ORM or Prisma if you prefer).
   * Object storage (images) — S3-compatible (or cloud provider).
   * Caching (Redis), queue (Redis streams / BullMQ for background tasks).
   * External integrations: M-Pesa / TigoPesa / AirtelMoney SDKs & webhooks.

5. **Background Workers**

   * Email, SMS, reconciliation, search indexing, image processing.

6. **Observability & Ops**

   * Logging, metrics, tracing, backups, CI/CD.

Even as a monolith, keep **separation of concerns** (folders per bounded context) to support later splitting.

---

# Bounded contexts (recommended)

Design separate logical modules:

1. **Auth / Identity**

   * Users (buyer, seller accounts), roles, 2FA.
2. **SellerOnboarding** (core for your requirement)

   * SellerRegistrationRequest, Reviews, Approvals, Documents.
3. **Catalog**

   * Product (aggregate), Category, Brand, Specs (structured attributes per electronics type).
4. **Listings / Inventory**

   * Listing (item for sale), Price, Condition (new/refurb), Stock.
5. **Search & Discovery**

   * Search indexer, filters/attributes tuned to electronics (RAM, screen size...).
6. **Orders & Payments**

   * Order, Payment, PaymentProvider, Payouts.
7. **Shipping**

   * Shipper options, tracking. (Local couriers integration later)
8. **Messaging & Notifications**

   * Email/SMS/in-app notifications.
9. **Admin / Moderation**

   * Admin UI for review workflows, disputes, fraud flags.
10. **Analytics**

* Event collection for recommendations, reporting.

---

# Domain model (seller onboarding focus)

## Key aggregates/entities

* **SellerRegistrationRequest** (aggregate root)

  * id, submitter_user_id, business_name, tin (optional), documents[] (IDs), phone, email, region, languages_preferred, status {PENDING, REVIEW, APPROVED, REJECTED, MORE_INFO}, submitted_at, reviewed_by, reviewed_at, notes, audit_log.
  * Behaviors: submit(), request_more_info(), approve(), reject().

* **Seller** (aggregate root)

  * id, user_id, business_profile, verified (bool), payout_account (details), KYC_documents, rating, created_at.

* **Listing**

  * id, seller_id, product_sku (or product_ref), title, description, price, currency (TZS), category, attributes (jsonb), condition, images[], status, created_at.

* **Order** & **Payment**

  * order_id, buyer_id, items[], total, shipping, status, payment_id, payment_status, provider, provider_reference, created_at.

## Seller registration workflow (simple)

1. Seller fills **registration request** (frontend Next.js form) -> Application submits `SubmitSellerRequest` command to app layer.
2. Persist request; send acknowledgment SMS/Email.
3. Admin reviews in Admin UI; can `approve` or `reject` or `request_more_info`.
4. On `approve` -> create `Seller` aggregate, trigger welcome + payout setup instruction.
5. On `reject` -> store reason, notify applicant.

Sequence (ASCII):

```
User -> Frontend -> POST /api/seller-requests
API -> AppService.SubmitSellerRequest -> Repo.save(request)
-> Notify(user) (SMS/email)
Admin -> AdminUI -> PUT /api/seller-requests/{id}/approve
AppService.Approve -> validate -> create Seller -> Repo.save -> Notify(user)
```

---

# Starter DB schema (Postgres-like, use Drizzle/Prisma)

Key tables with important indexes.

```sql
-- sellers and requests
CREATE TABLE seller_registration_requests (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  business_name text NOT NULL,
  phone text,
  email text,
  region text,
  documents jsonb,         -- references to object storage
  preferred_language text, -- 'en' or 'sw'
  status text NOT NULL,    -- 'PENDING','REVIEW', 'APPROVED', 'REJECTED', 'MORE_INFO'
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_srr_status ON seller_registration_requests(status);

CREATE TABLE sellers (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE,
  business_name text NOT NULL,
  slug text,
  verified boolean DEFAULT false,
  payout_info jsonb,
  rating numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_sellers_verified ON sellers(verified);

-- listings
CREATE TABLE listings (
  id uuid PRIMARY KEY,
  seller_id uuid REFERENCES sellers(id),
  title text,
  description text,
  category text,
  attributes jsonb, -- spec fields: {ram: "8GB", screen: "15.6\"", ...}
  price numeric(12,2),
  currency text DEFAULT 'TZS',
  condition text,
  images jsonb,
  stock int DEFAULT 1,
  status text DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'SOLD'
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_search ON listings USING gin((to_tsvector('english', title || ' ' || coalesce(description,''))));

-- orders & payments
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  buyer_id uuid,
  seller_id uuid,
  items jsonb,
  total numeric(12,2),
  shipping numeric(12,2),
  status text, -- 'CREATED','PAID','SHIPPED','COMPLETED','CANCELLED'
  created_at timestamptz DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  provider text,         -- 'MPESA','TIGOPESA','AIRTELMONEY'
  provider_reference text,
  amount numeric(12,2),
  status text,           -- 'INIT','PENDING','SUCCESS','FAILED'
  raw_payload jsonb,     -- store provider webhook payload for audit
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_payments_provider_ref ON payments(provider, provider_reference);
```

Notes:

* Use `jsonb` for product attributes because electronics need flexible specs per category.
* Full text search: `to_tsvector` for title/description; optionally add Elasticsearch later.

---

# API & Next.js routes (suggested)

Folder structure (monolith style but modular):

```
/app (Next.js)
  /(public) pages
  /i18n
  /components
  /contexts
/backend
  /modules
    /seller_onboarding
      controller.ts (api handlers)
      service.ts
      domain/
      repo.ts
    /listings
    /orders
    /payments
  /workers
  /utils
```

Example API endpoints:

```
POST /api/seller-requests         -> submit request
GET  /api/seller-requests/:id     -> admin view
PUT  /api/seller-requests/:id/approve
PUT  /api/seller-requests/:id/reject
POST /api/listings
GET  /api/listings?category=TV
POST /api/orders
POST /api/payments/initiate       -> creates payment intent for provider
POST /api/payments/webhook/:provider
```

Frontend pages:

* `/seller/register` (form) — zod validation, show required documents upload, language select (en/sw)
* `/seller/dashboard` — pending requests, listings, sales
* `/admin/seller-requests` — review UI (shadcn Tables & Alerts)
* `/products/[id]`, `/search` — listing views

UI tips:

* Use shadcn `Alert` to show enforcement when terms not accepted (you already asked for that earlier).
* Use server-side validation with zod schemas on API routes.

---

# Internationalization (EN & SW)

* Use `next-intl` or `next-i18next` (both work with Next.js).
* Maintain translation namespaces per feature (auth, seller_onboarding, listings, admin). You already stated you want separate namespace for business registration — keep it.
* Detect locale from user preference or accept-language and allow user toggle.
* Format numbers/currency with `Intl.NumberFormat('sw-TZ' / 'en-TZ', { style: 'currency', currency: 'TZS' })`.
* Dates: timezone Africa/Dar_es_Salaam (UTC+3). Use `date-fns-tz` or `Intl.DateTimeFormat` with tz.

Store `preferred_language` on user profile and on seller requests.

---

# Payment integrations (M-Pesa, TigoPesa, AirtelMoney) — design & safety

Treat each provider as an adapter implementing the same provider interface.

## Common flow

1. Frontend calls `/api/payments/initiate` with order id -> server creates `Payment` record with status `INIT` and picks provider adapter.
2. Server initiates transaction with provider API (SDK or REST) and returns provider token/checkout URL or STK push response to client.
3. Provider sends webhook/callback to `/api/payments/webhook/:provider` when payment is completed (success/fail) — verify signature, idempotency, update `payments` and `orders`.
4. Send confirmation to buyer & seller; schedule payout for seller.

## Important design points

* **Idempotency**: record provider_reference and ensure callbacks are idempotent.
* **Webhook security**: verify HMAC/signatures and IP allow-list if provider supports. Reject duplicates.
* **Retries**: queue incoming webhook events for retry/processing.
* **Reconciliation job**: periodic background worker to reconcile provider reports vs local payments.
* **Sandbox/testing**: use provider sandbox keys and simulate webhooks.
* **Payouts**: accumulate seller earnings, pay out on schedule after hold period and fees.
* **Transaction logs**: keep raw provider payloads for audits.

> Implementation: create `payment-providers/mpesa.ts`, `tigo.ts`, `airtel.ts` implementing `IPaymentProvider { initiatePayment(), handleCallback() }`.

**Note:** provider-specific details (endpoints, auth) change over time — consult the providers' docs when implementing. Use server-side secrets storage and rotate credentials.

---

# Background jobs & reliability

* Use queued workers for: sending SMS/Email, image resizing, search indexing, reconciliation, long-running payout generation.
* Use Redis + BullMQ (or similar) for job queue.
* For important flows (payments, seller-approval), publish domain events (EventEmitter or Kafka if later) to ensure other modules respond (e.g., indexing, emails).

---

# Search & catalog for electronics

* Start with Postgres full-text + GIN indexes for MVP.
* Add Elasticsearch when dataset and traffic grow — helps faceted search on electronics specs.
* Predefine categories for electronics and canonical attribute keys (e.g., `ram`, `storage`, `screen_size`, `processor`) so filters work well.

---

# Security & compliance

* Store minimal PII; ensure safe storage for documents (object storage with signed URLs).
* TLS everywhere.
* PCI: you will avoid storing card data — providers handle payment; but for any payment data store, use tokenization and follow PCI guidelines. Mobile money providers often require certain compliance — follow their rules.
* Rate-limit APIs and implement bot protection (reCAPTCHA) on forms.
* Implement role-based access for admin endpoints.

---

# Observability & ops

* Logging (structured JSON) centrally (e.g., ELK / Splunk).
* Metrics (Prometheus) for request rates, payment success rates, queue length.
* Error tracing (Sentry / OpenTelemetry).
* Backups for DB and object storage.
* CI/CD: push PR -> run tests -> build -> deploy. Use canary/feature flags for risky changes.

---

# Scaling strategy (monolith to microservices path)

1. **Design modular monolith**: folders per bounded context, well-defined interfaces, events between modules.
2. **Scale vertically first**: better DB sizing, replicas, read-replicas, caching (Redis).
3. **Add horizontal scaling at web layer**: multiple instances behind load balancer + sticky sessions or shared session store.
4. **Extract hot spots later**: payments, search/indexing, and seller-onboarding into separate services when needed.
5. **Move background processing into separate workers** (first micro-step).
6. **Introduce message broker** (Kafka/RabbitMQ) when event volume grows.

---

# Example dev stack (aligned with what you already use)

* Frontend: **Next.js** (app dir), React, shadcn, next-intl or next-i18next
* Backend: Node.js / TypeScript (single monolith server)
* ORM: **Drizzle** (you said you're using Drizzle + Neon) or Prisma — choose one.
* DB: **Postgres** (Neon)
* Cache/queue: **Redis** (BullMQ)
* Object storage: S3-compatible (DigitalOcean Spaces / AWS S3)
* Search: start Postgres+TSVector → later **Elasticsearch**
* CI/CD: GitHub Actions or GitLab CI
* Monitoring: Prometheus + Grafana + Sentry

---

# Developer tasks checklist (MVP)

* [ ] Project skeleton (Next.js + TypeScript + app routes)
* [ ] Auth (Auth.js) and roles (buyer, seller, admin)
* [ ] Seller registration form (zod validation, doc upload) + API route `POST /api/seller-requests`
* [ ] Admin review UI + API to approve/reject
* [ ] Seller creation flow after approval
* [ ] Listing create/edit UI + DB model (attributes as jsonb)
* [ ] Search endpoints & simple frontend search UI
* [ ] Order creation + payment initiation API
* [ ] Payment provider adapters (MPESA, TigoPesa, Airtel) + secure webhook endpoints
* [ ] Background worker for webhooks, notifications, indexing
* [ ] i18n integration (en & sw) and translation namespaces
* [ ] Tests: unit for domain logic, e2e for key flows
* [ ] Observability basics + logs & error tracking

---

# Migration notes & pitfalls

* Keep domain invariants inside domain layer (not controllers).
* Use `jsonb` for flexible product specs but validate keys at the application level.
* Design idempotency for payments and webhook handling from day one.
* Avoid putting business logic in Next.js pages — keep it in services so it's portable.
* Internationalization should be built-in from day one to avoid rework.
