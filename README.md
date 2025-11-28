# ZetuTech Marketplace

**Electronics marketplace for Tanzania** with verified sellers, secure mobile-money payments (M-Pesa, TigoPesa, Airtel Money), and buyer protection.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Package Manager**: pnpm 8+
- **Monorepo**: Turbo for build orchestration
- **Database**: PostgreSQL (Prisma ORM)
- **Cache/Queue**: Redis + BullMQ
- **API Validation**: Zod
- **UI Components**: shadcn/ui + Tailwind CSS
- **Email**: Resend
- **Auth**: Better Auth (email/password + OAuth)
- **Payments**: MPESA, TigoPesa, Airtel Money adapters
- **Storage**: S3-compatible (MinIO for dev)
- **Monitoring**: Sentry + Pino logging

## Project Structure

```
zetutech-marketplace/
├── apps/
│   └── web/                      # Next.js application
├── packages/
│   ├── ui/                       # Shared shadcn components
│   ├── lib/                      # Utilities, hooks, helpers
│   ├── shared/                   # Domain-driven backend modules
│   │   ├── auth/
│   │   ├── seller-onboarding/
│   │   ├── catalog/
│   │   ├── listings/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── search/
│   │   ├── notifications/
│   │   ├── admin/
│   │   └── analytics/
│   └── db/                       # Prisma schema + migrations
├── doc/                          # Documentation
├── turbo.json                    # Turbo config
├── pnpm-workspace.yaml          # pnpm workspaces
└── tsconfig.json                # Root TypeScript config
```

## Quick Start

### Prerequisites

- Node.js 18.17+
- pnpm 8+
- PostgreSQL 14+
- Redis 7+
- Docker (optional, for PostgreSQL/Redis)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/zetutech-marketplace.git
cd zetutech-marketplace

# Install dependencies with pnpm
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
pnpm db:push

# Seed database (optional)
pnpm db:seed

# Start development server
pnpm dev
```

Visit http://localhost:3000

## Development

### Build all packages

```bash
pnpm build
```

### Run type checking

```bash
pnpm type-check
```

### Lint code

```bash
pnpm lint
```

### Run tests

```bash
pnpm test
```

### Watch mode

```bash
pnpm test:watch
```

## Database

### Create migration

```bash
pnpm db:migrate
```

### Open Prisma Studio

```bash
pnpm db:studio
```

## Architecture

See `doc/architecture.md`, `doc/website_structure.md`, and other documentation in the `doc/` folder for detailed architecture, API conventions, deployment steps, and more.

## API Documentation

All API endpoints documented in `doc/api-conventions.md`.

Base URLs:
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.zetutech.co.tz/api/v1`

## Security

- All endpoints use TLS in production
- Webhook payloads signed with HMAC
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (sanitization)
- CSRF tokens on forms
- Role-based access control (RBAC)

See `doc/security.md` for detailed security guidelines.

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests and linting: `pnpm test && pnpm lint`
4. Commit with clear messages
5. Push and create a pull request

## License

Proprietary - ZetuTech

## Support

- Documentation: `doc/`
- Issues: GitHub Issues
- Email: support@zetutech.co.tz
