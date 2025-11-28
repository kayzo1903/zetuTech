## 🎯 **Phase 1: Database Schema & Core Types**

### Step 1: Database Schema Design
```sql
-- Cart table
cart (id, userId, sessionId, expiresAt, createdAt, updatedAt)

-- Cart items table  
cartItem (id, cartId, productId, quantity, price, selectedAttributes, createdAt, updatedAt)
```

### Step 2: Type Definitions
```typescript
// lib/cart/types.ts
export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  stock: number;
  status: string;
  originalPrice: number;
  salePrice?: number | null;
  hasDiscount?: boolean;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  selectedAttributes?: ProductAttributeSelection;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
}
```

## 🛠️ **Phase 2: Backend Cart Helpers**

### Step 3: Cart Helper Functions
```typescript
// utils/cart-helpers.ts
export async function getOrCreateCart(userId?: string, sessionId?: string) {
  // Get existing cart or create new one
}

export async function getCartItems(cartId: string): Promise<CartItem[]> {
  // Fetch cart items with product data
}

export async function addItemToCart(params) {
  // Add item with validation and price handling
}

export async function updateCartItemQuantity() {
  // Update quantity with stock validation
}

export async function removeCartItem() {
  // Remove single item
}

export async function clearCart() {
  // Clear all items
}

export async function mergeCarts() {
  // Merge guest cart into user cart
}
```

## 🌐 **Phase 3: API Routes**

### Step 4: Create API Endpoints
```typescript
// app/api/cart/route.ts - GET, DELETE
// app/api/cart/add/route.ts - POST  
// app/api/cart/update/route.ts - PUT
// app/api/cart/remove/route.ts - DELETE
// app/api/cart/merge/route.ts - POST
```

## ⚡ **Phase 4: State Management**

### Step 5: Zustand Store Setup
```typescript
// lib/cart/store.ts
interface CartState {
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  summary: CartSummary;

  // Actions
  initializeCart: () => Promise<void>;
  addItem: (product: Product, quantity: number, attributes?) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: (cartData: Cart) => void;
}
```

## 🔐 **Phase 5: Session Management**

### Step 6: Guest Session Handling
```typescript
// lib/server/cart/session-util.ts (Server)
export async function getOrCreateGuestSessionId()

// lib/client/cart/session-util.ts (Client)  
export function getClientGuestSessionId()
```

## 🎨 **Phase 6: UI Components**

### Step 7: Cart Drawer Component
```typescript
// components/cart/cart-drawer.tsx
- Quick cart access from header
- Summary view with basic actions
- "View Full Cart" navigation
```

### Step 8: Cart Badge Component
```typescript
// components/cart/cart-badge.tsx
- Real-time cart count display
- Visual indicator in header
```

### Step 9: Full Cart Page
```typescript
// app/components/cart-system/cart-list.tsx
- Comprehensive cart management
- Quantity controls, pricing, stock status
- Order summary and checkout
- Mobile-responsive design
```

## 🔄 **Phase 7: Integration & Features**

### Step 10: Header Integration
```typescript
// Updated header to include:
- Cart drawer trigger
- Real-time cart count
- Multiple cart access points
```

### Step 11: Wishlist Integration
```typescript
// Enhanced wishlist with cart functionality
- "Add to Cart" from wishlist
- "Add All to Cart" bulk action
- Stock validation
```

### Step 12: Product Page Integration
```typescript
// Product pages now connect to cart
- Add to cart with attributes
- Quantity selection
- Stock validation
```

## 🚀 **Phase 8: Advanced Features**

### Step 13: Cart Persistence
- Guest sessions via localStorage + cookies
- User cart merging on login
- 30-day cart expiration

### Step 14: Error Handling & Validation
- Stock availability checks
- Product status validation
- Price calculations
- Error toast notifications

### Step 15: Performance Optimizations
- Optimistic UI updates
- Loading states
- Error recovery
- Batch operations

## 📱 **Phase 9: Mobile Optimization**

### Step 16: Responsive Design
- Mobile-first cart list
- Touch-friendly controls
- Adaptive layouts
- Optimized images

## 🔧 **Phase 10: Testing & Refinement**

### Step 17: Edge Cases
- Guest → user cart merging
- Out-of-stock handling
- Price calculation accuracy
- Session persistence

### Step 18: User Experience
- Loading skeletons
- Success/error feedback
- Empty states
- Navigation flows

## 📊 **Key Technical Decisions:**

1. **State Management**: Zustand for client-side state
2. **Session Strategy**: Guest sessions + user cart merging  
3. **API Design**: RESTful endpoints with proper error handling
4. **Database**: Decimal prices stored as strings, converted to numbers
5. **UI/UX**: Optimistic updates with proper error recovery
6. **Performance**: Lazy loading, efficient queries, caching
7. **Mobile**: Responsive design with touch optimization

## 🎯 **Result: Complete Cart System**
- ✅ Add/remove items
- ✅ Quantity management  
- ✅ Guest cart persistence
- ✅ User cart merging
- ✅ Price calculations
- ✅ Stock validation
- ✅ Mobile responsive
- ✅ Error handling
- ✅ Performance optimized

This step-by-step approach ensured a robust, scalable cart system that handles all e-commerce scenarios while providing excellent user experience!