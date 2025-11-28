# Development Setup Guide

Complete setup instructions for running ZetuTech locally on your machine.

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.17+ or 20+ | JavaScript runtime |
| pnpm | 8+ | Package manager |
| Turbo | Latest | Monorepo build orchestration |
| Git | Latest | Version control |
| PostgreSQL | 14+ | Database |
| Redis | 7+ | Cache & job queue |

### Optional

| Software | Version | Purpose |
|----------|---------|---------|
| Docker | Latest | Containerization (for PostgreSQL/Redis) |
| VS Code | Latest | IDE (recommended) |
| Thunder Client / Postman | Latest | API testing |

---

## Installation Steps

### 1. Clone the Repository

```powershell
# Clone from GitHub
git clone https://github.com/yourusername/zetutech.git
cd zetutech

# Or if cloning from a private repo
git clone https://github.com/yourusername/zetutech.git
cd zetutech
```

### 2. Install Dependencies

```powershell
# Install Node.js dependencies with pnpm
pnpm install

# Build all packages with Turbo
pnpm turbo build
```

### 3. Set Up Environment Variables

```powershell
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your local values
```

**Important Environment Variables:**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/zetutech_dev

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-dev-secret-key-here
AUTH_SECRET=your-auth-secret-key

# Payment Providers (DEV/SANDBOX)
MPESA_CONSUMER_KEY=dev-key
MPESA_CONSUMER_SECRET=dev-secret
MPESA_PASSKEY=dev-passkey
MPESA_SHORTCODE=254722000000

TIGOPESA_API_KEY=dev-key
AIRTEL_API_KEY=dev-key

# Storage (S3 / MinIO)
AWS_ACCESS_KEY_ID=dev-key
AWS_SECRET_ACCESS_KEY=dev-secret
AWS_S3_BUCKET=zetutech-dev
AWS_S3_REGION=us-east-1
AWS_S3_ENDPOINT=http://localhost:9000  # For local MinIO

# Email Service (Resend)
RESEND_API_KEY=re_dev_xxx  # Get from https://resend.com
RESEND_FROM_EMAIL=noreply@zetutech.co.tz
RESEND_FROM_NAME=ZetuTech

# Logging & Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=debug

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

### 4. Set Up the Database

#### Option A: Using Docker (Recommended)

```powershell
# Start PostgreSQL and Redis containers
docker-compose up -d

# Verify containers are running
docker-compose ps
```

**docker-compose.yml example:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: zetutech-postgres
    environment:
      POSTGRES_USER: zetutech
      POSTGRES_PASSWORD: zetutech_dev_password
      POSTGRES_DB: zetutech_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U zetutech"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: zetutech-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

#### Option B: Manual Installation

```powershell
# Windows with PostgreSQL installer
# 1. Download from https://www.postgresql.org/download/windows/
# 2. Run installer, note password
# 3. Create database:
psql -U postgres
CREATE DATABASE zetutech_dev;
\q

# Install Redis
# 1. Download from https://github.com/microsoftarchive/redis/releases
# 2. Install and start Redis service
```

### 5. Run Database Migrations

```powershell
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 6. Verify Database Connection

```powershell
# Open Prisma Studio to verify
npx prisma studio

# Should open http://localhost:5555
```

---

## Running the Application

### Start Development Server

```powershell
# Terminal 1: Start Next.js dev server
npm run dev

# Application will be available at http://localhost:3000
```

### Start Background Workers (Optional)

```powershell
# Terminal 2: Start BullMQ workers (for email, payments reconciliation, etc.)
npm run dev:workers

# Or in production mode:
npm run build:workers
npm run start:workers
```

### Start Database GUI (Optional)

```powershell
# Terminal 3: Open Prisma Studio
npx prisma studio

# Available at http://localhost:5555
```

---

## Development Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run dev:workers` | Start background workers in dev mode |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create and run migration |
| `npx prisma db seed` | Seed database with sample data |

---

## IDE Setup (VS Code)

### Recommended Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "christian-kohler.path-intellisense",
    "GitHub.copilot"
  ]
}
```

**Install via Terminal:**
```powershell
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension prisma.prisma
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension christian-kohler.path-intellisense
code --install-extension GitHub.copilot
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Testing

### Unit Tests

```powershell
# Run all unit tests
npm run test

# Run tests for a specific file
npm run test -- auth.domain.spec.ts

# Run tests in watch mode (re-run on file change)
npm run test:watch
```

### Integration Tests

```powershell
# Run integration tests (requires database)
npm run test:integration

# Run with coverage
npm run test:integration -- --coverage
```

### End-to-End Tests

```powershell
# Run Cypress/Playwright E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run a specific test file
npm run test:e2e -- tests/e2e/seller-onboarding.cy.ts
```

---

## Debugging

### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Jest",
      "type": "node",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test:watch"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Press `F5` to start debugging.

### Browser DevTools

- Open http://localhost:3000
- Press `F12` to open DevTools
- Use Network tab to inspect API calls
- Use Application tab to inspect cookies/localStorage

### Logging

```typescript
// In your code
import { logger } from '@/lib/logger';

logger.info('Processing order', { orderId, userId });
logger.error('Payment failed', { error, paymentId });
logger.debug('Database query', { query, duration });
```

Check logs in the terminal running `npm run dev`.

---

## Common Issues & Solutions

### Issue: "Cannot find module 'prisma'"

```powershell
# Solution: Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### Issue: "ECONNREFUSED: Connection refused for database"

```powershell
# Solution: Verify PostgreSQL is running
# Check if docker containers are running:
docker-compose ps

# Or start them:
docker-compose up -d
```

### Issue: "Redis connection refused"

```powershell
# Solution: Start Redis
# Via Docker:
docker-compose up -d redis

# Or manually on Windows:
# Start the Redis service from Services
```

### Issue: "Prisma migration error"

```powershell
# Solution: Reset database (WARNING: deletes all data)
npx prisma migrate reset --force
```

### Issue: ".env.local is not loading"

```powershell
# Solution: Verify file exists in project root
ls -la .env.local

# Restart dev server after creating/editing
npm run dev
```

---

## Database Seeding

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      name: 'John Buyer',
      role: 'BUYER',
    },
  });

  const seller = await prisma.user.create({
    data: {
      email: 'seller@example.com',
      name: 'Jane Seller',
      role: 'SELLER',
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```powershell
npx prisma db seed
```

---

## Next Steps

1. **Read** [website_structure.md](./website_structure.md) to understand folder layout
2. **Create** your first module following [DDD patterns](./glossary.md)
3. **Write** tests using Jest (see [tests/](../tests/) folder)
4. **Check** [api-conventions.md](./api-conventions.md) before creating API routes
5. **Deploy** following [deployment.md](./deployment.md) when ready

---

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [DDD in TypeScript](https://github.com/microsoft/TypeScript/wiki/Performance)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**Version:** 1.0  
**Last Updated:** November 28, 2025
