# Server-Side Session System

## Overview
This document describes the server-side session system implemented for ZetuTech, which provides better performance and SEO benefits compared to client-side session management.

## Architecture

### Server Components
- **ServerHeader** (`components/server-header.tsx`) - Main header component that runs on the server
- **ClientAuthSection** (`components/client-auth-section.tsx`) - Client component for interactive auth features
- **ClientMobileMenu** (`components/client-mobile-menu.tsx`) - Client component for mobile menu interactions

### Utilities
- **getServerSession** (`lib/server-session.ts`) - Core function to get session data on server
- **Server Auth Utils** (`lib/server-auth.ts`) - Helper functions for common auth patterns

## Key Benefits

### 1. **Better Performance**
- No client-side JavaScript for session checking
- Faster initial page load
- Reduced bundle size

### 2. **SEO Friendly**
- Server-rendered content based on user state
- Search engines can see user-specific content
- Better Core Web Vitals

### 3. **Security**
- Session validation happens on the server
- No client-side session manipulation
- Reduced XSS attack surface

## Usage Examples

### Basic Server Component
```tsx
import { getServerSession } from "@/lib/server-session";

export default async function MyPage() {
  const { user, userRole, isAdmin, isAuthenticated } = await getServerSession();

  return (
    <div>
      {isAuthenticated ? (
        <h1>Welcome, {user.name}!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}
```

### Protected Routes
```tsx
import { requireAuth } from "@/lib/server-auth";

export default async function ProtectedPage() {
  // This will redirect if not authenticated
  const user = await requireAuth();
  
  return <div>Protected content for {user.name}</div>;
}
```

### Admin-Only Routes
```tsx
import { requireAdmin } from "@/lib/server-auth";

export default async function AdminPage() {
  // This will redirect if not admin
  const user = await requireAdmin();
  
  return <div>Admin content for {user.name}</div>;
}
```

### Conditional Rendering
```tsx
import { getServerSession } from "@/lib/server-session";

export default async function ConditionalPage() {
  const { isAdmin, userRole } = await getServerSession();

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {userRole === "buyer" && <BuyerDashboard />}
      <PublicContent />
    </div>
  );
}
```

## API Reference

### getServerSession()
Returns the current session data on the server.

```typescript
const { user, userRole, isAdmin, isAuthenticated } = await getServerSession();
```

**Returns:**
- `user`: User object or null
- `userRole`: User role string ("admin" | "buyer")
- `isAdmin`: Boolean indicating if user is admin
- `isAuthenticated`: Boolean indicating if user is logged in

### requireAuth(redirectTo?)
Ensures user is authenticated, redirects if not.

```typescript
const user = await requireAuth("/auth/sign-in");
```

### requireAdmin(redirectTo?)
Ensures user is admin, redirects if not.

```typescript
const user = await requireAdmin("/");
```

### Helper Functions
```typescript
const user = await getCurrentUser(); // Get user or null
const hasAdminRole = await isAdmin(); // Check if admin
const role = await getUserRole(); // Get user role
const hasSpecificRole = await hasRole("admin"); // Check specific role
```

## Migration from Client-Side

### Before (Client-Side)
```tsx
"use client";
import { useSession } from "@/lib/auth-client";

export default function MyComponent() {
  const { data: session } = useSession();
  
  if (!session) return <div>Loading...</div>;
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

### After (Server-Side)
```tsx
import { getServerSession } from "@/lib/server-session";

export default async function MyComponent() {
  const { user, isAuthenticated } = await getServerSession();
  
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

## Best Practices

### 1. **Use Server Components When Possible**
- Prefer server components for static content
- Use client components only for interactivity

### 2. **Minimize Client-Side Session Usage**
- Only use `useSession` for interactive features
- Prefer server-side session for rendering decisions

### 3. **Handle Loading States**
- Server components don't have loading states
- Use proper error boundaries and fallbacks

### 4. **Security Considerations**
- Always validate on server side
- Don't trust client-side session data
- Use proper redirects for unauthorized access

## File Structure

```
├── components/
│   ├── server-header.tsx          # Server-side header
│   ├── client-auth-section.tsx    # Client auth interactions
│   └── client-mobile-menu.tsx     # Client mobile menu
├── lib/
│   ├── server-session.ts          # Core session utility
│   └── server-auth.ts             # Auth helper functions
└── docs/
    └── SERVER_SESSION_SYSTEM.md   # This documentation
```

## Performance Impact

### Before (Client-Side)
- ❌ Client-side JavaScript execution
- ❌ Hydration mismatch potential
- ❌ Slower initial render
- ❌ SEO issues with dynamic content

### After (Server-Side)
- ✅ Server-side rendering
- ✅ No hydration issues
- ✅ Faster initial load
- ✅ Better SEO
- ✅ Reduced JavaScript bundle

## Troubleshooting

### Common Issues

1. **"use client" directive missing**
   - Add `"use client"` to components that use hooks or browser APIs

2. **Session not available**
   - Ensure you're using `getServerSession` in server components
   - Check that headers are properly passed

3. **Redirects not working**
   - Use `redirect()` from Next.js, not `router.push()`
   - Ensure redirects are in server components

4. **Type errors**
   - Use proper type assertions for user object
   - Check that session structure matches expected types

## Future Enhancements

1. **Caching** - Implement Redis caching for session data
2. **Middleware** - Add middleware for automatic route protection
3. **Session Refresh** - Implement automatic session refresh
4. **Analytics** - Add server-side analytics based on user state

