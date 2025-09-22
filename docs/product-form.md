# Complete Product Management System Documentation

## Overview

This document explains the complete product management system implementation, including validation schemas, form components, API routes, database schema, and SEO enhancements.

## 1. Validation Schema (`/lib/validation-schemas/products-schema.ts`)

### Purpose
The validation schema ensures data integrity and consistency throughout the application by validating all product-related data.

### Key Components

```typescript
export const STOCK_STATUS = [
  "Archived", "Out of Stock", "In Stock", "Low Stock", "Preorder",
  "Discontinued", "Backordered", "Limited Stock", "Available Soon",
  "Temporarily Unavailable", "Coming Soon", "Special Order",
  "In Transit", "On Hold", "Reserved", "For Parts or Not Working"
] as const;

export const productSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  name: z.string().min(1, "Product name is required").max(255),
  brand: z.string().min(1, "Brand is required").max(100),
  stock: z.number().min(0, "Stock cannot be negative").int(),
  stockStatus: z.enum(STOCK_STATUS).default("In Stock"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  status: z.enum(["Brand New", "Refurbished", "Used-like New", "Used-Good", "Used-Fair"]),
  description: z.string().min(1, "Description is required").max(2000),
  images: z.array(z.any()).min(1, "At least one image is required").max(5),
  hasDiscount: z.boolean().default(false),
  originalPrice: z.number().min(0, "Price cannot be negative"),
  salePrice: z.number().min(0, "Sale price cannot be negative").optional(),
  hasWarranty: z.boolean().default(false),
  warrantyPeriod: z.string().optional(),
  warrantyDetails: z.string().max(500, "Warranty details are too long").optional(),
}).refine((data) => {
  // Custom validation: Sale price must be less than original price
  if (data.hasDiscount && data.salePrice !== undefined) {
    return data.salePrice < data.originalPrice;
  }
  return true;
}, {
  message: "Sale price must be less than original price",
  path: ["salePrice"],
}).refine((data) => {
  // Custom validation: Warranty period required when warranty is enabled
  if (data.hasWarranty) {
    return data.warrantyPeriod !== undefined && data.warrantyPeriod !== "";
  }
  return true;
}, {
  message: "Warranty period is required when warranty is enabled",
  path: ["warrantyPeriod"],
});
```

## 2. Database Schema (`/db/schema.ts`)

### Enhanced with SEO and Stock Status

```typescript new updates use uuid system for ids
// Product table with SEO enhancements
export const product = pgTable("product", {
  id: serial("id").primaryKey(), // new id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"), // SEO: For meta descriptions
  brand: varchar("brand", { length: 100 }).notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default('Draft').notNull(),
  stockStatus: varchar("stock_status", { length: 50 }) // NEW: Stock status field
    .default(STOCK_STATUS.IN_STOCK)
    .notNull(),
  // SEO fields
  slug: varchar("slug", { length: 300 }).notNull().unique(), // SEO: URL-friendly
  metaTitle: varchar("meta_title", { length: 300 }), // SEO: Custom title
  metaDescription: text("meta_description"), // SEO: Custom description
  keywords: text("keywords"), // SEO: Search keywords
  structuredData: text("structured_data"), // SEO: JSON-LD for rich snippets
  sku: varchar("sku", { length: 100 }).unique(), // SEO: Product identifier
  upc: varchar("upc", { length: 50 }), // SEO: Product identifier
  // ... other fields
});

// Additional SEO-related tables
export const productSeoClick = pgTable("product_seo_click", {
  id: serial("id").primaryKey(),  // new id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: integer("product_id").references(() => product.id),
  query: text("query").notNull(), // SEO: Track search queries
  position: integer("position"), // SEO: Search result position
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});

export const searchQuery = pgTable("search_query", {
  id: serial("id").primaryKey(),  // new id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(), // SEO: Popular search terms
  resultCount: integer("result_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}); 
```

## 3. Product Form Component

### Key Features
- Dynamic category loading based on product type
- Image upload with preview (max 5 images)
- Conditional fields (discount, warranty)
- Real-time validation
- Stock status selection

### Implementation Highlights

```typescript
// Dynamic category loading
const handleProductTypeChange = (type: string) => {
  setProductType(type as ProductTypeKey);
  setCategories(PRODUCT_CATEGORIES[type as ProductTypeKey] || []);
  setSelectedCategories([]);
};

// Image handling
const handleImageUpload = (files: FileList | null) => {
  if (!files) return;
  const newImages = Array.from(files).map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }));
  setImages((prev) => [...prev, ...newImages].slice(0, 5));
};

// Form validation
const validateForm = () => {
  try {
    const data = {
      productType,
      name: formData.name,
      brand: formData.brand,
      stock: parseInt(formData.stock) || 0,
      stockStatus: formData.stockStatus, // NEW: Stock status
      categories: selectedCategories,
      status: formData.status,
      description: formData.description,
      images: images.map(img => img.file),
      hasDiscount,
      originalPrice: parseFloat(formData.originalPrice) || 0,
      salePrice: hasDiscount ? (parseFloat(formData.salePrice) || 0) : undefined,
      hasWarranty,
      warrantyPeriod: hasWarranty ? formData.warrantyPeriod : undefined,
      warrantyDetails: hasWarranty ? formData.warrantyDetails : undefined,
    };
    productSchema.parse(data);
    setErrors({});
    return true;
  } catch (error) {
    // Error handling
  }
};
```

## 4. API Route (`/app/api/products/route.ts`)

### POST Endpoint - Create Product

```typescript
export async function POST(request: NextRequest) {
  try {
    // Authentication and authorization
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Form data extraction
    const formData = await request.formData();
    const productType = formData.get("productType") as string;
    const stockStatus = formData.get("stockStatus") as string || STOCK_STATUS.IN_STOCK;
    // ... other fields

    // SEO fields extraction
    const slug = formData.get("slug") as string || slugify(name);
    const metaTitle = formData.get("metaTitle") as string || name;
    const metaDescription = formData.get("metaDescription") as string || 
      (shortDescription || description.substring(0, 160));

    // Validation
    const validatedData = productSchema.parse({
      productType,
      name,
      brand,
      stock,
      stockStatus, // NEW: Include stock status in validation
      categories,
      status,
      description,
      images: imageFiles,
      hasDiscount,
      originalPrice,
      salePrice,
      hasWarranty,
      warrantyPeriod,
      warrantyDetails,
    });

    // Database transaction
    const newProduct = await dbServer.transaction(async (tx) => {
      // Create product with SEO fields
      const [productResult] = await tx.insert(product).values({
        name: validatedData.name,
        description: validatedData.description,
        shortDescription: shortDescription,
        brand: validatedData.brand,
        productType: validatedData.productType,
        status: validatedData.status,
        stockStatus: stockStatus, // NEW: Store stock status
        // SEO fields
        slug: slug,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        keywords: keywords,
        sku: sku,
        upc: upc,
        userId: session.user.id,
      }).returning();

      // Add categories, images, attributes
      // ...

      return productResult;
    });

    // Revalidate paths for ISR
    revalidatePath("/products");
    revalidatePath("/admin-dashboard/products");
    revalidatePath(`/products/${slug}`); // NEW: Revalidate product page by slug

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    // Error handling
  }
}
```

### GET Endpoint - Fetch Products with Filtering

```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const stockStatus = searchParams.get('stockStatus'); // NEW: Filter by stock status
    const search = searchParams.get('search');
    
    // Build dynamic WHERE clause
    const whereConditions = [];
    if (category) whereConditions.push(`pc.category = '${category}'`);
    if (status) whereConditions.push(`p.status = '${status}'`);
    if (stockStatus) whereConditions.push(`p.stockStatus = '${stockStatus}'`); // NEW
    if (search) whereConditions.push(`(p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%')`);
    
    // Execute query with pagination
    const products = await dbServer.execute(`
      SELECT 
        p.*,
        json_agg(DISTINCT pc.category) as categories,
        json_agg(DISTINCT pi.url) as images
      FROM product p
      LEFT JOIN product_category pc ON p.id = pc.productId
      LEFT JOIN product_image pi ON p.id = pi.productId
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    
    return NextResponse.json({
      products: products.rows,
      pagination: { page, limit, totalCount, totalPages }
    });
  } catch (error) {
    // Error handling
  }
}
```

## 5. SEO Concepts Introduced

### 1. **URL Optimization**
- **Slug Field**: URL-friendly product names (`/product/iphone-13-pro` instead of `/product/123`)
- **Category Slugs**: SEO-friendly category URLs

### 2. **Meta Tags Optimization**
- **Meta Title**: Customizable title tags for search engines
- **Meta Description**: Compelling descriptions for search results
- **Keywords**: Relevant search terms for internal and external search

### 3. **Structured Data (Schema.org)**
- **JSON-LD**: Rich snippets for products (price, availability, ratings)
- **Enhanced Search Results**: Star ratings, pricing, and stock status in SERPs

### 4. **Content Optimization**
- **Short Description**: Concise product summary for meta descriptions
- **Image Optimization**: Alt text and titles for better image search

### 5. **Search Analytics**
- **Query Tracking**: What users are searching for on your site
- **Click Tracking**: Which products get clicks from search results
- **Position Tracking**: Search ranking performance

### 6. **Technical SEO**
- **Revalidation**: ISR for updated product pages
- **Pagination**: SEO-friendly pagination for product listings
- **Filtering**: URL parameters for filtered views

### 7. **E-commerce SEO Specifics**
- **Product Identifiers**: SKU and UPC for product recognition
- **Stock Status**: Real-time availability information
- **Condition**: Product condition (New, Used, etc.) for filtered search

## 6. Implementation Benefits

1. **Improved Search Visibility**: Better meta tags and structured data
2. **Enhanced User Experience**: Clean URLs and relevant search results
3. **Data-Driven Decisions**: Search analytics to inform content strategy
4. **Technical SEO Excellence**: Proper implementation of SEO best practices
5. **E-commerce Optimization**: Product-specific SEO features

## 7. Utility Functions

```typescript
// lib/utils.ts
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Generate structured data for a product
export function generateProductStructuredData(product: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.metaDescription || product.description,
    "sku": product.sku,
    "mpn": product.upc,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://yourdomain.com/product/${product.slug}`,
      "priceCurrency": "TZS",
      "price": product.salePrice || product.originalPrice,
      "availability": product.stockStatus === "In Stock" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": `https://schema.org/${product.status.replace(' ', '')}Condition`
    }
  };
}
```

This comprehensive implementation provides a robust product management system with advanced SEO capabilities, ensuring your products are both well-managed and highly visible in search results.