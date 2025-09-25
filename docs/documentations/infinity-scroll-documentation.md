# **Infinity Scroll System Documentation**

## **1. Overview**

The Infinity Scroll system dynamically loads products as the user scrolls down the page, eliminating the need for pagination buttons. This provides a smooth, seamless experience for browsing large product catalogs.

**Core technologies used:**

* **Next.js (App Router)** – server-side rendering and API routing.
* **TanStack React Query** – caching, state management, and infinite pagination.
* **Drizzle ORM + Neon** – database access and queries.
* **React Hooks** – managing scroll events and UI behavior.

---

## **2. Why Use TanStack `useInfiniteQuery`**

Traditionally, infinite scroll requires manually managing:

* Current page number
* Fetched data merging
* Loading and error states
* Avoiding duplicate network requests

TanStack `useInfiniteQuery` simplifies this by handling:

* **Automatic pagination**: Tracks offsets and determines when to load more data.
* **Caching**: Prevents refetching already loaded pages.
* **Built-in states**: `isLoading`, `isFetchingNextPage`, `isError`, etc.
* **Merge pages**: Combines multiple pages into one final data array.
* **Retry logic**: Automatically retries failed requests.

---

### **Why It's Better Than Manual State**

| Feature               | Manual Approach                  | TanStack `useInfiniteQuery` |
| --------------------- | -------------------------------- | --------------------------- |
| Fetching data         | Manual useEffect and fetch calls | Built-in via `queryFn`      |
| Handling scroll logic | You implement custom logic       | Only handle scroll trigger  |
| Merge paginated data  | Manual array concatenation       | Built-in `.pages.flatMap()` |
| Cache management      | None, must code manually         | Automatic cache             |
| Retry on failure      | Must implement yourself          | Built-in retry mechanism    |

> **Conclusion**:
> `useInfiniteQuery` makes the code cleaner, scalable, and production-ready.

---

## **3. Data Flow**

Here’s how data flows through the system:

```
User Scrolls Down
        ↓
Scroll Event Triggers `fetchNextPage`
        ↓
`useInfiniteQuery` calls API: /api/products/infinity?offset=8&limit=8
        ↓
Backend fetches paginated products from database
        ↓
API returns JSON:
{
  products: [...],
  hasMore: true,
  nextOffset: 16
}
        ↓
React Query merges new products into the cache
        ↓
UI updates automatically with new products
```

---

## **4. Backend Setup**

### **Endpoint: `/api/products/infinity`**

This endpoint is responsible for:

* Fetching products from the database.
* Returning pagination metadata (`hasMore` and `nextOffset`).

#### Code Example

```typescript
// app/api/products/infinity/route.ts
import { NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { getInfinityProducts } from "@/lib/server/get-infinityProduct";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  // Get total product count
  const totalCountResult = await dbServer
    .select({ count: sql<number>`COUNT(*)` })
    .from("product");
  const totalCount = totalCountResult[0]?.count || 0;

  // Fetch paginated products
  const products = await getInfinityProducts(offset, limit);

  return NextResponse.json({
    products,
    hasMore: offset + products.length < totalCount,
    nextOffset: offset + limit,
    totalCount,
  });
}
```

---

### **Database Query Function**

The `getInfinityProducts` function handles querying the database for paginated products and their associated images.

```typescript
// lib/server/get-infinityProducts.ts
import { dbServer } from "@/db/db-server";
import { product, productImage } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";

export async function getInfinityProducts(offset = 0, limit = 12) {
  const rows = await dbServer
    .select({
      id: product.id,
      name: product.name,
      description: product.description,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      slug: product.slug,
      createdAt: product.createdAt,
    })
    .from(product)
    .orderBy(desc(product.createdAt))
    .limit(limit)
    .offset(offset);

  if (rows.length === 0) return [];

  const productIds = rows.map((p) => p.id);

  const images = await dbServer
    .select({
      productId: productImage.productId,
      url: productImage.url,
    })
    .from(productImage)
    .where(inArray(productImage.productId, productIds));

  return rows.map((p) => ({
    ...p,
    images:
      images
        .filter((img) => img.productId === p.id)
        .map((img) => img.url) || ["/images/placeholder.png"],
  }));
}
```

---

## **5. Frontend Setup**

### **Hook: `useInfinityProducts`**

Handles communication with the API and manages product state.

```typescript
// hooks/useInfinityProducts.ts
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfinityProducts(limit = 12) {
  return useInfiniteQuery({
    queryKey: ["products", "infinity"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/products/infinity?offset=${pageParam}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
  });
}
```

---

### **Component: `InfinityProducts`**

Renders products and listens for scroll events to trigger `fetchNextPage`.

```typescript
"use client";

import { useEffect, useCallback } from "react";
import { useInfinityProducts } from "@/hooks/useInfinityProducts";
import ProductCard from "../cards/productcards";

export default function InfinityProducts({ initialProducts = [] }) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityProducts(8);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Register scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const products = data?.pages.flatMap((page) => page.products) || initialProducts;

  return (
    <section className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Status messages */}
      <div className="text-center mt-8">
        {isLoading && <p>Loading products...</p>}
        {isFetchingNextPage && <p>Loading more...</p>}
        {!hasNextPage && products.length > 0 && <p>🎉 You've reached the end!</p>}
        {!isLoading && products.length === 0 && <p>No products found</p>}
      </div>
    </section>
  );
}
```

---

## **6. Initial Data Fetching (Server-Side)**

To improve performance, you fetch the **first batch** of products on the server and pass them to the client.

```typescript
// app/page.tsx
import InfinityProducts from "@/components/landing-page-components/infinityProducts";
import { getInfinityProducts } from "@/lib/server/get-infinityProducts";

export default async function Home() {
  const initialProducts = await getInfinityProducts(0, 8);

  return (
    <div>
      <InfinityProducts initialProducts={initialProducts} />
    </div>
  );
}
```

---

## **7. Key Features and Behavior**

| Feature                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| **Initial Load**        | Fetches first `limit` products on server render. |
| **Scroll Detection**    | Triggers new fetch when nearing page bottom.     |
| **Caching**             | Previously fetched pages are cached.             |
| **Retry on Failure**    | Automatically retries failed requests.           |
| **Loading State**       | Shows spinner while loading products.            |
| **End of List Message** | Displays when `hasMore` is `false`.              |
| **Empty State**         | Displays when no products are found.             |

---

## **8. Performance Optimizations**

1. **React Query Caching** – Prevents refetching of already loaded pages.
2. **Server-side initial fetch** – Reduces first contentful paint (FCP).
3. **Scroll threshold** – Fetches before the user reaches the exact bottom for a smooth experience.
4. **Fallback image handling** – Avoids UI breakages when a product has no image.

---

## **9. Example API Response**

Here’s what the `/api/products/infinity` endpoint returns:

```json
{
  "products": [
    {
      "id": 1,
      "name": "iPhone 15",
      "description": "Latest iPhone model",
      "originalPrice": 1200,
      "salePrice": 999,
      "images": ["/uploads/iphone15.jpg"],
      "slug": "iphone-15"
    }
  ],
  "hasMore": true,
  "nextOffset": 8,
  "totalCount": 50
}
```

---

## **10. Summary**

* **TanStack `useInfiniteQuery`** streamlines infinite scroll by handling pagination, merging data, and caching.
* The **backend API** provides structured, paginated data with `hasMore` and `nextOffset`.
* The **frontend component** listens for scroll events and triggers loading more products when needed.
* With proper caching, fallback images, and smooth scrolling, this system is production-ready and scalable for large catalogs.
