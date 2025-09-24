# Featured Product System Documentation

## Overview

The Featured Product system allows administrators to highlight specific products on the homepage. Only one product can be featured at a time. When a new product is featured, any previously featured product is automatically deactivated.

## Database Schema

### Featured Product Table

```sql
featured_product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' NOT NULL, -- 'active' or 'inactive'
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, -- Admin who featured the product
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
)
```

### Status Definitions

```typescript
export const FEATURED_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;
```

## API Endpoints

### Update Product (Includes Featured Status)

**Endpoint:** `PUT /api/products/update-product/[id]`

**Functionality:** Updates product details and handles featured product status

**Key Features:**
- Updates product information
- Manages featured product status
- Handles image uploads
- Updates categories
- Revalidates relevant pages

## Core Logic

### Featured Product Handler Function

```typescript
/**
 * Simplified function to handle featured product status
 * @param productId - The ID of the product to feature
 * @param userId - The ID of the admin user performing the action
 * @param shouldBeFeatured - Boolean indicating if the product should be featured
 */
async function handleFeaturedProduct(
  productId: string,
  userId: string,
  shouldBeFeatured: boolean
) {
  // Always deactivate ALL currently active featured products first
  await dbServer
    .update(featuredProduct)
    .set({
      status: "inactive",
      updatedAt: new Date(),
    })
    .where(eq(featuredProduct.status, "active"));

  // Only proceed if we want to feature this product
  if (shouldBeFeatured) {
    // Insert new featured product
    await dbServer.insert(featuredProduct).values({
      id: uuidv4(),
      productId,
      userId,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
```

## Frontend Implementation

### Edit Product Component Features

**Featured Product Toggle:**
- Switch component to enable/disable featuring
- Visual indicator with star icon
- Informational note when featured

**Key State Management:**
```typescript
const [isFeatured, setIsFeatured] = useState<boolean>(false);
```

**Form Integration:**
- Included in product validation schema
- Sent as part of form data (`isFeatured` field)
- Handled during form submission

## Validation Schema

### Product Schema Includes Featured Field

```typescript
isFeatured: z.boolean().default(false)
```

### Update Schema Allows Empty Images

```typescript
images: z.array(z.any()).min(0).max(5) // Allow empty array for updates
```

## Business Rules

### Single Featured Product
- Only one product can be featured at a time
- Featuring a new product automatically deactivates the current featured product
- No duplicate active featured products allowed

### Admin-Only Access
- Only users with `role: "admin"` can feature products
- Featured product actions are tracked with user ID

### Data Integrity
- Featured products reference valid product IDs
- CASCADE delete ensures cleanup when products are removed
- Timestamps track when products were featured

## Page Revalidation

When a product's featured status changes, the system revalidates:

```typescript
revalidatePath("/products");
revalidatePath("/admin-dashboard/products");
revalidatePath(`/product/${slug}`);
revalidatePath(`/product/${existingProduct[0].slug}`);
revalidatePath("/"); // Homepage to reflect featured product changes
```

## Error Handling

### Validation Errors
- Zod schema validation ensures data integrity
- Proper error messages for failed validations
- Frontend error state management

### Database Operations
- Transaction-based updates for data consistency
- Proper error handling for database failures
- Rollback on transaction failures

## Usage Flow

1. **Admin accesses product edit page**
2. **Toggles "Feature this Product" switch**
3. **System validates all product data**
4. **On submission:**
   - Deactivates any currently featured product
   - Activates the new featured product
   - Updates product details
   - Revalidates affected pages
5. **User receives success feedback**

## Security Considerations

- **Authentication Required**: Only logged-in users can access
- **Authorization Check**: Only admin users can feature products
- **Input Validation**: Comprehensive Zod schema validation
- **SQL Injection Protection**: Using Drizzle ORM with parameterized queries

## Performance Considerations

- **Efficient Queries**: Single transaction for all updates
- **Smart Revalidation**: Only necessary paths are revalidated
- **Image Optimization**: Cloudflare R2 integration for efficient storage
- **Caching Strategy**: Next.js revalidation for optimal performance

## Monitoring and Logging

- Console logging for debugging validation errors
- Error tracking for failed operations
- User action tracking via user_id references

This system provides a robust and user-friendly way to manage featured products while maintaining data integrity and performance.