# Database Schema & Migrations

Comprehensive guide to ZetuTech's Prisma schema, relationships, migrations, and indexing strategy.

---

## Schema Overview

The ZetuTech database follows Domain-Driven Design principles with clear bounded contexts. This document outlines the key entities, relationships, and constraints.

---

## Core Entities

### Users & Authentication

#### User

The central identity entity. All users (buyers, sellers, admins) are stored here.

```prisma
model User {
  id                    String      @id @default(cuid())
  email                 String      @unique
  emailVerified         DateTime?
  hashedPassword        String
  name                  String
  role                  UserRole    @default(BUYER)  // BUYER, SELLER, ADMIN
  avatar                String?
  phoneNumber           String?     @unique
  
  // Personal Info (encrypted in DB)
  nationalId            String?     @db.Text  // encrypted
  nationalIdType        String?     // ID_CARD, PASSPORT, DRIVER_LICENSE
  
  // Address
  country               String      @default("TZ")
  city                  String?
  address               String?
  zipCode               String?
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  deletedAt             DateTime?   // Soft delete
  
  // Relations
  sellerProfile         Seller?
  buyerOrders           Order[]     @relation("buyer")
  notifications         Notification[]
  auditLogs             AuditLog[]
  
  @@index([email])
  @@index([role])
  @@index([deletedAt])
}

enum UserRole {
  BUYER
  SELLER
  ADMIN
}
```

---

### Seller Bounded Context

#### Seller

Verified merchant with additional metadata.

```prisma
model Seller {
  id                    String            @id @default(cuid())
  userId                String            @unique
  user                  User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Business Info
  businessName          String
  businessRegistration  String            @unique
  businessType          String            // SOLE_TRADER, COMPANY, PARTNERSHIP
  businessRegistrationDate DateTime
  taxId                 String?           @unique
  
  // Verification Status
  status                SellerStatus      @default(PENDING)  // PENDING, APPROVED, REJECTED, SUSPENDED
  verificationNote      String?
  verifiedAt            DateTime?
  verifiedBy            String?           // Admin user ID
  
  // Bank Account (encrypted)
  bankAccountName       String?           @db.Text  // encrypted
  bankAccountNumber     String?           @db.Text  // encrypted
  bankCode              String?
  
  // Ratings & Stats
  rating                Float             @default(0)
  reviewCount           Int               @default(0)
  totalSales            Int               @default(0)
  totalRevenue          BigInt            @default(0)  // in cents
  
  // Timestamps
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  
  // Relations
  registrationRequest   SellerRegistrationRequest?
  listings              Listing[]
  orders                Order[]           @relation("seller")
  
  @@index([status])
  @@index([verifiedAt])
  @@index([rating])
}

enum SellerStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}
```

#### SellerRegistrationRequest

Tracks seller onboarding workflow.

```prisma
model SellerRegistrationRequest {
  id                    String                @id @default(cuid())
  sellerId              String                @unique
  seller                Seller                @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  
  // Document URLs (stored in S3)
  businessRegDocument   String
  identityDocument      String
  addressProof          String
  
  // Metadata
  submittedAt           DateTime              @default(now())
  reviewedAt            DateTime?
  reviewedBy            String?               // Admin user ID
  rejectionReason       String?
  
  // Timeline
  createdAt             DateTime              @default(now())
  updatedAt             DateTime              @updatedAt
  
  @@index([sellerId])
  @@index([submittedAt])
}
```

---

### Catalog Bounded Context

#### Category

Product categories for electronics marketplace.

```prisma
model Category {
  id                    String      @id @default(cuid())
  name                  String      @unique
  slug                  String      @unique
  description           String?
  image                 String?
  
  // Hierarchical
  parentId              String?
  parent                Category?   @relation("children", fields: [parentId], references: [id])
  children              Category[]  @relation("children")
  
  // SEO
  metaTitle             String?
  metaDescription       String?
  metaKeywords          String?
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Relations
  products              Product[]
  
  @@index([slug])
  @@index([parentId])
  @@fulltext([name, description])  // For full-text search
}
```

#### Brand

Product manufacturers/brands.

```prisma
model Brand {
  id                    String      @id @default(cuid())
  name                  String      @unique
  slug                  String      @unique
  logo                  String?
  description           String?
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Relations
  products              Product[]
  
  @@index([slug])
}
```

#### Product

Canonical product definition (no pricing here).

```prisma
model Product {
  id                    String      @id @default(cuid())
  name                  String
  slug                  String      @unique
  description           String      @db.Text
  categoryId            String
  category              Category    @relation(fields: [categoryId], references: [id])
  brandId               String?
  brand                 Brand?      @relation(fields: [brandId], references: [id])
  
  // Specifications (JSON for flexibility)
  specs                 Json        // { "cpu": "M3", "ram": "16GB", ... }
  
  // Media
  images                String[]    // JSON array of image URLs
  thumbnail             String?
  
  // Catalog Info
  sku                   String?     @unique
  barcode               String?     @unique
  warranty              String?
  
  // SEO
  metaTitle             String?
  metaDescription       String?
  metaKeywords          String?
  
  // Status
  isActive              Boolean     @default(true)
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Relations
  listings              Listing[]
  reviews               Review[]
  
  @@index([categoryId])
  @@index([brandId])
  @@index([slug])
  @@index([isActive])
  @@fulltext([name, description])  // For search
}
```

---

### Listings Bounded Context

#### Listing

Active product offer from a seller.

```prisma
model Listing {
  id                    String      @id @default(cuid())
  productId             String
  product               Product     @relation(fields: [productId], references: [id])
  sellerId              String
  seller                Seller      @relation(fields: [sellerId], references: [id])
  
  // Pricing
  price                 BigInt      // in cents (e.g., 45000 TZS = 4500000 cents)
  currency              String      @default("TZS")
  originalPrice         BigInt?     // original price before discount
  discount              Float?      // percentage
  
  // Stock
  quantity              Int
  reserved              Int         @default(0)  // reserved in orders
  
  // Status
  status                ListingStatus @default(ACTIVE)  // ACTIVE, INACTIVE, SUSPENDED, DELISTED
  reason                String?     // Reason for status change
  
  // Seller Notes
  condition             String      // NEW, LIKE_NEW, GOOD, FAIR
  shippingInfo          String?
  returnPolicy          String?
  
  // Performance
  views                 Int         @default(0)
  clicks                Int         @default(0)
  wishlistCount         Int         @default(0)
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  listedAt              DateTime    @default(now())  // When first listed
  
  // Relations
  orders                Order[]
  reviews               Review[]
  wishlist              WishlistItem[]
  
  @@index([sellerId])
  @@index([productId])
  @@index([status])
  @@index([listedAt])
  @@index([price])
}

enum ListingStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  DELISTED
}
```

---

### Orders Bounded Context

#### Order

Buyer's purchase request.

```prisma
model Order {
  id                    String            @id @default(cuid())
  orderNumber           String            @unique  // Customer-facing ID
  
  // Parties
  buyerId               String
  buyer                 User              @relation("buyer", fields: [buyerId], references: [id])
  sellerId              String
  seller                Seller            @relation("seller", fields: [sellerId], references: [id])
  
  // Items
  lineItems             OrderLineItem[]
  
  // Pricing
  subtotal              BigInt            // in cents
  shippingCost          BigInt            @default(0)
  discount              BigInt            @default(0)
  tax                   BigInt            @default(0)
  total                 BigInt
  
  // Payment
  paymentId             String?
  payment               Payment?          @relation(fields: [paymentId], references: [id])
  paymentStatus         PaymentStatus     @default(PENDING)
  paidAt                DateTime?
  
  // Delivery
  shippingAddress       String            @db.Text  // JSON: { street, city, zipCode }
  shippingMethod        String            // STANDARD, EXPRESS
  trackingNumber        String?
  
  // Status
  status                OrderStatus       @default(CONFIRMED)
  statusHistory         OrderStatusHistory[]
  
  // Dispute
  disputeId             String?
  dispute               Dispute?          @relation(fields: [disputeId], references: [id])
  
  // Timestamps
  createdAt             DateTime          @default(now())
  confirmedAt           DateTime?
  shippedAt             DateTime?
  deliveredAt           DateTime?
  completedAt           DateTime?
  
  // Relations
  notes                 OrderNote[]
  
  @@index([buyerId])
  @@index([sellerId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  CONFIRMED          // Payment received
  PREPARING          // Seller preparing
  SHIPPED            // In transit
  DELIVERED          // Delivered to buyer
  COMPLETED          // Buyer confirmed
  CANCELLED          // Order cancelled
  DISPUTED           // Under dispute
}

model OrderLineItem {
  id                    String      @id @default(cuid())
  orderId               String
  order                 Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  listingId             String
  listing               Listing     @relation(fields: [listingId], references: [id])
  
  // Product snapshot (at time of order)
  productName           String
  productImage          String
  
  // Pricing at purchase time
  price                 BigInt      // unit price in cents
  quantity              Int
  total                 BigInt      // price * quantity
  
  @@index([orderId])
  @@index([listingId])
}

model OrderStatusHistory {
  id                    String      @id @default(cuid())
  orderId               String
  order                 Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  status                OrderStatus
  note                  String?
  changedBy             String?     // User ID (seller/admin/system)
  
  createdAt             DateTime    @default(now())
  
  @@index([orderId])
}

model OrderNote {
  id                    String      @id @default(cuid())
  orderId               String
  order                 Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  content               String
  authorId              String
  
  createdAt             DateTime    @default(now())
  
  @@index([orderId])
}
```

---

### Payments Bounded Context

#### Payment

Payment transaction record.

```prisma
model Payment {
  id                    String            @id @default(cuid())
  orderId               String            @unique
  order                 Order?
  
  // Amount
  amount                BigInt            // in cents
  currency              String            @default("TZS")
  
  // Provider
  provider              PaymentProvider   // MPESA, TIGOPESA, AIRTEL
  providerTransactionId String?           @unique
  
  // Status
  status                PaymentStatus     @default(PENDING)
  statusHistory         PaymentStatusHistory[]
  
  // User Info
  phoneNumber           String
  
  // Metadata
  metadata              Json?             // Provider-specific data
  
  // Timestamps
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  paidAt                DateTime?
  
  @@index([status])
  @@index([provider])
  @@index([createdAt])
}

enum PaymentProvider {
  MPESA
  TIGOPESA
  AIRTEL
}

enum PaymentStatus {
  PENDING           // Awaiting payment
  PROCESSING        // Provider processing
  COMPLETED         // Payment successful
  FAILED            // Payment failed
  CANCELLED         // Payment cancelled
  REFUNDED          // Refund issued
}

model PaymentStatusHistory {
  id                    String          @id @default(cuid())
  paymentId             String
  payment               Payment         @relation(fields: [paymentId], references: [id], onDelete: Cascade)
  
  previousStatus        PaymentStatus
  newStatus             PaymentStatus
  reason                String?
  
  createdAt             DateTime        @default(now())
  
  @@index([paymentId])
}
```

---

### Reviews Bounded Context

#### Review

Product/seller reviews.

```prisma
model Review {
  id                    String      @id @default(cuid())
  listingId             String
  listing               Listing     @relation(fields: [listingId], references: [id])
  productId             String
  product               Product     @relation(fields: [productId], references: [id])
  
  // Reviewer
  buyerId               String
  buyer                 User        @relation(fields: [buyerId], references: [id])
  
  // Rating & Review
  rating                Int         // 1-5 stars
  title                 String
  content               String      @db.Text
  
  // Aspects
  productQuality        Int?        // 1-5
  sellerCommunication   Int?        // 1-5
  shippingSpeed         Int?        // 1-5
  
  // Verification
  verified              Boolean     @default(false)  // Verified purchase
  orderId               String?
  
  // Moderation
  isApproved            Boolean     @default(true)
  isFlagged             Boolean     @default(false)
  flagReason            String?
  
  // Seller Response
  sellerResponse        String?
  sellerResponseAt      DateTime?
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Relations
  helpful               HelpfulVote[]
  
  @@index([listingId])
  @@index([productId])
  @@index([buyerId])
  @@index([isApproved])
  @@index([createdAt])
}

model HelpfulVote {
  id                    String      @id @default(cuid())
  reviewId              String
  review                Review      @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  
  userId                String
  isHelpful             Boolean
  
  createdAt             DateTime    @default(now())
  
  @@unique([reviewId, userId])
  @@index([reviewId])
}
```

---

### Disputes Bounded Context

#### Dispute

Buyer-seller conflict resolution.

```prisma
model Dispute {
  id                    String            @id @default(cuid())
  orderId               String            @unique
  order                 Order             @relation(fields: [orderId], references: [id])
  
  // Parties
  buyerId               String
  buyer                 User              @relation("disputes", fields: [buyerId], references: [id])
  sellerId              String
  
  // Issue
  reason                DisputeReason
  description           String            @db.Text
  evidence              String[]          // URLs of images/documents
  
  // Resolution
  status                DisputeStatus     @default(OPEN)
  resolution            String?
  resolvedBy            String?           // Admin user ID
  refundAmount          BigInt?           // in cents, if applicable
  
  // Timestamps
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  resolvedAt            DateTime?
  
  // Relations
  messages              DisputeMessage[]
  
  @@index([status])
  @@index([buyerId])
  @@index([createdAt])
}

enum DisputeReason {
  NOT_RECEIVED
  NOT_AS_DESCRIBED
  DEFECTIVE_DAMAGED
  WRONG_ITEM
  OTHER
}

enum DisputeStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

model DisputeMessage {
  id                    String      @id @default(cuid())
  disputeId             String
  dispute               Dispute     @relation(fields: [disputeId], references: [id], onDelete: Cascade)
  
  senderId              String
  content               String      @db.Text
  attachments           String[]
  
  createdAt             DateTime    @default(now())
  
  @@index([disputeId])
}
```

---

### Notifications

#### Notification

User notifications (email, SMS, push).

```prisma
model Notification {
  id                    String            @id @default(cuid())
  userId                String
  user                  User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Content
  type                  NotificationType
  title                 String
  message               String            @db.Text
  actionUrl             String?
  
  // Channel
  channels              NotificationChannel[]  // EMAIL, SMS, PUSH
  
  // Status
  sent                  Boolean           @default(false)
  sentAt                DateTime?
  read                  Boolean           @default(false)
  readAt                DateTime?
  
  // Timestamps
  createdAt             DateTime          @default(now())
  
  @@index([userId])
  @@index([sent])
  @@index([read])
}

enum NotificationType {
  ORDER_CONFIRMED
  PAYMENT_RECEIVED
  ITEM_SHIPPED
  ITEM_DELIVERED
  REVIEW_REQUEST
  MESSAGE_RECEIVED
  DISPUTE_UPDATE
  LISTING_SOLD
  SELLER_APPROVED
  PROMOTION
}

enum NotificationChannel {
  EMAIL
  SMS
  PUSH
}
```

---

## Indexes Strategy

### Performance Indexes

```prisma
// Frequently filtered
User:
  @@index([email])        // Login queries
  @@index([role])         // Authorization
  @@index([deletedAt])    // Soft delete filter

Listing:
  @@index([status])       // Show only active
  @@index([sellerId])     // Seller's listings
  @@index([price])        // Price range queries
  @@index([createdAt])    // Sort by recency

Order:
  @@index([buyerId])      // User's orders
  @@index([sellerId])     // Seller's orders
  @@index([status])       // Filter by status
```

### Full-Text Search Indexes

```prisma
Product:
  @@fulltext([name, description])  // Search products

Category:
  @@fulltext([name, description])  // Search categories
```

### Compound Indexes

```prisma
// Consider adding for common queries
// Example: user's active listings
create index idx_listing_seller_status on listings(seller_id, status);

// Example: user's recent orders
create index idx_order_buyer_created on orders(buyer_id, created_at);
```

---

## Migrations

### Creating a New Migration

```powershell
# Make changes to schema.prisma, then run:
npx prisma migrate dev --name add_new_field

# This:
# 1. Generates SQL migration file
# 2. Applies to development database
# 3. Regenerates Prisma Client
```

### Production Migrations

```powershell
# Generate migration without applying
npx prisma migrate dev --create-only --name add_new_field

# Review the generated SQL in prisma/migrations/
# Then deploy to production:
npx prisma migrate deploy
```

### Resetting Database (Dev Only)

```powershell
# DANGER: Deletes all data
npx prisma migrate reset --force
```

---

## Data Integrity Constraints

### Unique Constraints

- `User.email` — No duplicate emails
- `Seller.businessRegistration` — Unique business
- `Product.slug` — Unique product identifier
- `Listing.productId + Seller.id` — No duplicate product listings per seller
- `Order.orderNumber` — Unique order ID for customers

### Referential Integrity

- Cascade deletes for nested entities (OrderLineItem when Order deleted)
- Prevent deletes for referenced entities (Can't delete Category if Products exist)
- Soft deletes for audit trails (User with deletedAt)

### Business Rules

- `Listing.quantity` >= `Listing.reserved` (stock validation)
- `Order.total` = sum of `OrderLineItem.total` + shipping + tax - discount
- `Payment.amount` = `Order.total`
- `Review.rating` between 1 and 5

---

## Encryption Strategy

Sensitive fields encrypted at the database level:

```prisma
// Examples (actual implementation uses middleware)
model User {
  nationalId      String?  @db.Text   // Encrypted: SSN/ID number
}

model Seller {
  bankAccountNumber  String?  @db.Text   // Encrypted: Bank account
  bankAccountName    String?  @db.Text   // Encrypted: Account holder
}
```

**Implementation:**
```typescript
// Prisma middleware for automatic encryption/decryption
prisma.$use(async (params, next) => {
  if (params.model === 'User' && params.action === 'create') {
    params.args.data.nationalId = encrypt(params.args.data.nationalId);
  }
  
  const result = await next(params);
  
  if (params.model === 'User' && (params.action === 'findUnique' || params.action === 'findMany')) {
    result.nationalId = decrypt(result.nationalId);
  }
  
  return result;
});
```

---

## Versioning & Backups

- **Backup frequency:** Daily
- **Retention:** 30 days
- **Encryption:** At rest with AES-256
- **Testing:** Monthly restore tests
- **Disaster Recovery:** RPO < 1 hour, RTO < 4 hours

---

**Version:** 1.0  
**Last Updated:** November 28, 2025
