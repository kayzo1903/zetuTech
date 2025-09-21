# Product Management System

## Overview
This document describes the complete product management system for ZetuTech, including database schema, API endpoints, and frontend components.

## Database Schema

### Products Table
The main products table stores all product information:

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  status product_status NOT NULL DEFAULT 'Brand New',
  is_new BOOLEAN NOT NULL DEFAULT false,
  processor TEXT NOT NULL,
  ram TEXT NOT NULL,
  storage TEXT NOT NULL,
  graphics TEXT NOT NULL,
  display TEXT NOT NULL,
  warranty TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);
```

### Enums
- **product_status**: Brand New, Refurbished, Used-Like New, Used-Good, Used-Fair
- **product_category**: Ultrabooks, Gaming Laptops, Business Laptops, etc.

## API Endpoints

### POST /api/products
Creates a new product.

**Request Body (FormData):**
```typescript
{
  name: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categories: string[];
  status: string;
  isNew: boolean;
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  display: string;
  warranty: string;
  specs: string[];
  images: Array<{ file?: File; preview: string }>;
}
```

**Response:**
```typescript
{
  success: boolean;
  product: Product;
  message: string;
}
```

### GET /api/products
Fetches products with optional filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `search`: Search term

**Response:**
```typescript
{
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

## Frontend Components

### AddProductForm
Located at `components/admin/addProduct.tsx`

**Features:**
- Form validation using Zod
- Image upload with preview
- Multi-category selection
- Real-time validation
- Success/error notifications
- Redirect to product list on success

### ProductsList
Located at `app/admin-dashboard/products/page.tsx`

**Features:**
- Product listing with pagination
- Search and filter functionality
- Product actions (view, edit, delete)
- Status badges and stock indicators
- Responsive design

## Usage Examples

### Creating a Product
```typescript
import { createProduct } from "@/lib/api/products";

const productData = {
  name: "Dell XPS 13",
  brand: "Dell",
  model: "XPS 13 9310",
  price: 1500000,
  originalPrice: 1800000,
  stock: 10,
  categories: ["Ultrabooks", "Business Laptops"],
  status: "Brand New",
  isNew: true,
  processor: "Intel Core i7-1165G7",
  ram: "16GB LPDDR4X",
  storage: "512GB SSD",
  graphics: "Intel Iris Xe",
  display: "13.4\" FHD+ InfinityEdge",
  warranty: "1 Year",
  specs: ["Windows 11 Home", "Backlit Keyboard", "Thunderbolt 4"],
  images: [
    { file: imageFile, preview: "blob:..." }
  ]
};

const result = await createProduct(productData);
```

### Fetching Products
```typescript
import { getProducts } from "@/lib/api/products";

// Get all products
const allProducts = await getProducts();

// Get products with filters
const filteredProducts = await getProducts({
  page: 1,
  limit: 20,
  category: "Gaming Laptops",
  search: "Dell"
});
```

## Security Features

### Role-Based Access Control
- Only admin users can create/edit products
- API endpoints check user authentication and role
- Middleware protects admin routes

### Data Validation
- Zod schema validation on both client and server
- Type-safe form handling
- Input sanitization

## File Structure

```
├── app/
│   ├── api/products/
│   │   └── route.ts              # Product API endpoints
│   └── admin-dashboard/products/
│       ├── page.tsx              # Products list page
│       └── add/
│           └── page.tsx          # Add product page
├── components/
│   └── admin/
│       ├── addProduct.tsx        # Add product form
│       └── uploadFileMessages.tsx # Upload UI components
├── db/
│   └── schema.ts                 # Database schema
├── lib/
│   ├── api/
│   │   └── products.ts           # Product API utilities
│   └── validation-schemas/
│       ├── products.ts           # Product validation schema
│       └── categories.ts         # Category constants
└── migrations/
    └── 001_create_products.sql   # Database migration
```

## Next Steps

1. **Image Upload**: Implement actual image upload to cloud storage (AWS S3, Cloudinary)
2. **Search**: Add full-text search functionality
3. **Bulk Operations**: Add bulk edit/delete features
4. **Product Variants**: Support for product variants (colors, sizes)
5. **Inventory Management**: Low stock alerts, inventory tracking
6. **Analytics**: Product performance metrics
7. **SEO**: Generate meta tags and sitemaps
8. **Caching**: Implement Redis caching for better performance

## Environment Variables

Add these to your `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zetutech"

# Image Upload (when implemented)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Or for AWS S3
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="your_region"
AWS_S3_BUCKET="your_bucket_name"
```
