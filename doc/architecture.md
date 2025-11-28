# Architecture Overview

High-level system design, architectural patterns, and technology decisions for ZetuTech.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
├──────────────────────────┬──────────────────────┬───────────────────────┤
│  Web Browser (Next.js)   │  Mobile Apps         │  Admin Dashboard      │
│  React Components        │  React Native        │  Dashboard UI         │
│  shadcn/ui Components    │                      │                       │
└──────────────┬───────────┴──────────────────────┴───────────┬──────────┘
               │                                              │
               ▼                                              ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER (Next.js)                        │
├──────────────────────────────────────────────────────────────────────────┤
│  App Router (Next.js 13+ app directory)                                  │
│  ├─ /seller/register               ├─ /admin/dashboard                   │
│  ├─ /listings                      ├─ /admin/seller-requests             │
│  ├─ /product/[id]                  ├─ /admin/orders                      │
│  ├─ /search                        ├─ /admin/disputes                    │
│  ├─ /cart                          └─ /admin/analytics                   │
│  └─ /orders                                                              │
│                                                                          │
│  API Routes (/app/api/*)                                                 │
│  ├─ /api/v1/auth/*                 ├─ /api/v1/orders/*                   │
│  ├─ /api/v1/sellers/*              ├─ /api/v1/payments/*                 │
│  ├─ /api/v1/listings/*             ├─ /api/v1/admin/*                    │
│  ├─ /api/v1/products/*             └─ /api/v1/webhooks/*                 │
│  └─ /api/v1/search/*                                                     │
└─────────────┬──────────────────────────────────────────────────────────┬──┘
              │                                                          │
              ▼                                                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER (Use Cases)                        │
├──────────────────────────────────────────────────────────────────────────┤
│  Command Handlers / Application Services                                 │
│  ├─ SubmitSellerRegistrationHandler                                      │
│  ├─ CreateListingHandler                                                 │
│  ├─ InitiatePaymentHandler                                               │
│  ├─ CreateOrderHandler                                                   │
│  ├─ ApproveSellerHandler (Admin)                                         │
│  └─ ReconcilePaymentHandler                                              │
│                                                                          │
│  DTOs & Request/Response Models                                          │
│  Validation (zod schemas)                                                │
│  Transaction Management                                                  │
│  Event Publishing                                                        │
└────────┬────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN LAYER (Core Logic)                         │
├──────────────────────────────────────────────────────────────────────────┤
│  BOUNDED CONTEXTS (Modules):                                             │
│                                                                          │
│  ├─ auth/              Domain: Users, Roles, Permissions                 │
│  ├─ seller-onboarding/ Domain: Seller Entities, Registration Flow        │
│  ├─ catalog/           Domain: Products, Categories, Brands              │
│  ├─ listings/          Domain: Listing Aggregates, Pricing               │
│  ├─ orders/            Domain: Order Aggregates, Fulfillment             │
│  ├─ payments/          Domain: Payment Aggregates, Provider Adapters     │
│  ├─ search/            Domain: Search Indexes, Queries                   │
│  ├─ notifications/     Domain: Notification Templates                    │
│  ├─ reviews/           Domain: Review Entities, Ratings                  │
│  ├─ disputes/          Domain: Dispute Aggregates, Resolution            │
│  ├─ admin/             Domain: Admin Operations, Moderation              │
│  └─ analytics/         Domain: Event Tracking, Reporting                 │
│                                                                          │
│  Each module contains:                                                   │
│  ├─ domain/            Entities, Aggregates, Value Objects               │
│  ├─ application/       Use Cases, Commands, DTOs                         │
│  ├─ infra/             Repositories, Adapters, Validators                │
│  └─ api/               Controllers, Route Handlers                       │
└────────┬────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                                   │
├──────────────────────────────────────────────────────────────────────────┤
│  PERSISTENCE:                                                            │
│  ├─ PostgreSQL Database (Prisma ORM)                                     │
│  └─ Migrations & Seeders                                                 │
│                                                                          │
│  CACHING:                                                                │
│  ├─ Redis (Sessions, Cache, Job Queue)                                   │
│  └─ Rate Limiting Store                                                  │
│                                                                          │
│  STORAGE:                                                                │
│  ├─ S3-compatible (AWS S3 or MinIO) for Images, Documents                │
│  └─ Signed URLs for Secure Access                                        │
│                                                                          │
│  EXTERNAL INTEGRATIONS:                                                  │
│  ├─ Payment Providers (M-Pesa, TigoPesa, Airtel Money)                   │
│  ├─ Email Service (SendGrid)                                             │
│  ├─ SMS Service (Twilio)                                                 │
│  └─ Analytics (Segment, Mixpanel)                                        │
│                                                                          │
│  MESSAGING:                                                              │
│  └─ BullMQ (Job Queue) over Redis                                        │
│                                                                          │
│  OBSERVABILITY:                                                          │
│  ├─ Logging (Pino/Winston)                                               │
│  ├─ Error Tracking (Sentry)                                              │
│  ├─ Metrics (Prometheus)                                                 │
│  └─ Tracing (Jaeger)                                                     │
└────────┬────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   BACKGROUND WORKERS LAYER                               │
├──────────────────────────────────────────────────────────────────────────┤
│  Independent Node process consuming BullMQ jobs:                         │
│                                                                          │
│  ├─ Email Worker          Send templated emails                          │
│  ├─ SMS Worker            Send SMS notifications                         │
│  ├─ Image Processor       Generate thumbnails, resize                    │
│  ├─ Payment Reconciler    Match webhooks to orders                       │
│  ├─ Search Indexer       Index new/updated listings                     │
│  ├─ Notification Sender   Aggregate & send notifications                 │
│  └─ Analytics Processor   Process event streams                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Example: Order Creation

```
1. PRESENTATION
   User fills order form → Validates with zod → Submits to API

2. API ROUTE
   POST /api/v1/orders
   ├─ Authenticate user (JWT)
   ├─ Validate request body
   └─ Call CreateOrderCommand

3. APPLICATION LAYER
   CreateOrderHandler
   ├─ Fetch listing & check stock
   ├─ Fetch buyer & seller
   ├─ Create Order aggregate
   ├─ Save to database
   ├─ Emit OrderCreated event
   └─ Return response

4. DOMAIN LAYER
   Order Aggregate
   ├─ Enforce business rules
   │  ├─ Total = sum of line items + shipping + tax
   │  ├─ Stock available
   │  ├─ Buyer KYC verified
   │  └─ Seller active
   └─ Generate domain events

5. INFRASTRUCTURE
   ├─ Save Order to PostgreSQL
   ├─ Update Listing.reserved count
   ├─ Publish event to event bus (Redis)
   └─ Return 201 Created

6. EVENT PROPAGATION
   Event: OrderCreated
   └─ Subscribers:
      ├─ Payment Module: Await payment
      ├─ Notification Module: Queue emails
      └─ Analytics Module: Log event

7. WORKERS (Async)
   Email Worker
   ├─ Fetch order details
   ├─ Render email template
   ├─ Send via SendGrid
   └─ Update notification status
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN (CloudFlare)                             │
│  Caches static assets, handles DDoS, edge routing                    │
└─────────┬────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Load Balancer (AWS ALB)                          │
│  Distributes traffic across instances, SSL termination               │
└─────┬─────────────┬─────────────┬──────────────────────────────────┘
      │             │             │
      ▼             ▼             ▼
┌──────────────┬──────────────┬──────────────────────────────────────┐
│ Instance 1   │ Instance 2   │ Instance 3     (Auto-scaled)        │
│ Next.js App  │ Next.js App  │ Next.js App                         │
│ :3000        │ :3000        │ :3000                               │
└─────┬────────┴──────────────┴──────────────────────────────────────┘
      │
      ├──────────────────┐
      │                  │
      ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   SHARED SERVICES                                    │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database              Redis Cluster                     │
│  ├─ Primary (write)               ├─ Sessions                      │
│  ├─ Read Replicas (read)          ├─ Cache                         │
│  ├─ Automated Backups             ├─ Job Queue (BullMQ)            │
│  └─ Point-in-time recovery        └─ Rate Limiting                 │
└─────────────────────────────────────────────────────────────────────┘
      │
      ├──────────────────┐
      │                  │
      ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│        S3 Storage              External Services                    │
│  ├─ Images                     ├─ Payment APIs                     │
│  ├─ Documents                  ├─ Email (SendGrid)                 │
│  ├─ Backups                    ├─ SMS (Twilio)                     │
│  └─ Encrypted at rest          └─ Monitoring (Sentry)              │
└─────────────────────────────────────────────────────────────────────┘

  WORKER PROCESSES (Separate Container/VM)
  ├─ Email Worker
  ├─ Image Processor
  ├─ Payment Reconciler
  └─ Search Indexer
```

---

## Key Architectural Decisions

### 1. Monolith with Modular Structure (Not Microservices)

**Why:** 
- Simpler deployment and operations
- Easier transaction management
- Reduced network latency
- Simpler debugging

**Future Path:**
- Each module (bounded context) can be split into microservice if needed
- Folder structure already supports this evolution

### 2. Domain-Driven Design (DDD)

**Why:**
- Aligns code with business domain
- Clear separation of concerns
- Each module independently testable
- Easier to onboard new developers

**Structure:**
- **Domain:** Business rules (no framework dependencies)
- **Application:** Use cases and orchestration
- **Infrastructure:** Database, external APIs
- **API:** HTTP handlers

### 3. CQRS-lite (Not Full CQRS)

**Why:**
- Keep command and query handlers separate
- Easier to optimize queries independently
- Reduces complexity vs full CQRS

**Implementation:**
- Commands: State mutations
- Queries: Read-only operations
- Shared database (not separate read/write)

### 4. Event-Driven for Cross-Module Communication

**Why:**
- Loose coupling between modules
- Async processing (via workers)
- Audit trail of all state changes

**Implementation:**
- Domain events published to Redis
- Workers subscribe to relevant events
- Compensation transactions for failures

### 5. PostgreSQL (Not NoSQL)

**Why:**
- ACID transactions required for payments
- Complex relationships (orders, line items, etc.)
- Strong consistency for financial data

**Trade-offs:**
- Schema requires migration management
- Not horizontally scalable (but works for MVP)
- Future: Sharding if data too large

### 6. Redis for Caching + Job Queue

**Why:**
- In-memory fast access
- Built-in job queue (BullMQ)
- Simple to set up and monitor

**Limitations:**
- Not persistent (acceptable for cache/queue)
- Single-threaded (but sufficient for current scale)

### 7. Next.js (Frontend + Backend)

**Why:**
- Full-stack framework reduces overhead
- Server components for data fetching
- API routes for backend
- Automatic code splitting & optimization

**API Design:**
- `/app/api/*` → delegates to `backend/modules/*/api/*`
- Keeps module logic in `backend/`
- Clean separation

---

## Scaling Strategy

### Phase 1: MVP (Current)
- Single deployed instance
- Database read replicas
- Redis caching
- Background workers

### Phase 2: Medium Scale
- 3-5 app instances behind ALB
- Database read replicas + caching layer
- Worker pool with priority queue
- CDN for static assets

### Phase 3: High Scale
- Microservices (payments, search → separate services)
- Database sharding by seller/order
- Event streaming (Kafka/RabbitMQ)
- Dedicated search service (Elasticsearch)
- Read/write splitting with CQRS

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│ DDoS Protection (CloudFlare)                            │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ TLS/HTTPS (SSL Certificates)                            │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ Rate Limiting (Redis-based)                             │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ Authentication (JWT via Auth.js)                        │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ Authorization (RBAC in middleware)                      │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ Input Validation (zod schemas)                          │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ Output Sanitization (XSS prevention)                    │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ Database (Encryption, RLS, Parameterized queries)       │
└─────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
Application Logs → Centralized Logger (ELK/CloudWatch)
  ├─ Request/response logs
  ├─ Business event logs
  └─ Error logs

Metrics → Prometheus → Grafana
  ├─ HTTP request latency
  ├─ Database query time
  ├─ Cache hit rate
  ├─ Queue depth
  └─ Error rates

Error Tracking → Sentry
  ├─ Application exceptions
  ├─ Error context (user, request)
  ├─ Stack traces
  └─ Release tracking

Health Checks
  └─ /api/health (DB, Redis, external APIs)

Synthetic Monitoring
  ├─ Daily smoke tests
  ├─ API endpoint monitoring
  └─ Transaction monitoring
```

---

## Technology Stack Rationale

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14+ | Full-stack, server components, edge runtime |
| **Language** | TypeScript | Type safety, excellent IDE support, refactoring |
| **Database** | PostgreSQL | ACID transactions, JSONB, full-text search |
| **ORM** | Prisma | Type-safe, migrations, excellent DX |
| **Caching** | Redis | Fast, simple, BullMQ for jobs |
| **Jobs** | BullMQ | Reliable, rate-limited, retries |
| **UI** | shadcn/ui | Accessible, customizable, Tailwind |
| **Validation** | zod | Runtime validation, TypeScript-first |
| **Auth** | Auth.js | Open source, flexible, secure |
| **Payments** | Direct integration | Full control, compliance |
| **Monitoring** | Sentry + ELK | Error tracking, log aggregation |
| **Storage** | S3 | Scalable, reliable, cost-effective |

---

## Disaster Recovery

| Metric | Target |
|--------|--------|
| **RTO** (Recovery Time Objective) | < 4 hours |
| **RPO** (Recovery Point Objective) | < 1 hour |
| **Backup Frequency** | Daily |
| **Backup Retention** | 30 days |
| **Availability SLA** | 99.5% |
| **Failover Time** | < 5 minutes |

---

**Version:** 1.0  
**Last Updated:** November 28, 2025
