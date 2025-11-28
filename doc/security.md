# Security Guidelines & Best Practices

Comprehensive security guidelines for ZetuTech development and deployment.

---

## Authentication & Authorization

### Authentication Strategy

- **Method:** JWT (JSON Web Tokens) with Auth.js/NextAuth.js
- **Token Type:** Bearer token
- **Token Expiration:** 1 hour (access), 7 days (refresh)
- **Storage:** HttpOnly cookies (not localStorage for security)

### JWT Claims

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  permissions: string[];
  iat: number;
  exp: number;
  iss: 'zetutech';
}
```

### Role-Based Access Control (RBAC)

```typescript
// Middleware
function checkPermission(requiredRole: UserRole) {
  return (req: NextRequest) => {
    const user = req.auth?.user;
    if (!user || user.role !== requiredRole) {
      return new Response('Forbidden', { status: 403 });
    }
  };
}

// Usage
export const POST = checkPermission('admin')(async (req) => {
  // Admin-only endpoint
});
```

### Password Security

- **Minimum length:** 12 characters
- **Requirements:** Uppercase, lowercase, number, special character
- **Hashing:** bcrypt with salt rounds: 12
- **Never:** Store plain passwords, send in emails

```typescript
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```

---

## Data Protection

### Encryption

#### At Rest

- **Database:** PostgreSQL with encrypted columns for sensitive data (PII, bank accounts)
- **Files:** S3 server-side encryption (SSE-AES256 or SSE-KMS)
- **Secrets:** Never commit to Git; use environment variables

#### In Transit

- **TLS 1.2+:** Required for all HTTPS connections
- **Certificates:** Valid, non-expired SSL certificates
- **Ciphers:** Use only strong cipher suites

```typescript
// Enforce HTTPS
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

### Sensitive Data Handling

**PII Fields (Personal Identifiable Information):**
- Full names
- National IDs / Passport numbers
- Email addresses
- Phone numbers
- Home addresses
- Bank account details

**Guidelines:**
1. **Minimize storage** — Only store what's necessary
2. **Encrypt in database** — Use database-level encryption
3. **Mask in logs** — Never log full credit cards, IDs, or passwords
4. **Limit access** — Only authorized personnel/services access
5. **Delete** — Implement data retention policies; purge after 7 years

```typescript
// Mask sensitive data in logs
function maskSensitiveData(data: any): any {
  return {
    ...data,
    nationalId: data.nationalId?.replace(/./g, '*').slice(-2),
    bankAccount: data.bankAccount?.replace(/./g, '*').slice(-4),
  };
}
```

---

## Input Validation & Sanitization

### Validation Schema (zod)

Always validate inputs before processing:

```typescript
import { z } from 'zod';

const sellerRegistrationSchema = z.object({
  businessName: z.string().min(3).max(100),
  businessRegistration: z.string().regex(/^[A-Z0-9\-\/]+$/),
  email: z.string().email(),
  phone: z.string().regex(/^(\+255|0)[6-7]\d{8}$/),
  bankAccount: z.string().regex(/^\d{16,18}$/),
});

const result = sellerRegistrationSchema.safeParse(req.body);
if (!result.success) {
  throw new ValidationError(result.error.issues);
}
```

### Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize user input to prevent XSS
const cleanHTML = DOMPurify.sanitize(userInput);

// Prevent SQL injection (use Prisma, avoid raw queries)
// DON'T:
const users = await db.$queryRaw(`SELECT * FROM users WHERE email = '${email}'`);

// DO:
const users = await db.user.findMany({
  where: { email },
});
```

---

## API Security

### Rate Limiting

Prevent brute force attacks and DoS:

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 attempts
  message: 'Too many login attempts',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/auth/login', loginLimiter, loginHandler);
```

### CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://zetutech.com',
    'https://www.zetutech.com',
  ],
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Webhook Verification (HMAC)

Always verify webhook signatures from payment providers:

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const computed = 'sha256=' + hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
}

// In webhook handler
const signature = req.headers['x-webhook-signature'];
if (!verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
  throw new UnauthorizedError('Invalid webhook signature');
}
```

---

## Database Security

### Connection Security

```
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

Required parameters:
- `sslmode=require` — Enforce SSL/TLS
- Use strong password (min 16 chars, alphanumeric + symbols)
- Restrict database access to app servers only

### Parameterized Queries

Always use parameterized queries (Prisma does this):

```typescript
// SAFE - Uses parameterized query
const user = await prisma.user.findUnique({
  where: { email },
});

// UNSAFE - Raw SQL (avoid!)
const user = await db.$queryRaw(`SELECT * FROM users WHERE email = '${email}'`);
```

### Least Privilege

```sql
-- Create limited database user
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
-- Grant only needed permissions

-- Admin user (never used by app)
CREATE USER admin_user WITH PASSWORD 'very_strong_password';
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin_user;
```

### Backups & Recovery

- **Frequency:** Daily automated backups
- **Retention:** 30 days
- **Test:** Monthly restore tests
- **Encryption:** Encrypted backups at rest

---

## File & Storage Security

### Upload Validation

```typescript
function validateUpload(file: File): void {
  // Check file type
  const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedMimes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Check file size (max 5MB for images, 10MB for PDFs)
  const MAX_SIZE = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File too large');
  }

  // Verify magic bytes (not just extension)
  const magicBytes = new Uint8Array(await file.arrayBuffer());
  if (!verifyMagicBytes(magicBytes, file.type)) {
    throw new Error('Invalid file content');
  }
}
```

### S3 Configuration

```typescript
// Private by default
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_S3_REGION,
});

// Generate signed URLs (temporary access)
async function getSignedUrl(key: string, expirySeconds = 3600): Promise<string> {
  return getSignedUrl(s3, new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  }), { expiresIn: expirySeconds });
}

// Restrict access
const blockPublicAccess = {
  BlockPublicAcls: true,
  BlockPublicPolicy: true,
  IgnorePublicAcls: true,
  RestrictPublicBuckets: true,
};
```

### File Naming

```typescript
// Don't use user input as filename
const userInput = req.body.filename;  // "../../etc/passwd"

// Safe: Generate UUID + sanitized extension
import { v4 as uuid } from 'uuid';
const safeFileName = `${uuid()}.${sanitizeExtension(userInput)}`;
```

---

## Secrets Management

### Environment Variables

```bash
# .env.example (DO NOT include real secrets)
DATABASE_URL=postgresql://user:password@host/db
JWT_SECRET=your-secret-key-here
MPESA_CONSUMER_KEY=dev-key-here

# .env.local (NEVER commit)
DATABASE_URL=postgresql://user:actual_password@prod-host/db
JWT_SECRET=actual-secret-key
MPESA_CONSUMER_KEY=actual-api-key
```

### Secrets in Production

Never hardcode secrets. Use:

1. **Environment variables** (cloud provider)
2. **Secrets manager** (AWS Secrets Manager, HashiCorp Vault)
3. **Encrypted config files** (only for local dev)

```typescript
// Good: Load from environment
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET not configured');

// Bad: Hardcoded
const jwtSecret = 'my-super-secret-key';
```

### Rotating Secrets

- **Passwords:** Every 90 days
- **API Keys:** Every 6 months
- **Database credentials:** Every 90 days
- **Certificates:** Before expiration

---

## Monitoring & Logging

### Centralized Logging

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'production' ? {
    target: 'pino-sentry',
    options: { dsn: process.env.SENTRY_DSN },
  } : { target: 'pino-pretty' },
});

// Log levels
logger.info('User login', { userId });
logger.warn('Unusual activity', { ip, attempts });
logger.error('Payment failed', { orderId, error });
```

### Sensitive Data Filtering

```typescript
// Remove sensitive fields before logging
function sanitizeForLogging(obj: any): any {
  const { password, pin, cardNumber, ...safe } = obj;
  return safe;
}

// Usage
logger.info('User registered', sanitizeForLogging(userData));
```

### Security Monitoring

- **Failed login attempts** — Alert after 5 failures
- **Unusual API patterns** — Spike in requests from one IP
- **Database anomalies** — Unexpected query patterns
- **File access** — Who accessed sensitive documents
- **Admin actions** — Audit all admin operations

---

## Compliance & Regulations

### GDPR (if EU users)

- **Right to be forgotten** — Delete user data on request
- **Data portability** — Export user data in machine-readable format
- **Consent** — Explicit opt-in for email, marketing
- **Data Processing Agreement** — With third-party services

### Tanzania Regulations

- **TANDATA** — Tanzania Data Protection Act compliance
- **NMB** — National Microfinance Bank reporting (if handling money)
- **Tanzania Telecom** — Compliance for SMS notifications
- **TCRA** — Tanzania Communications Regulatory Authority regulations

### Payment Compliance

- **PCI DSS** — Never store full credit card numbers (use payment providers)
- **Transaction reporting** — Large transactions ($10k+) reported to authorities
- **Anti-money laundering** — KYC verification for sellers
- **Fraud prevention** — Monitor unusual patterns

---

## Security Checklist

### Development

- [ ] All input validated with zod
- [ ] No hardcoded secrets
- [ ] All external APIs use HTTPS
- [ ] Sensitive data masked in logs
- [ ] Unit tests for auth & authorization
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] CSRF tokens on forms

### Deployment

- [ ] Environment variables configured
- [ ] Database SSL/TLS enabled
- [ ] HTTPS/TLS certificates installed
- [ ] Security headers configured
- [ ] WAF (Web Application Firewall) rules
- [ ] DDoS protection enabled
- [ ] Secrets rotated
- [ ] Backups encrypted and tested
- [ ] Monitoring & alerting active
- [ ] Logs centralized & encrypted
- [ ] Incident response plan documented

### Regular Maintenance

- [ ] Monthly security updates applied
- [ ] Quarterly penetration testing
- [ ] Annual security audit
- [ ] Secrets rotation schedule
- [ ] Dependency vulnerability scans (weekly)
- [ ] Access control reviews (quarterly)

---

## Incident Response

### If Compromised

1. **Isolate** — Take service offline if needed
2. **Notify** — Alert affected users immediately
3. **Investigate** — Determine scope & cause
4. **Remediate** — Fix vulnerability, rotate credentials
5. **Restore** — Bring service back online
6. **Review** — Post-mortem analysis

### Contact

- **Security team:** security@zetutech.com
- **Report vulnerabilities:** security@zetutech.com
- **Incident hotline:** +255 XXX XXX XXX

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
- [Zod Validation](https://zod.dev)
- [Next.js Security](https://nextjs.org/docs/going-to-production)
- [Prisma Security](https://www.prisma.io/docs/orm/overview/security)

---

**Version:** 1.0  
**Last Updated:** November 28, 2025
