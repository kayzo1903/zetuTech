# ZetuTech Glossary

A comprehensive reference guide for Domain-Driven Design (DDD) patterns, business domain concepts, and technical abbreviations used in the ZetuTech project.

---

## Domain-Driven Design (DDD) Concepts

### Aggregate

A cluster of domain objects (entities and value objects) that can be treated as a single unit. The aggregate root is the entity that other entities within the aggregate reference.

**Example:** An `Order` aggregate contains `Order` (root) and `LineItem` entities. External code only references the Order, not individual LineItems.

```typescript
// Order is the aggregate root
class Order implements AggregateRoot {
  id: OrderId;
  lineItems: LineItem[];  // Only accessible through Order
  status: OrderStatus;
  
  addLineItem(product: Product, quantity: number): void {
    // Business rule: enforce invariants
    if (this.isClosed()) throw new OrderClosed();
  }
}
```

### Aggregate Root

The top-level entity of an aggregate. External objects reference only the aggregate root, ensuring aggregate consistency.

### Entity

An object with a unique identity that persists over time. Identity doesn't change even if attributes do.

**Example:** A `Product` entity with `id: ProductId` — the ID remains the same even if the price or name changes.

### Value Object

An immutable object with no identity. Value objects are compared by their attributes, not by reference.

**Example:**
```typescript
class Money {
  constructor(readonly amount: number, readonly currency: string) {}
  
  add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error("Currency mismatch");
    return new Money(this.amount + other.amount, this.currency);
  }
}
```

### Repository

An abstraction layer for data persistence. Repositories simulate a collection of domain objects, hiding database complexity.

**Pattern:**
```typescript
interface SellerRepository {
  save(seller: Seller): Promise<void>;
  findById(id: SellerId): Promise<Seller | null>;
  findAll(): Promise<Seller[]>;
}
```

### Bounded Context

A logical boundary within which a domain model applies. Each bounded context has its own language (Ubiquitous Language) and is independently deployable.

**ZetuTech Bounded Contexts:**
- **auth** — user identity and roles
- **seller-onboarding** — seller verification
- **catalog** — product definitions
- **listings** — active product listings
- **payments** — payment processing
- **orders** — order management

### Ubiquitous Language

The shared language between developers and domain experts. It's used consistently in code, documentation, and conversations.

**Example:** In ZetuTech, we say "Seller submits a registration request" not "User creates a seller record."

### Domain Event

Something that happened in the domain that domain experts care about. Events represent state changes.

**Example:**
```typescript
class SellerRegistrationRequestApproved {
  constructor(
    public readonly sellerId: SellerId,
    public readonly approvedAt: Date
  ) {}
}
```

### Command

A request to perform an action in the domain. Commands are imperative and always fail-safe.

**Example:**
```typescript
class SubmitSellerRegistrationCommand {
  constructor(
    public readonly businessName: string,
    public readonly businessRegistration: string
  ) {}
}
```

### Query

A request for information without side effects.

**Pattern:**
```typescript
class GetSellerQuery {
  constructor(public readonly sellerId: SellerId) {}
}
```

### Use Case / Application Service

Orchestrates domain operations. Handles transactions, triggers events, and coordinates across multiple aggregates.

**Pattern:**
```typescript
class SubmitSellerRegistrationUseCase {
  async execute(command: SubmitSellerRegistrationCommand): Promise<SellerId> {
    // 1. Create seller entity
    const seller = Seller.create(command.businessName);
    
    // 2. Create registration request aggregate
    const request = SellerRegistrationRequest.create(seller, command.businessRegistration);
    
    // 3. Persist
    await this.requestRepository.save(request);
    
    // 4. Publish domain event
    await this.eventBus.publish(request.domainEvents);
    
    return seller.id;
  }
}
```

### Data Transfer Object (DTO)

Immutable object used to transfer data between layers. DTOs avoid exposing domain model details.

**Example:**
```typescript
// Domain model
class Seller {
  id: SellerId;
  businessName: string;
  status: SellerStatus;
}

// DTO (what the API returns)
interface SellerDTO {
  id: string;
  name: string;
  isApproved: boolean;
}
```

---

## Business Domain Concepts

### Seller

A verified merchant on the platform. Sellers must complete KYC (Know Your Customer) verification before listing products.

### Buyer

A user purchasing products. Buyers have purchase history, reviews, and wishlist.

### Product

The canonical definition of an item (e.g., "Apple iPhone 15 Pro 256GB"). Managed in the Catalog bounded context. Multiple listings can reference the same product.

### Listing

An active offer to sell a specific product at a specific price and quantity. Created by sellers, searchable by buyers.

### Order

A buyer's request to purchase one or more listings. Includes payment, shipping address, and fulfillment status.

### Payment

A transaction where a buyer pays for an order using M-Pesa, TigoPesa, or Airtel Money. Payments are held until buyer confirms receipt.

### Seller Registration Request

A seller's application to join the platform. Requires KYC documents and business verification. Admin reviews and approves/rejects.

### Buyer Protection

A guarantee that funds are held in escrow until the buyer confirms receiving the product in satisfactory condition.

### Dispute

A disagreement between buyer and seller (product not received, wrong item, quality issues). Admin arbitrates.

### Commission

ZetuTech takes 12% of each successful order. The remaining 88% goes to the seller.

---

## Technical Abbreviations & Acronyms

| Abbreviation | Full Name | Context |
|--------------|-----------|---------|
| **DDD** | Domain-Driven Design | Architecture pattern |
| **ORM** | Object-Relational Mapping | Prisma abstracts SQL |
| **API** | Application Programming Interface | HTTP endpoints |
| **CRUD** | Create, Read, Update, Delete | Basic data operations |
| **DTI** | Data Transfer Interface | Same as DTO |
| **JWT** | JSON Web Token | Authentication token |
| **HMAC** | Hash-based Message Authentication Code | Webhook security |
| **RBAC** | Role-Based Access Control | Authorization model |
| **KYC** | Know Your Customer | Seller verification |
| **MVP** | Minimum Viable Product | Phase 1 of roadmap |
| **SQL** | Structured Query Language | Database queries |
| **HTTP** | HyperText Transfer Protocol | Web protocol |
| **HTTPS** | HTTP Secure | Encrypted web protocol |
| **TLS** | Transport Layer Security | Encryption standard |
| **SSO** | Single Sign-On | Unified login |
| **OAuth2** | Open Authorization 2.0 | Authentication protocol |
| **REST** | Representational State Transfer | API design style |
| **JSON** | JavaScript Object Notation | Data format |
| **YAML** | YAML Ain't Markup Language | Configuration format |
| **CI/CD** | Continuous Integration / Continuous Deployment | Automation pipeline |
| **S3** | Simple Storage Service | AWS file storage |
| **DB** | Database | Data persistence |
| **ORM** | Object-Relational Mapping | Database abstraction |
| **ES** | Elasticsearch | Full-text search engine |
| **Redis** | Remote Dictionary Server | In-memory cache & queue |
| **BullMQ** | Bull Message Queue | Job queue using Redis |
| **SMS** | Short Message Service | Text messaging |
| **MPESA** | M-Pesa Mobile Money | Payment provider (Safaricom) |
| **SLA** | Service Level Agreement | Availability guarantee |
| **RPO** | Recovery Point Objective | Data backup interval |
| **RTO** | Recovery Time Objective | Service recovery target |
| **ETL** | Extract, Transform, Load | Data pipeline |
| **ECS** | Elastic Container Service | AWS container management |
| **GKE** | Google Kubernetes Engine | Google container orchestration |
| **CDN** | Content Delivery Network | Edge caching |
| **DNS** | Domain Name System | URL to IP mapping |

---

## Payment Provider Terms

### M-Pesa (Safaricom)

Tanzania's leading mobile money service. Allows direct bank account integration and STK (Sim Toolkit) prompts for payments.

### TigoPesa (Airtel)

Airtel's mobile money service in Tanzania. Similar to M-Pesa but operates on Airtel network.

### Airtel Money

Airtel's mobile money solution. Supports direct payments and airtime purchases.

### STK Push

A prompt sent to the user's phone asking for payment confirmation. User enters PIN to authorize.

### Webhook

A callback mechanism where a payment provider sends status updates to ZetuTech servers after payment is completed.

---

## Seller Onboarding Terms

### KYC Documents

Required verification documents:
- Business registration certificate
- National ID or passport
- Proof of address
- Bank account details

### Verification Status

- **Pending** — Request submitted, awaiting admin review
- **Approved** — Seller verified, can list products
- **Rejected** — Documents incomplete or business not eligible
- **Suspended** — Previously approved, but action violated terms

### Admin Review

Manual process where ZetuTech admins verify seller documents and approve/reject applications.

---

## Order & Fulfillment Terms

### Order Status

- **Pending** — Payment not yet confirmed
- **Confirmed** — Payment received, seller notified
- **Shipped** — Seller dispatched the product
- **Delivered** — Buyer received the product
- **Cancelled** — Order cancelled before fulfillment
- **Disputed** — Buyer raised a complaint

### Fulfillment

The process of preparing and delivering an order to the buyer. Includes packaging, shipping label generation, and handoff to courier.

---

## Localization Terms

### Locale

A language + region combination (e.g., `en-US`, `sw-TZ`).

### Ubiquitous Language in i18n

Each locale has translations for domain concepts. Important to maintain consistency:
- English: "Seller Registration Request"
- Swahili: "Ombi la Usajili wa Muuzaji"

---

## Common Patterns & Conventions

### Snake Case vs Camel Case

- **Database fields:** snake_case (`created_at`, `seller_id`)
- **TypeScript/JavaScript:** camelCase (`createdAt`, `sellerId`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)

### Naming Conventions for Events

Domain events follow the pattern `<Entity><Verb>`:
- `SellerRegistrationRequestApproved`
- `ListingPublished`
- `PaymentReceived`
- `OrderDisputed`

### Naming Conventions for Commands

Commands follow the pattern `<Verb><Entity>` or `<Entity><Verb>`:
- `SubmitSellerRegistrationCommand`
- `ApproveSellerCommand`
- `PublishListingCommand`

### Error Handling

Domain errors inherit from `DomainError` and include:
- Message for end users
- Code for programmatic handling
- Original cause (if wrapped)

---

## Context-Specific Glossaries

- **Auth Context:** See [website_structure.md](./website_structure.md#bounded-contexts--folder-responsibilities)
- **Payments Context:** See [database-schema.md](./database-schema.md)
- **API Conventions:** See [api-conventions.md](./api-conventions.md)

---

**Version:** 1.0  
**Last Updated:** November 28, 2025
