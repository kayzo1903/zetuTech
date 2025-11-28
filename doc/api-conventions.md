# API Conventions & Standards

Standardized conventions for all ZetuTech API endpoints, ensuring consistency, predictability, and ease of integration.

---

## Base URL & Versioning

```
http://localhost:3000/api/v1              (development)
https://api.zetutech.co.tz/api/v1         (production)
```

All endpoints use `/v1/` prefix for future versioning compatibility.

---

## HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|-----------|------|
| **GET** | Retrieve resource(s) | Yes | Yes |
| **POST** | Create new resource | No | No |
| **PUT** | Replace entire resource | Yes | No |
| **PATCH** | Partial update | No | No |
| **DELETE** | Remove resource | Yes | No |

---

## Request Format

### Headers

All requests should include:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>
Accept-Language: en | sw
```

### Example Request

```http
POST /api/v1/listings HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Accept-Language: en

{
  "productId": "prod_123",
  "price": 45000,
  "currency": "TZS",
  "quantity": 10,
  "description": "Sealed in box"
}
```

---

## Response Format

### Successful Response (200-299)

```json
{
  "success": true,
  "data": {
    "id": "listing_456",
    "productId": "prod_123",
    "price": 45000,
    "currency": "TZS",
    "quantity": 10,
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

### Error Response (4xx-5xx)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      {
        "field": "price",
        "message": "Price must be greater than 0"
      },
      {
        "field": "quantity",
        "message": "Quantity must be a positive integer"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## HTTP Status Codes

### 2xx Success

| Code | Status | Meaning |
|------|--------|---------|
| **200** | OK | Request succeeded |
| **201** | Created | Resource created successfully |
| **202** | Accepted | Async operation accepted |
| **204** | No Content | Success, no body to return |

### 3xx Redirect

| Code | Status | Meaning |
|------|--------|---------|
| **301** | Moved Permanently | Resource moved (include Location header) |
| **302** | Found | Temporary redirect |
| **304** | Not Modified | Resource unchanged since If-Modified-Since |

### 4xx Client Error

| Code | Status | Error Code | Meaning |
|------|--------|-----------|---------|
| **400** | Bad Request | `BAD_REQUEST` | Malformed request syntax |
| **401** | Unauthorized | `UNAUTHORIZED` | Missing or invalid authentication |
| **403** | Forbidden | `FORBIDDEN` | Authenticated but not authorized |
| **404** | Not Found | `NOT_FOUND` | Resource doesn't exist |
| **409** | Conflict | `CONFLICT` | Resource state conflict (e.g., duplicate) |
| **422** | Unprocessable Entity | `VALIDATION_ERROR` | Input validation failed |
| **429** | Too Many Requests | `RATE_LIMITED` | Rate limit exceeded |

### 5xx Server Error

| Code | Status | Error Code | Meaning |
|------|--------|-----------|---------|
| **500** | Internal Server Error | `INTERNAL_ERROR` | Unexpected server error |
| **502** | Bad Gateway | `SERVICE_UNAVAILABLE` | Backend service down |
| **503** | Service Unavailable | `SERVICE_UNAVAILABLE` | Temporarily unavailable |
| **504** | Gateway Timeout | `TIMEOUT` | Request took too long |

---

## Error Code Reference

### Common Error Codes

```typescript
// Authentication
UNAUTHORIZED = "UNAUTHORIZED"  // 401
INVALID_TOKEN = "INVALID_TOKEN"  // 401
TOKEN_EXPIRED = "TOKEN_EXPIRED"  // 401

// Authorization
FORBIDDEN = "FORBIDDEN"  // 403
INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS"  // 403

// Validation
BAD_REQUEST = "BAD_REQUEST"  // 400
VALIDATION_ERROR = "VALIDATION_ERROR"  // 422
INVALID_INPUT = "INVALID_INPUT"  // 422

// Resources
NOT_FOUND = "NOT_FOUND"  // 404
RESOURCE_DELETED = "RESOURCE_DELETED"  // 410
CONFLICT = "CONFLICT"  // 409
DUPLICATE = "DUPLICATE"  // 409

// Payments
PAYMENT_FAILED = "PAYMENT_FAILED"  // 402 or 400
PAYMENT_PROVIDER_ERROR = "PAYMENT_PROVIDER_ERROR"  // 502
INVALID_PAYMENT_METHOD = "INVALID_PAYMENT_METHOD"  // 422

// Business Logic
SELLER_NOT_VERIFIED = "SELLER_NOT_VERIFIED"  // 403
INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK"  // 409
ORDER_ALREADY_SHIPPED = "ORDER_ALREADY_SHIPPED"  // 409

// System
INTERNAL_ERROR = "INTERNAL_ERROR"  // 500
SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"  // 503
RATE_LIMITED = "RATE_LIMITED"  // 429
TIMEOUT = "TIMEOUT"  // 504
```

---

## Pagination

### Query Parameters

```
GET /api/v1/listings?page=1&limit=20&sort=-createdAt&filter=status:active
```

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | N/A | Page number (1-indexed) |
| `limit` | integer | 20 | 100 | Items per page |
| `sort` | string | `-createdAt` | N/A | Sort field, prefix with `-` for descending |
| `filter` | string | N/A | N/A | Filter criteria (e.g., `status:active,seller:xyz`) |
| `search` | string | N/A | N/A | Full-text search query |

### Paginated Response

```json
{
  "success": true,
  "data": [
    { "id": "listing_1", "name": "Product 1" },
    { "id": "listing_2", "name": "Product 2" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

---

## Sorting

### Sort Syntax

```
sort=field1:asc,field2:desc
sort=-createdAt,+name  # - for desc, + for asc (alternative)
```

### Sortable Fields (Per Endpoint)

**Listings:**
- `createdAt` (default, descending)
- `price`
- `rating`
- `name`

**Orders:**
- `createdAt` (default, descending)
- `status`
- `totalPrice`

**Sellers:**
- `createdAt` (default, descending)
- `rating`
- `name`

---

## Filtering

### Filter Syntax

```
filter=status:active,price:>5000,price:<50000,seller:seller_123
```

### Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `:` | Equals | `status:active` |
| `>` | Greater than | `price:>5000` |
| `<` | Less than | `price:<50000` |
| `>=` | Greater or equal | `price:>=5000` |
| `<=` | Less or equal | `price:<=50000` |
| `!` | Not equals | `status:!cancelled` |
| `,` | AND | `status:active,verified:true` |

### Common Filters

**Listings:**
```
filter=status:active,categoryId:electronics,verified:true
```

**Orders:**
```
filter=status:confirmed,createdAt:>2025-01-01,buyer:user_123
```

**Sellers:**
```
filter=status:approved,rating:>=4.0,active:true
```

---

## Timestamps

All timestamps use ISO 8601 format with UTC timezone:

```
2025-01-15T10:30:00Z
```

### Timezone Handling

- **Store:** Always in UTC (Z)
- **Transmit:** Always ISO 8601 UTC
- **Client:** Convert to user's local timezone for display

---

## Authentication

### Bearer Token

Include JWT token in Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Claims

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  permissions: string[];
  iat: number;  // Issued at
  exp: number;  // Expiration
  iss: 'zetutech';  // Issuer
}
```

### Token Refresh

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200 OK):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

## Rate Limiting

### Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705316400
```

### Limits

| Endpoint Type | Requests | Window |
|---------------|----------|--------|
| **Public** | 60 | 1 minute |
| **Authenticated** | 1000 | 1 hour |
| **Admin** | 5000 | 1 hour |
| **Payment** | 10 | 1 minute |

### Rate Limit Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Try again in 60 seconds."
  },
  "meta": {
    "retryAfter": 60,
    "limit": 60,
    "window": "1m"
  }
}
```

---

## Webhook Format

### Payment Webhook Example

```http
POST /api/v1/webhooks/payments/mpesa
Content-Type: application/json
X-Webhook-Signature: sha256=...

{
  "event": "payment.confirmed",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "paymentId": "pay_123",
    "orderId": "order_456",
    "amount": 45000,
    "currency": "TZS",
    "status": "completed",
    "provider": "mpesa",
    "reference": "mpesa_ref_xyz"
  }
}
```

### Webhook Verification

```typescript
// Verify HMAC signature
import crypto from 'crypto';

function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const computed = 'sha256=' + hmac.digest('hex');
  return computed === signature;
}
```

---

## Common API Patterns

### Create Resource

```http
POST /api/v1/listings
Content-Type: application/json
Authorization: Bearer <token>

{
  "productId": "prod_123",
  "price": 45000,
  "quantity": 10
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "listing_456",
    "productId": "prod_123",
    "price": 45000,
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Get Single Resource

```http
GET /api/v1/listings/listing_456
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": { ... }
}
```

### List Resources

```http
GET /api/v1/listings?page=1&limit=20&sort=-createdAt
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

### Update Resource

```http
PATCH /api/v1/listings/listing_456
Content-Type: application/json
Authorization: Bearer <token>

{
  "price": 40000,
  "quantity": 5
}

Response (200 OK):
{
  "success": true,
  "data": { ... }
}
```

### Delete Resource

```http
DELETE /api/v1/listings/listing_456
Authorization: Bearer <token>

Response (204 No Content):
```

---

## Best Practices

### Request Validation

Always validate input using **zod** schema:

```typescript
import { z } from 'zod';

const createListingSchema = z.object({
  productId: z.string().min(1),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().positive(),
});

// In API handler
const result = createListingSchema.safeParse(req.body);
if (!result.success) {
  return res.status(422).json({
    success: false,
    error: { code: 'VALIDATION_ERROR', details: result.error.issues },
  });
}
```

### Response Formatting

Always wrap responses in consistent format:

```typescript
// Success
res.status(200).json({
  success: true,
  data: { ... },
  meta: { timestamp: new Date().toISOString() },
});

// Error
res.status(400).json({
  success: false,
  error: { code: 'ERROR_CODE', message: 'Human-readable message' },
  meta: { timestamp: new Date().toISOString() },
});
```

### Error Handling

```typescript
try {
  const result = await someOperation();
  return res.status(200).json({ success: true, data: result });
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR' } });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
  }
  logger.error('Unexpected error', { error });
  return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR' } });
}
```

### Logging

```typescript
logger.info('Listing created', {
  listingId: listing.id,
  sellerId: seller.id,
  price: listing.price,
  requestId: req.id,
});
```

---

## Example Endpoints

### Seller Onboarding

```
POST   /api/v1/sellers/register                   # Submit registration
GET    /api/v1/sellers/me                         # Get current seller
PATCH  /api/v1/sellers/me                         # Update seller profile
POST   /api/v1/admin/seller-requests              # List requests (admin)
PATCH  /api/v1/admin/seller-requests/:id/approve  # Approve (admin)
PATCH  /api/v1/admin/seller-requests/:id/reject   # Reject (admin)
```

### Listings

```
POST   /api/v1/listings                           # Create listing
GET    /api/v1/listings                           # List with filters
GET    /api/v1/listings/:id                       # Get single
PATCH  /api/v1/listings/:id                       # Update
DELETE /api/v1/listings/:id                       # Delete
```

### Orders

```
POST   /api/v1/orders                             # Create order
GET    /api/v1/orders                             # List user's orders
GET    /api/v1/orders/:id                         # Get order details
PATCH  /api/v1/orders/:id/confirm                 # Confirm receipt
PATCH  /api/v1/orders/:id/dispute                 # Raise dispute
```

### Payments

```
POST   /api/v1/payments/initiate                  # Initiate payment
GET    /api/v1/payments/:id/status                # Check payment status
POST   /api/v1/webhooks/payments/:provider        # Provider callback
```

---

**Version:** 1.0  
**Last Updated:** November 28, 2025
