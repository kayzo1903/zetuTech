# ZetuTech Marketplace - Simplified Setup

A production-ready **monorepo** for the ZetuTech electronics marketplace built with:
- **Next.js 16** + **React 19**
- **pnpm** workspaces + **Turbo** build orchestration
- **Prisma** ORM with PostgreSQL
- **TypeScript**, **Tailwind CSS**, **shadcn UI**

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Database Setup
```bash
# Create database tables
pnpm db:push

# Seed sample data (optional)
pnpm db:seed
```

### 4. Start Development
```bash
pnpm dev
```

Visit http://localhost:3000

## Project Structure

```
zetutech-marketplace/
├── apps/web/                # Next.js 16 app
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   └── api/            # API routes
│   └── prisma/             # Database schema
├── packages/
│   ├── ui/                 # Shared UI components (shadcn)
│   ├── lib/                # Utilities & Zod schemas
│   └── shared/             # Backend modules (ready to add)
└── doc/                    # Documentation
```

## Available Scripts

```bash
# Development
pnpm dev           # Start dev server

# Building
pnpm build         # Build all packages
pnpm lint          # Lint code
pnpm type-check    # TypeScript check

# Database
pnpm db:push       # Push schema
pnpm db:migrate    # Create migration
pnpm db:seed       # Seed data
pnpm db:studio     # Open Prisma Studio

# Cleaning
pnpm clean         # Remove build artifacts
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Language**: TypeScript 5.4
- **Database**: PostgreSQL + Prisma ORM
- **Package Manager**: pnpm 8+
- **Build Tool**: Turbo 2.0
- **Validation**: Zod
- **API**: Next.js API Routes

## Database Schema

Includes models for:
- Users (roles: BUYER, SELLER, ADMIN)
- Products & Listings
- Orders & Payments
- Reviews & Ratings
- Seller Onboarding
- Notifications

See `apps/web/prisma/schema.prisma` for full schema.

## Environment Variables

Key variables needed:
```env
DATABASE_URL          # PostgreSQL connection
REDIS_URL            # Redis cache/queue
RESEND_API_KEY       # Email service
MPESA_*              # Payment provider credentials
AWS_*                # Storage credentials
```

See `.env.example` for complete list.

## Features

✅ Database schema with 11 modules
✅ Prisma ORM with migrations
✅ Type-safe API validation (Zod)
✅ Shared UI component library
✅ Monorepo with pnpm + Turbo
✅ TypeScript throughout
✅ ESLint + Prettier configured
✅ Jest testing setup ready

## Documentation

- `doc/architecture.md` - System architecture
- `doc/website_structure.md` - Folder structure
- `doc/api-conventions.md` - API standards
- `doc/database-schema.md` - Database details
- `doc/development-setup.md` - Complete setup guide
- `doc/deployment.md` - Production deployment

## Next Steps

1. ✅ Install dependencies: `pnpm install`
2. ✅ Setup database: `pnpm db:push`
3. Build authentication module
4. Build seller onboarding
5. Build product catalog & listings
6. Build orders & payments
7. Build admin dashboard

## Support

For issues or questions:
- Check documentation in `doc/` folder
- Review Prisma schema in `prisma/schema.prisma`
- See example environment in `.env.example`

---

**Ready to develop!** Start with `pnpm install` then `pnpm dev` 🚀
