# 🔧 Standardized Error Handling Implementation Guide

## Overview
This guide shows how to implement consistent error handling across all API routes in the zetuTech e-commerce platform.

## 📁 Files Created

### 1. `lib/api/error-handler.ts`
- **Purpose**: Core error handling logic and types
- **Features**:
  - Standardized error response format
  - Custom error classes
  - Error code enumeration
  - HTTP status code mapping
  - Convenience error functions

### 2. `lib/api/api-wrapper.ts`
- **Purpose**: Higher-order functions for wrapping API handlers
- **Features**:
  - `withErrorHandling()` - Basic error handling wrapper
  - `withAuth()` - Authentication wrapper
  - `withValidation()` - Input validation wrapper
  - `withAuthAndValidation()` - Combined wrapper
  - Response helpers

### 3. `examples/refactored-products-api.ts`
- **Purpose**: Example of how to refactor existing API routes
- **Shows**: Before/after comparison

---

## 🚀 Implementation Steps

### Step 1: Install the Error Handler
```bash
# The files are already created, just import them in your API routes
```

### Step 2: Refactor Existing API Routes

#### Before (Inconsistent):
```typescript
// app/api/products/route.ts - OLD WAY
export async function POST(request: NextRequest) {
  try {
    // ... logic
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### After (Standardized):
```typescript
// app/api/products/route.ts - NEW WAY
import { withAuthAndValidation, ApiResponses } from "@/lib/api/api-wrapper";

export const POST = withAuthAndValidation(
  productSchema,
  async (request: NextRequest, user, validatedData) => {
    // ... logic (no try/catch needed - handled by wrapper)
    return ApiResponses.created(newProduct, "Product created successfully");
  },
  true // requireAdmin = true
);
```

### Step 3: Update All API Routes

#### Cart API Example:
```typescript
// app/api/cart/route.ts
import { withErrorHandling, ApiResponses } from "@/lib/api/api-wrapper";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const guestSessionId = await getSessionIdFromRequest(request);
  const cart = await getOrCreateCart(undefined, guestSessionId);
  const items = await getCartItems(cart.id);
  
  return ApiResponses.success({
    cart: { ...cart, items },
    items
  });
});
```

#### Wishlist API Example:
```typescript
// app/api/wishlist/route.ts
import { withAuth, ApiResponses, ApiErrors } from "@/lib/api/api-wrapper";

export const GET = withAuth(async (request: NextRequest, user) => {
  let userWishlist = await getUserWishlist(user.id);
  if (!userWishlist) {
    userWishlist = await createWishlist(user.id);
  }
  
  if (!userWishlist) {
    throw ApiErrors.databaseError("Failed to create wishlist");
  }
  
  const items = await getWishlistItems(userWishlist.id);
  
  return ApiResponses.success({
    wishlist: userWishlist,
    items,
  });
});
```

---

## 📊 Benefits

### 1. **Consistent Response Format**
```typescript
// All success responses follow this format:
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional success message",
  "meta": { /* pagination, etc. */ }
}

// All error responses follow this format:
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional error details */ },
  "timestamp": "2024-12-19T10:30:00.000Z"
}
```

### 2. **Reduced Boilerplate**
- No more repetitive try/catch blocks
- No more manual error response formatting
- Automatic authentication handling
- Built-in validation

### 3. **Better Error Tracking**
- Standardized error codes
- Consistent logging format
- Better debugging information

### 4. **Type Safety**
- Full TypeScript support
- Compile-time error checking
- IntelliSense support

---

## 🔄 Migration Checklist

### Phase 1: Core Infrastructure ✅
- [x] Create error handler (`lib/api/error-handler.ts`)
- [x] Create API wrapper (`lib/api/api-wrapper.ts`)
- [x] Create example refactored route

### Phase 2: Critical Routes
- [ ] Refactor `app/api/products/route.ts`
- [ ] Refactor `app/api/cart/route.ts`
- [ ] Refactor `app/api/wishlist/route.ts`
- [ ] Refactor `app/api/orders/create/route.ts`

### Phase 3: All Remaining Routes
- [ ] Refactor all admin API routes
- [ ] Refactor all product API routes
- [ ] Refactor all order API routes
- [ ] Refactor all cart API routes

### Phase 4: Testing & Cleanup
- [ ] Test all refactored routes
- [ ] Remove old error handling code
- [ ] Update frontend to handle new response format
- [ ] Update documentation

---

## 🧪 Testing the New System

### Test Success Responses:
```typescript
// Should return standardized success format
const response = await fetch('/api/products');
const data = await response.json();
console.log(data);
// Expected: { success: true, data: [...], meta: { pagination: {...} } }
```

### Test Error Responses:
```typescript
// Should return standardized error format
const response = await fetch('/api/products', { method: 'POST' });
const data = await response.json();
console.log(data);
// Expected: { success: false, error: "...", code: "UNAUTHORIZED", timestamp: "..." }
```

---

## 🚨 Important Notes

1. **Backward Compatibility**: The new system maintains the same HTTP status codes
2. **Gradual Migration**: You can migrate routes one at a time
3. **Frontend Updates**: Update frontend code to handle the new response format
4. **Error Monitoring**: Consider integrating with error monitoring services

---

## 📈 Performance Impact

- **Positive**: Reduced code duplication
- **Positive**: Better error handling
- **Neutral**: Minimal performance impact
- **Positive**: Easier maintenance and debugging

---

## 🔍 Debugging Tips

1. **Check Error Codes**: Use the `ErrorCode` enum for consistent error identification
2. **Log Errors**: The system automatically logs errors with context
3. **Test Edge Cases**: Use the convenience error functions for common scenarios
4. **Monitor Responses**: Check the `timestamp` field for error timing

---

**Next Steps**: Start with the critical routes (products, cart, wishlist) and gradually migrate the rest of your API routes to use this standardized system.
