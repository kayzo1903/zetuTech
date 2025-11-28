# Deployment Guide

Complete deployment instructions and checklist for taking ZetuTech to production.

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing: `npm run test`
- [ ] Type checking clean: `npm run type-check`
- [ ] Linting clean: `npm run lint`
- [ ] No console.log statements (use proper logging)
- [ ] Error handling in place
- [ ] Environment variables documented
- [ ] Secrets not committed to git
- [ ] Code reviewed by at least one other developer

### Security

- [ ] HTTPS/TLS configured
- [ ] CORS properly configured
- [ ] Authentication implemented
- [ ] Authorization checks in place
- [ ] Rate limiting configured
- [ ] Input validation with zod
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection (sanitization)
- [ ] CSRF tokens on forms
- [ ] Secrets encrypted and rotated
- [ ] Security headers configured
- [ ] Webhook signatures verified

### Performance

- [ ] Database indexes created
- [ ] N+1 queries eliminated
- [ ] Caching strategy in place
- [ ] Image optimization
- [ ] Bundle size analyzed
- [ ] API response times acceptable
- [ ] Database backups tested

### Documentation

- [ ] README updated
- [ ] API documentation complete
- [ ] Deployment steps documented
- [ ] Runbook created
- [ ] Incident response plan
- [ ] Architecture diagrams

---

## Environment Setup

### Production Environment Variables

Create `.env.production`:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.zetutech.co.tz
NEXT_PUBLIC_APP_URL=https://zetutech.co.tz

# Database
DATABASE_URL=postgresql://app_user:${DB_PASSWORD}@prod-db-host:5432/zetutech_prod?sslmode=require

# Redis
REDIS_URL=redis://:${REDIS_PASSWORD}@prod-redis-host:6379

# Authentication
JWT_SECRET=${JWT_SECRET}
AUTH_SECRET=${AUTH_SECRET}
JWT_EXPIRATION=3600

# Payment Providers (PRODUCTION)
MPESA_CONSUMER_KEY=${MPESA_CONSUMER_KEY}
MPESA_CONSUMER_SECRET=${MPESA_CONSUMER_SECRET}
MPESA_SHORTCODE=${MPESA_SHORTCODE}

# Storage
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_S3_BUCKET=zetutech-prod
AWS_S3_REGION=us-east-1

# Monitoring
SENTRY_DSN=${SENTRY_DSN}
LOG_LEVEL=info

# Email (Resend)
RESEND_API_KEY=${RESEND_API_KEY}
RESEND_FROM_EMAIL=noreply@zetutech.co.tz
RESEND_FROM_NAME="ZetuTech Marketplace"

# Admin
ADMIN_EMAIL=admin@zetutech.co.tz
SUPPORT_EMAIL=support@zetutech.co.tz
SALES_EMAIL=sales@zetutech.co.tz
```

**Never commit production .env to git. Use:**
- Cloud provider secrets manager
- GitHub Secrets (for CI/CD)
- Environment-specific deployment tools

---

## Database Deployment

### 1. Backup Current Database

```bash
# On production server
pg_dump zetutech_prod > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Run Migrations

```bash
# Verify pending migrations
npx prisma migrate status

# Apply migrations
npx prisma migrate deploy

# Verify data integrity
npx prisma db execute --file=verify.sql
```

### 3. Create Indexes

```sql
-- Run in production database
CREATE INDEX CONCURRENTLY idx_user_email ON users(email);
CREATE INDEX CONCURRENTLY idx_listing_status ON listings(status);
CREATE INDEX CONCURRENTLY idx_order_buyer_created ON orders(buyer_id, created_at);
-- ... more indexes from database-schema.md
```

### 4. Enable Row-Level Security (RLS)

```sql
-- Prevent unauthorized data access
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Example: Users can only see their own data
CREATE POLICY user_isolation ON users
  USING (auth.uid() = id);
```

---

## Application Deployment

### Option 1: Vercel (Recommended for Frontend)

```bash
# 1. Connect GitHub repo to Vercel
# 2. Set environment variables in Vercel dashboard
# 3. Configure build settings:
#    - Build Command: npm run build
#    - Output Directory: .next
# 4. Deploy
git push origin main  # Automatically deploys
```

### Option 2: Docker + Railway/Render

#### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

#### Railway Deployment

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and link project
railway login
railway init

# 3. Set environment variables
railway variables set DATABASE_URL=...
railway variables set JWT_SECRET=...

# 4. Deploy
railway deploy
```

### Option 3: Docker + Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zetutech-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zetutech
  template:
    metadata:
      labels:
        app: zetutech
    spec:
      containers:
      - name: zetutech
        image: zetutech:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: zetutech-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

---

## Worker Process Deployment

Background workers run in a separate process for email, payments reconciliation, image processing.

### Systemd Service (Linux)

Create `/etc/systemd/system/zetutech-worker.service`:

```ini
[Unit]
Description=ZetuTech Background Worker
After=network.target

[Service]
User=zetutech
WorkingDirectory=/home/zetutech/app
Environment="NODE_ENV=production"
EnvironmentFile=/home/zetutech/app/.env
ExecStart=/usr/bin/node dist/worker.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start worker:
```bash
sudo systemctl start zetutech-worker
sudo systemctl enable zetutech-worker  # Auto-start on reboot
```

### Docker Compose (Multi-container)

```yaml
version: '3.8'

services:
  app:
    image: zetutech:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pass@postgres:5432/zetutech
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  worker:
    image: zetutech:latest
    command: node dist/worker.js
    environment:
      DATABASE_URL: postgres://user:pass@postgres:5432/zetutech
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: zetutech
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

---

## CDN & Static Assets

### CloudFlare CDN Configuration

```
1. Go to CloudFlare dashboard
2. Add site: zetutech.com
3. Point nameservers to CloudFlare
4. Configure SSL/TLS: Full (strict)
5. Enable:
   - HTTP/2
   - Brotli compression
   - Minify CSS/JS
   - Image optimization
6. Cache rules:
   - Cache static assets: .jpg, .png, .css, .js (1 year)
   - Cache API responses: 5 minutes (if cacheable)
```

### S3 + CloudFront for Images

```typescript
// Generate signed URLs for private images
import { CloudFrontClient, GetSignedUrlsCommand } from "@aws-sdk/client-cloudfront";

async function getImageUrl(key: string): Promise<string> {
  const cloudfront = new CloudFrontClient({ region: 'us-east-1' });
  
  const command = new GetSignedUrlsCommand({
    distributionId: process.env.CLOUDFRONT_DIST_ID,
    key,
    expiresIn: 3600,
  });
  
  const { signedUrls } = await cloudfront.send(command);
  return signedUrls[0];
}
```

---

## Monitoring & Alerting

### Health Checks

```typescript
// /app/api/health/route.ts
export async function GET(req: NextRequest) {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis
    await redis.ping();
    
    return Response.json({ status: 'healthy', timestamp: new Date() });
  } catch (error) {
    return Response.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

### Sentry Integration

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Replay({ maskAllText: true }),
  ],
});
```

### Log Aggregation (ELK Stack or CloudWatch)

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-cloudwatch',
    options: {
      logGroupName: '/zetutech/app',
      logStreamName: 'production',
    },
  },
});

logger.info('Order created', { orderId, amount });
logger.error('Payment failed', { error, orderId });
```

### Metrics (Prometheus)

```typescript
import promClient from 'prom-client';

// HTTP request duration
const httpDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpDuration.observe({ method: req.method, route: req.route?.path, status: res.statusCode }, duration);
  });
  next();
});

// Expose metrics
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

---

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Using Certbot with Nginx
sudo certbot certonly --nginx -d zetutech.com -d www.zetutech.com

# Auto-renewal
sudo certbot renew --dry-run  # Test
sudo systemctl enable certbot.timer
```

### AWS Certificate Manager

```bash
# Request certificate in AWS Console
# Verify domain ownership
# Apply to ALB/CloudFront
```

---

## Database Backup Strategy

### Automated Daily Backups

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/zetutech"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

pg_dump zetutech_prod > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz s3://zetutech-backups/

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

Schedule with crontab:
```
0 2 * * * /home/zetutech/backup.sh  # Daily at 2 AM
```

### Restore from Backup

```bash
gunzip backup_20250115_020000.sql.gz
psql zetutech_prod < backup_20250115_020000.sql
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
      
      - name: Run migrations
        run: |
          npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "✅ Deployment successful",
              "blocks": [{ "type": "section", "text": { "type": "mrkdwn", "text": "*Deployment Successful*\nCommit: ${{ github.sha }}" } }]
            }
```

---

## Post-Deployment Verification

```bash
# 1. Verify health check
curl https://zetutech.com/api/health

# 2. Test critical user flows
# - Seller registration
# - Product listing creation
# - Order creation
# - Payment processing

# 3. Check logs
# tail -f /var/log/zetutech/app.log

# 4. Monitor metrics
# - Response times
# - Error rates
# - Database connections
# - Memory/CPU usage

# 5. Verify backups
# - Latest backup exists
# - Can restore successfully

# 6. Test notification system
# - Send test email
# - Send test SMS
```

---

## Rollback Plan

If deployment has critical issues:

```bash
# 1. Revert to previous version
git revert HEAD
git push origin main  # Triggers automatic redeploy

# 2. Or manually rollback
vercel rollback

# 3. If database issue, restore from backup
psql zetutech_prod < backup_previous.sql
npx prisma migrate deploy  # Reapply migrations

# 4. Clear caches
redis-cli FLUSHALL

# 5. Monitor and verify
curl https://zetutech.com/api/health
```

---

## Scaling Considerations

### Horizontal Scaling

- Run multiple app instances behind load balancer
- Share Redis cache across instances
- Use connection pooling for database

### Database Optimization

- Add read replicas for heavy queries
- Implement query caching
- Archive old orders/logs
- Sharding if data too large

### Worker Scaling

- Run multiple worker processes
- Use job queue priority levels
- Monitor queue depth

---

## Disaster Recovery (DR)

- **RPO (Recovery Point Objective):** < 1 hour (daily backups)
- **RTO (Recovery Time Objective):** < 4 hours (restore from backup + migrations)
- **Test:** Monthly restore drills
- **Runbook:** Documented step-by-step procedures

---

**Version:** 1.0  
**Last Updated:** November 28, 2025
