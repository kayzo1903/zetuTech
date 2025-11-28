# 🛍️ E-commerce Order Management System Documentation

## 📋 **System Overview**

A comprehensive order management system that supports both authenticated users and guest purchases. The system handles the complete order lifecycle from cart creation to order delivery tracking.

## 🏗️ **System Architecture**

### **Frontend Layer**
```
app/
├── account/orders/           # Orders listing and details
├── checkout/                 # Multi-step checkout process
├── api/orders/              # Order management APIs
└── components/              # Reusable UI components
```

### **Backend Layer**
```
lib/
├── types/                   # TypeScript interfaces
├── validation-schemas/      # Zod validation schemas
├── auth-client/            # Authentication utilities
└── cart/                   # Cart management
```

### **Database Layer**
```
db/
├── schema.ts               # Database tables definition
└── db-server.ts           # Database connection
```

## 🔄 **Core Workflows**

### **1. Order Creation Flow**
```
User/Guest → Add to Cart → Checkout Process → Order Creation → Order Confirmation
```

### **2. Order Tracking Flow**
```
Authenticated User → Orders List → Order Details → Status Tracking
```

### **3. Guest Order Lookup Flow**
```
Guest User → Order Lookup → Order Details (via phone + order number)
```

## 🗃️ **Database Schema**

### **Core Tables**
```sql
-- Orders table (supports both users and guests)
order
├── id (UUID, PK)
├── userId (TEXT, FK, NULL for guests)
├── guestSessionId (TEXT, NULL for users)
├── orderNumber (VARCHAR, Unique)
├── status (VARCHAR)
├── pricing fields (subtotal, shipping, tax, discount, total)
├── delivery & payment info
└── timestamps

-- Order items
order_item
├── id (UUID, PK)
├── orderId (UUID, FK)
├── productId (UUID, FK)
├── quantity (INTEGER)
├── price (DECIMAL)
└── attributes (JSON)

-- Order addresses
order_address
├── id (UUID, PK)
├── orderId (UUID, FK)
├── type (shipping/billing)
└── address fields

-- Status history
order_status_history
├── id (UUID, PK)
├── orderId (UUID, FK)
├── status (VARCHAR)
└── timestamps
```

## 🎯 **Key Features**

### **1. Multi-Step Checkout Process**
- **Step 1**: Contact Information (phone, email, region)
- **Step 2**: Delivery Method (direct/agent pickup)
- **Step 3**: Address Information
- **Step 4**: Payment Method
- **Step 5**: Order Review & Confirmation

### **2. Guest & User Support**
```typescript
// Guest Order
{
  userId: null,
  guestSessionId: 'guest_123456_abc',
  customerPhone: '+255653274741'
}

// User Order  
{
  userId: 'user_123',
  guestSessionId: null,
  customerPhone: '+255653274741'
}
```

### **3. Pricing Calculation**
```typescript
const pricing = {
  subtotal: 3470000,    // Sum of item prices
  discount: 280000,     // Total discounts
  shipping: 0,          // Free in Dar es Salaam
  tax: 574200,         // 18% VAT
  total: 3764200        // Final amount
}
```

### **4. Order Status Tracking**
```
pending → confirmed → processing → shipped → delivered
```

## 🔐 **Authentication & Security**

### **Session Management**
- **Users**: Better Auth integration
- **Guests**: Session-based with localStorage + cookies
- **Validation**: Zod schemas for all inputs

### **API Security**
```typescript
// All order APIs validate user ownership
const [orderData] = await dbServer
  .select()
  .from(order)
  .where(
    and(
      eq(order.id, orderId),
      eq(order.userId, session.user.id)  // Ownership check
    )
  );
```

## 📱 **UI Components**

### **Order List Component**
- Paginated order history
- Search and filter capabilities
- Status badges with visual indicators
- Responsive card layout

### **Order Detail Component**
- Progress tracking visualization
- Complete order information
- Status history timeline
- Order summary breakdown

### **Checkout Components**
- Multi-step form wizard
- Real-time pricing calculations
- Guest/user context awareness
- Validation and error handling

## 🔌 **API Endpoints**

### **Order Management**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/orders/create` | Create new order | No (guest support) |
| `GET` | `/api/orders` | List user orders | Yes |
| `GET` | `/api/orders/[orderId]` | Get order details | Yes |
| `POST` | `/api/orders/guest/lookup` | Guest order lookup | No |

### **Request/Response Examples**

**Create Order:**
```json
{
  "contact": {
    "phone": "+255653274741",
    "email": "user@example.com",
    "region": "Dar es Salaam"
  },
  "delivery": {
    "method": "direct_delivery",
    "agentLocation": ""
  },
  "cartItems": [...],
  "pricing": {...},
  "userId": "user_123"
}
```

**Order Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_123",
    "orderNumber": "ZT-123456-ABC",
    "status": "pending",
    "totalAmount": "3764200",
    "items": [...]
  }
}
```

## 💰 **Business Logic**

### **Shipping Calculation**
```typescript
function calculateShipping(region: string): number {
  return region === 'Dar es Salaam' ? 0 : 15000;
}
```

### **Tax Calculation**
```typescript
function calculateTax(cartTotal: number): number {
  return Math.round(cartTotal * 0.18); // 18% VAT
}
```

### **Order Number Generation**
```typescript
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ZT-${timestamp}-${random}`; // ZT-123456-ABC
}
```

## 🎨 **User Experience Features**

### **Visual Status Indicators**
- **Pending**: Yellow clock icon
- **Processing**: Orange package icon  
- **Shipped**: Blue truck icon
- **Delivered**: Green checkmark icon
- **Cancelled**: Red X icon

### **Progress Tracking**
```typescript
const statusSteps = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' }
];
```

### **Responsive Design**
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interfaces
- Dark mode support

## 🔧 **Technical Implementation**

### **State Management**
```typescript
// Cart store using Zustand
interface CartStore {
  items: CartItem[];
  summary: CartSummary;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}
```

### **Validation Schemas**
```typescript
// Comprehensive Zod validation
export const orderCreateSchema = checkoutSchema.extend({
  cartItems: z.array(orderItemSchema).min(1),
  pricing: pricingSchema,
  userId: z.string().uuid().nullable().optional()
});
```

### **Error Handling**
```typescript
try {
  const result = await createOrder(orderData);
  if (result.success) {
    // Success flow
  } else {
    // Validation errors
  }
} catch (error) {
  // Network/server errors
}
```

## 🚀 **Performance Optimizations**

### **Database Queries**
- Efficient joins for order details
- Pagination for order lists
- Selective field loading
- Transaction safety

### **Frontend Optimizations**
- Skeleton loading states
- Efficient re-renders with Zustand
- Debounced search
- Optimized image loading

## 📊 **Monitoring & Analytics**

### **Key Metrics**
- Order completion rate
- Average order value
- Cart abandonment rate
- Guest vs user conversion

### **Error Tracking**
- API error logging
- Validation failure tracking
- User flow interruption points

## 🔄 **Integration Points**

### **Payment Gateways**
- Cash on delivery (implemented)
- Mobile money (ready for integration)
- Card payments (ready for integration)
- Bank transfer (ready for integration)

### **Shipping Providers**
- Direct delivery
- Agent pickup locations
- Future carrier integrations

## 🛠️ **Development Guidelines**

### **Code Standards**
- TypeScript for type safety
- Zod for runtime validation
- Consistent error handling
- Comprehensive documentation

### **Testing Strategy**
- Unit tests for business logic
- Integration tests for APIs
- E2E tests for user flows
- Performance testing

## 📈 **Scalability Considerations**

### **Database**
- Indexed foreign keys
- Efficient query patterns
- Read replicas for reporting

### **API**
- Rate limiting
- Caching strategies
- Horizontal scaling ready

### **Frontend**
- Component reusability
- State management efficiency
- Bundle size optimization

---

This documentation provides a comprehensive overview of the order management system architecture, features, and implementation details. The system is designed to be scalable, maintainable, and provide excellent user experience for both guests and authenticated users.