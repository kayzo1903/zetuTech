---

# 🧩 Middleware System Documentation

## 📘 Overview

This middleware provides two key features for the **Muuza application**:

1. **Guest Session Management** — assigns a unique session ID to anonymous visitors.
2. **API Rate Limiting** — protects sensitive API endpoints from abuse by limiting requests per IP address.

It ensures secure, stable, and fair use of server resources while maintaining a smooth user experience.

---

## ⚙️ Features Summary

| Feature                 | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| **Guest Session ID**    | Automatically generates and stores a `guest_session_id` cookie for each new visitor.                  |
| **Rate Limiting**       | Restricts the number of API calls per IP address to prevent spam, brute-force, or DDoS-like behavior. |
| **Protected Routes**    | Applies rate limiting only to sensitive APIs (`/api/auth`, `/api/orders`, `/api/email`).              |
| **Global Scope**        | Middleware runs across all routes, excluding static assets (e.g., `_next/static`, images, icons).     |
| **Configurable Limits** | Adjust number of allowed requests (`points`) and time window (`duration`).                            |

---

## 🧠 System Logic

### 1️⃣ Guest Session Handler

* Checks for the existence of the `guest_session_id` cookie.
* If not found:

  * Generates a new **UUID v4** session ID.
  * Sets the cookie with:

    * `httpOnly` → prevents JavaScript access for security.
    * `maxAge` = 30 days.
    * `path` = `/` (available site-wide).
* This enables tracking of guest users (e.g., for carts, analytics, or personalization).

### 2️⃣ Rate Limiting

* Uses [`rate-limiter-flexible`](https://www.npmjs.com/package/rate-limiter-flexible) in-memory storage.
* Configuration:

  ```ts
  points: 10,     // Max 10 requests
  duration: 30,   // Within 30 seconds per IP
  ```
* Protected endpoints:

  ```ts
  ["/api/auth", "/api/orders", "/api/email"]
  ```
* Each client’s IP address (`x-forwarded-for`) is tracked.
* If the limit is exceeded:

  * Returns HTTP **429 – Too Many Requests**
  * JSON body: `{ "error": "Too many requests. Please slow down." }`

### 3️⃣ Route Matcher Configuration

Middleware applies globally except static assets and internal resources:

```ts
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons).*)"],
};
```

This prevents unnecessary middleware execution for images, icons, and other static files.

---

## 🧩 Flow Diagram

```text
Incoming Request
      │
      ▼
┌───────────────────────┐
│  Check guest_session  │
│  cookie in request    │
└───────────────────────┘
      │
      ├── If missing → generate UUID + set cookie
      │
      ▼
┌───────────────────────┐
│  Check if route is    │
│  protected (/api/...) │
└───────────────────────┘
      │
      ├── If protected → Apply rate limiter
      │         │
      │         ├── If under limit → Allow
      │         └── If exceeded → 429 error
      │
      ▼
  Continue request →
  Next.js route handler
```

---

## 🔧 Configuration Parameters

| Variable          | Purpose                                          | Default                                      |
| ----------------- | ------------------------------------------------ | -------------------------------------------- |
| `points`          | Maximum number of allowed requests per duration  | `10`                                         |
| `duration`        | Time window for the rate limit (in seconds)      | `30`                                         |
| `protectedRoutes` | Array of API route prefixes protected by limiter | `["/api/auth", "/api/orders", "/api/email"]` |
| `maxAge`          | Duration of guest session cookie in seconds      | `30 days`                                    |

---

## ⚠️ Error Handling

If a user exceeds the allowed rate:

* Response status: **429 (Too Many Requests)**
* Response body (JSON):

  ```json
  { "error": "Too many requests. Please slow down." }
  ```
* Headers:

  ```
  Content-Type: application/json
  ```

---

## 🧩 Dependencies

| Package                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `next/server`           | Provides `NextRequest` and `NextResponse` for middleware. |
| `uuid`                  | Generates unique guest session IDs.                       |
| `rate-limiter-flexible` | Implements IP-based rate limiting.                        |

Install:

```bash
npm install uuid rate-limiter-flexible
```

---

## 🚀 Deployment Notes

* **Local development**: Works perfectly in-memory.
* **Production (Vercel)**:

  * Each region may have its own memory limit.
  * Rate limits are **not shared** between deployments.
  * For global persistence, migrate to `Upstash Redis` with `rate-limiter-flexible` or `@upstash/ratelimit`.

---

## 🔐 Security Considerations

✅ Uses `httpOnly` cookies to prevent XSS attacks.
✅ Protects critical APIs from brute-force or abuse.
✅ Respects user privacy — only stores session IDs, not personal data.
⚠️ Does not persist limits across server restarts or multiple instances.

---

## 🧰 Future Improvements

* [ ] Replace in-memory limiter with **Upstash Redis** for distributed environments.
* [ ] Add **X-RateLimit headers** for frontend awareness.
* [ ] Include **per-user limits** when authentication is implemented.
* [ ] Log blocked IPs for analytics or monitoring.

