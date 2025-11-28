# ZetuTech Documentation

Welcome to the ZetuTech project documentation. This folder contains comprehensive guides for understanding, developing, and deploying the ZetuTech electronics marketplace.

## Quick Links

- **New to the project?** Start with [Architecture Overview](#architecture-overview)
- **Setting up locally?** Follow [Development Setup](./development-setup.md)
- **Ready to deploy?** Check [Deployment Guide](./deployment.md)
- **Building a module?** Read [Website Structure](./website_structure.md)

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| [architecture.md](./architecture.md) | High-level system design, patterns, and diagrams |
| [website_structure.md](./website_structure.md) | Detailed folder layout, DDD structure, and file organization |
| [database-schema.md](./database-schema.md) | Prisma models, relationships, migrations, and indexes |
| [api-conventions.md](./api-conventions.md) | API standards, status codes, error handling, pagination |
| [development-setup.md](./development-setup.md) | Prerequisites, installation, and local development |
| [deployment.md](./deployment.md) | Production checklist, environment variables, CI/CD |
| [security.md](./security.md) | Security guidelines, best practices, and compliance |
| [glossary.md](./glossary.md) | DDD terms, business domain concepts, abbreviations |
| [business_plan.md](./business_plan.md) | Business model, revenue, problem statement |
| [business_agreement.md](./business_agreement.md) | Legal and contractual frameworks |

---

## Architecture Overview

ZetuTech is a **monolithic, Domain-Driven Design (DDD)** marketplace built on:

- **Frontend**: Next.js (app directory), TypeScript, shadcn/ui, Tailwind CSS
- **Backend**: Express.js / Next.js API routes, modular DDD structure
- **Database**: PostgreSQL (Prisma ORM)
- **Caching & Queue**: Redis + BullMQ
- **Payment Integrations**: M-Pesa, TigoPesa, Airtel Money
- **Internationalization**: EN / SW (English / Swahili)

### Key Layers

1. **Presentation** — Next.js pages, React components, forms with zod validation
2. **Application** — Use cases, commands, DTOs, orchestration
3. **Domain** — Entities, aggregates, value objects, domain events, business rules
4. **Infrastructure** — Database, external APIs, storage, messaging
5. **Workers** — Background tasks (email, payments reconciliation, image processing)

### Bounded Contexts (Modules)

Each module is independently deployable and follows a consistent internal structure:

- **auth** — Users, roles, JWT, SSO
- **seller-onboarding** — Seller verification, documents, review workflow
- **catalog** — Products, categories, brands, specifications
- **listings** — Active product listings, pricing, stock management
- **search** — Search indexing, filtering, full-text search
- **orders** — Order creation, lifecycle, fulfillment
- **payments** — Payment processing, provider adapters, reconciliation, webhooks
- **notifications** — Email, SMS, push notifications
- **admin** — Admin dashboards, moderation, dispute management
- **analytics** — Event tracking, reporting, insights

---

## Development Workflow

### 1. Create a New Module

```bash
# Follow the DDD structure in website_structure.md
# Create: backend/modules/<context>/
#   ├─ domain/
#   ├─ application/
#   ├─ infra/
#   └─ api/
```

### 2. Define Domain Models

Start in `domain/` with entities, aggregates, and business rules. No database logic here.

### 3. Implement Use Cases

Add command handlers in `application/commands/`. Orchestrate domain operations and handle transactions.

### 4. Implement Infrastructure

Create repository implementations in `infra/repository/`. Handle database queries, external integrations.

### 5. Expose API Routes

Add controllers in `api/`. Connect to Next.js routes in `/app/api/`.

### 6. Write Tests

Unit tests for domain logic, integration tests for full workflows, E2E tests for user journeys.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | Next.js 14+ (app directory) |
| **Language** | TypeScript |
| **Component Library** | shadcn/ui |
| **Styling** | Tailwind CSS |
| **Forms** | React Hook Form + zod |
| **Authentication** | Auth.js / NextAuth.js |
| **Database** | PostgreSQL + Prisma ORM |
| **API** | Next.js API routes |
| **Caching** | Redis |
| **Job Queue** | BullMQ |
| **File Storage** | S3-compatible (AWS S3 / MinIO) |
| **Payments** | M-Pesa / TigoPesa / Airtel Money SDKs |
| **Logging** | Pino / Winston |
| **Monitoring** | Sentry / Prometheus |
| **Testing** | Jest, Supertest, Cypress / Playwright |
| **Linting** | ESLint, Prettier |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel (frontend), Railway / Render / Docker (backend) |

---

## Key Concepts

### Domain-Driven Design (DDD)

- **Aggregate** — Cluster of entities treated as a single unit (e.g., Order with LineItems)
- **Entity** — Object with identity (e.g., Product, User)
- **Value Object** — Immutable, no identity (e.g., Money, Address)
- **Repository** — Abstraction for data access
- **Bounded Context** — Logical boundary with its own domain language
- **Domain Event** — Something that happened in the domain

See [glossary.md](./glossary.md) for more terms.

### Payment Flow

1. Buyer initiates payment → Create Payment aggregate
2. Payment service calls M-Pesa/TigoPesa/Airtel adapter
3. External service returns status (pending/processing)
4. Webhook receives confirmation → Update Payment status
5. If successful: Funds held, Order moves forward
6. Buyer confirms receipt → Funds released to seller

### Seller Onboarding

1. Seller submits registration request
2. Admin reviews (KYC documents, business info)
3. Admin approves/rejects
4. Seller gains access to dashboard and can list products

---

## Quick Start

```bash
# 1. Clone repo
git clone <repo-url>
cd zetutech

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Set up database
npx prisma migrate dev

# 5. Run locally
npm run dev

# 6. Visit http://localhost:3000
```

For detailed setup, see [development-setup.md](./development-setup.md).

---

## Deployment

See [deployment.md](./deployment.md) for:
- Environment variable checklist
- Database migration strategy
- Worker process setup
- Monitoring & alerting
- Scaling considerations

---

## Security & Compliance

Critical areas covered in [security.md](./security.md):
- TLS/HTTPS everywhere
- Webhook payload verification (HMAC)
- Input validation & sanitization
- RBAC (Role-Based Access Control)
- Rate limiting & DDoS protection
- PII handling & data minimization
- Secrets management

---

## Support & Contributions

- **Questions?** Check [glossary.md](./glossary.md) or relevant module docs
- **Bug reports?** Create an issue with reproduction steps
- **Contributing?** Follow the DDD structure and write tests for new features

---

## Document Status

| Document | Last Updated | Status |
|----------|--------------|--------|
| README | Nov 28, 2025 | ✅ Active |
| architecture.md | Nov 28, 2025 | ✅ Active |
| website_structure.md | Nov 28, 2025 | ✅ Updated |
| database-schema.md | Nov 28, 2025 | ✅ New |
| api-conventions.md | Nov 28, 2025 | ✅ New |
| development-setup.md | Nov 28, 2025 | ✅ New |
| deployment.md | Nov 28, 2025 | ✅ New |
| security.md | Nov 28, 2025 | ✅ New |
| glossary.md | Nov 28, 2025 | ✅ New |

---

**Version:** 1.0  
**Last Updated:** November 28, 2025  
**Maintained By:** ZetuTech Development Team
