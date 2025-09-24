Got it — let's **complement and document the New Arrival system** so it’s clear for future development and for any developer joining the project.

We’ll cover:

1. **High-Level Overview** – What the feature does and why it exists.
2. **Technical Architecture** – Flow of data between components.
3. **Database Layer** – Structure and queries.
4. **Server Layer** – Business logic and transformations.
5. **Frontend Layer** – Display and UX.
6. **SEO and Performance Considerations**.
7. **Future Improvements**.

---

## **1. High-Level Overview**

### **Feature Name:** New Arrivals Section

The "New Arrivals" section is a **homepage feature** on the Muuza platform that showcases the **latest products added to the system**, limited to **4 items**.

* **Goal:** Give users a quick preview of the newest products without overwhelming them.
* **User Flow:**

  * Homepage loads and displays **4 newest products**.
  * Each product shows:

    * Image
    * Name
    * Price
  * A **"Load More" button** redirects to `/products`, where users can see the **full product catalog** with pagination and filters.

**Real-world analogy:**
This is like the front shelf in a supermarket showcasing just a few new items to catch customers’ attention before they browse the full store.

---

## **2. Technical Architecture**

Here's the **flow of data** from the database to the UI:

```
Database (PostgreSQL with Drizzle)
        |
        v
Backend Query (Drizzle ORM + Neon)
        |
        v
getNewArrivals() [Server Function]
  - Fetches latest 4 products
  - Fetches related images
  - Normalizes data (null -> undefined)
        |
        v
page.tsx [Server-Side Rendered]
  - Calls getNewArrivals()
  - Passes products as props
        |
        v
NewArrival Component [Client UI]
  - Displays preview grid of products
  - "Load More" -> /products page
```

**Why SSR (Server-Side Rendering)?**

* Better **SEO indexing** by Google.
* Faster **first contentful paint (FCP)**.
* Preloaded data for improved user experience.

---

## **3. Database Layer**

### **Tables Involved**

| Table Name     | Purpose                              |
| -------------- | ------------------------------------ |
| `product`      | Stores core product information      |
| `productImage` | Stores image URLs linked to products |

---

### **Product Table (Simplified Schema)**

| Column             | Type         | Notes                          |
| ------------------ | ------------ | ------------------------------ |
| `id`               | UUID         | Primary key                    |
| `name`             | TEXT         | Product name                   |
| `description`      | TEXT         | Full description               |
| `shortDescription` | TEXT NULL    | Optional summary               |
| `brand`            | TEXT         | Product brand                  |
| `productType`      | TEXT         | Category type                  |
| `originalPrice`    | DECIMAL      | Original price                 |
| `salePrice`        | DECIMAL NULL | Discounted price if available  |
| `hasDiscount`      | BOOLEAN      | True if product has a discount |
| `stock`            | INT          | Available quantity             |
| `stockStatus`      | TEXT         | In Stock, Out of Stock, etc.   |
| `status`           | TEXT         | Published, Draft, etc.         |
| `slug`             | TEXT         | SEO-friendly product URL       |
| `createdAt`        | TIMESTAMP    | Sorting by latest products     |

---

### **Product Image Table**

| Column      | Type | Notes                        |
| ----------- | ---- | ---------------------------- |
| `id`        | UUID | Primary key                  |
| `productId` | UUID | Foreign key to product table |
| `url`       | TEXT | Image path/URL               |

---

### **Query: Fetch Latest Products**

```ts
// lib/api.ts
import { db } from "@/lib/db";
import { product, productImage } from "@/lib/schema";
import { desc, inArray } from "drizzle-orm";

export async function fetchLatestProducts(limit = 4) {
  // 1. Fetch latest products
  const rows = await db
    .select({
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      brand: product.brand,
      productType: product.productType,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      hasDiscount: product.hasDiscount,
      stock: product.stock,
      stockStatus: product.stockStatus,
      status: product.status,
      slug: product.slug,
      createdAt: product.createdAt,
    })
    .from(product)
    .orderBy(desc(product.createdAt))
    .limit(limit);

  if (rows.length === 0) return [];

  // 2. Fetch related product images
  const productIds = rows.map((p) => p.id);

  const images = await db
    .select({
      productId: productImage.productId,
      url: productImage.url,
    })
    .from(productImage)
    .where(inArray(productImage.productId, productIds));

  // 3. Map products with images
  return rows.map((p) => ({
    ...p,
    shortDescription: p.shortDescription ?? undefined,
    salePrice: p.salePrice ?? undefined,
    images: images.filter((img) => img.productId === p.id).map((img) => img.url),
    categories: [], // placeholder for future category fetch
  }));
}
```

---

## **4. Server Layer**

### **Function: `getNewArrivals`**

* **Responsibility:**
  Acts as the single source of truth for the frontend when fetching new arrival data.

* **Steps Performed:**

  1. Fetch latest products from `product` table (ordered by `createdAt DESC`).
  2. Fetch associated images in bulk using `inArray`.
  3. Transform data to match `Product` interface:

     * Convert `null` → `undefined` for `shortDescription` and `salePrice`.
     * Attach images.
     * Include placeholder categories.
  4. Return final structured array of products.

---

## **5. Frontend Layer**

### **Home Page (`page.tsx`)**

* **Server-Side Rendering**
  The homepage directly calls `getNewArrivals()` to fetch data at build time or per request.

```tsx
// app/(storefront)/page.tsx
import { getNewArrivals } from "@/lib/server/get-newArrival";
import NewArrival from "@/components/NewArrival";

export default async function HomePage() {
  const latestProducts = await getNewArrivals(4);

  return (
    <div>
      <NewArrival products={latestProducts} />
    </div>
  );
}
```

---

### **New Arrival Component**

```tsx
// components/NewArrival.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Zap, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types/product";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              New Arrivals
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Freshly added premium products with exclusive discounts
            </p>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition group"
          >
            View All
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            <div className="flex space-x-6 min-w-max">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <Link href={`/products/${product.slug}/${product.id}`} className="block group">
                    {/* Product Image Container */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Discount Badge */}
                      {product.hasDiscount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                      {/* Product Name */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 h-14">
                          {product.name}
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center mb-4">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {Number(product.salePrice || product.originalPrice).toLocaleString()} TZS
                        </span>
                        {product.hasDiscount && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            {Number(product.originalPrice).toLocaleString()} TZS
                          </span>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>New</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-amber-500" />
                          <span>{product.stock > 0 ? "In stock" : "Out of stock"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll gradient indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 pointer-events-none" />
        </div>

        {/* View All Button for Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            View All Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

## **6. SEO & Performance**

| Aspect                    | Implementation Detail                                                             |
| ------------------------- | --------------------------------------------------------------------------------- |
| **SEO-friendly URLs**     | Use `slug` field for product detail pages. Example: `/products/dell-inspiron-15`. |
| **Server-Side Rendering** | Homepage fetches data on the server for faster first paint and indexable content. |
| **Lightweight Homepage**  | Limit to 4 products only for performance and UX.                                  |
| **Lazy Loading Images**   | Use `<img loading="lazy">` for better performance.                                |

---

## **7. Future Improvements**

| Improvement                   | Description                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **Category Integration**      | Fetch product categories and include them in `NewArrival`.                    |
| **Image Optimization**        | Use Next.js `<Image>` component for automatic resizing and CDN delivery.      |
| **Pagination on `/products`** | Implement infinite scroll or "Load More" pagination on the main catalog page. |
| **Caching**                   | Add caching via `next/cache` or Vercel for faster response times.             |
| **Filtering & Sorting**       | Let users filter by brand, category, or price.                                |
| **Analytics Tracking**        | Track which products users click on in the "New Arrivals" section.            |

---

## **Summary**

The New Arrival system provides a **lightweight, SEO-optimized, and scalable way** to display recent products on the homepage.

* **Data is fetched on the server** using Drizzle ORM for SEO benefits.
* The `getNewArrivals` function normalizes and prepares data for consistent use across the frontend.
* The homepage shows **only 4 products**, while the `/products` page displays the **full catalog with pagination**.
* Future enhancements include categories, caching, and image optimization.

This documentation ensures that future developers understand the reasoning, structure, and next steps for this feature.
