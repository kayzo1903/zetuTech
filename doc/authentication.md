# Authentication with Better Auth

ZetuTech uses **Better Auth** for secure, modern authentication with email/password and OAuth support.

## Overview

Better Auth provides:
- ✅ Email/password authentication with email verification
- ✅ OAuth (Google, GitHub, etc.)
- ✅ Session management with JWT
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting for security
- ✅ Prisma adapter integration
- ✅ TypeScript first

## Setup

### 1. Environment Variables

```env
# Better Auth
BETTER_AUTH_SECRET="your-random-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Database Setup

The Better Auth Prisma adapter automatically creates required tables. Run migrations:

```bash
pnpm db:push
```

This creates:
- `User` table with Better Auth fields
- `Account` table for OAuth providers
- `Session` table for session management

### 3. API Routes

Better Auth automatically handles all auth routes at `/api/auth/*`:

- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-up/email` - Email/password registration
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/sign-in/google` - Google OAuth
- `POST /api/auth/callback/google` - Google OAuth callback

## Usage

### Server-side (Server Components/Actions)

```typescript
import { getCurrentUser } from '@/lib/session';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Client-side (Client Components)

```typescript
'use client';

import { useSession } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function Dashboard() {
  const { session, loading } = useProtectedRoute(); // Redirects if not authenticated

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {session?.user.name}</h1>
      <p>Role: {session?.user.role}</p>
    </div>
  );
}
```

### Role-based Routes

```typescript
'use client';

import { useSellerOnly } from '@/hooks/useProtectedRoute';

export default function SellerDashboard() {
  const { session, loading } = useSellerOnly(); // Only SELLER role allowed

  if (loading) return <div>Loading...</div>;

  return <div>Seller Dashboard</div>;
}
```

## API Client (Client-side)

### Sign In

```typescript
async function signIn(email: string, password: string) {
  const response = await fetch('/api/auth/sign-in/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    // Redirect or refresh
    window.location.href = '/';
  }
}
```

### Sign Up

```typescript
async function signUp(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch('/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    // Redirect to email verification
    window.location.href = '/auth/verify-email';
  }
}
```

### Sign Out

```typescript
async function signOut() {
  await fetch('/api/auth/sign-out', { method: 'POST' });
  window.location.href = '/';
}
```

## Role Management

Users have roles: `BUYER`, `SELLER`, `ADMIN`

### Assigning Roles

When approving seller requests:

```typescript
// Update user role to SELLER
await prisma.user.update({
  where: { id: userId },
  data: { role: 'SELLER' },
});
```

### Checking Roles in API

```typescript
export async function POST(req: Request) {
  const session = await getSession();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'SELLER') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Seller-only logic
}
```

## Email Verification

Email verification is required for new accounts:

1. User receives verification email
2. Clicks verification link
3. Account becomes active

Better Auth handles this automatically.

## Session Duration

- **Session timeout**: 30 days
- **Max age**: 30 * 24 * 60 * 60 seconds

Configure in `src/lib/auth.ts`:

```typescript
sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
```

## Security Features

### Rate Limiting

Enabled by default, prevents brute force attacks:
- 5 sign-in attempts per 15 minutes per IP

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number

## OAuth Setup (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Set redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env.local`

```env
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
```

Then in `src/lib/auth.ts`, uncomment the Google provider.

## Troubleshooting

### "Invalid session"
- Check `BETTER_AUTH_SECRET` is set
- Verify database connection
- Check session hasn't expired

### "Email verification required"
- User must click verification link in email
- Check email spam folder

### "CORS error"
- Ensure `BETTER_AUTH_URL` matches your domain
- Check `trustedOrigins` in `src/lib/auth.ts`

## Migration from NextAuth

If migrating from NextAuth:

1. Back up user data
2. Update environment variables
3. Run database migration
4. Update application code (see Usage section)
5. Test thoroughly

## Next Steps

- [ ] Set up email service (Resend)
- [ ] Configure OAuth providers
- [ ] Create password reset flow
- [ ] Set up 2FA (if needed)
- [ ] Test sign-in/sign-up flows
