Here’s a detailed documentation of how you implemented the **product editing system** in your Next.js/React project using Drizzle ORM, `shadcn/ui`, `zod`, and server-side APIs:

---

## **1. Page Setup**

File: `app/admin-dashboard/products/edit-product/[id]/page.tsx`

* **Purpose:** Displays the edit product page.
* **Implementation:**

  * Uses **dynamic route** `[id]` to fetch the product ID.
  * Imports `EditProduct` component for the form UI.
  * Fetches `params` using `await props.params` (Next.js 13+ server component pattern).
  * Passes the `productId` to the `EditProduct` client component.

```ts
export default async function EditProductsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const productId = params.id;

  return (
    <main className="w-full">
      <EditProduct productId={productId} />
    </main>
  );
}
```

---

## **2. EditProduct Component**

File: `components/admin/admin-edit-page.tsx`

* **Purpose:** Client-side component that handles the product edit form.
* **Key Features:**

  1. **State Management:**

     * Product details, form values, selected categories, images, image previews, switches for discount/warranty.
  2. **Loading Product Data:**

     * Fetches product data from `GET /api/products/get-product/[id]`.
     * Populates the form with existing product values.
     * Sets product type, categories, switches, and image previews.
  3. **Form Handling:**

     * Input changes (`handleInputChange`)
     * Select changes (`handleSelectChange`)
     * Product type changes update relevant categories.
  4. **Image Upload & Removal:**

     * Supports multiple image uploads (max 5).
     * Previews uploaded images.
     * Removes images on click.
  5. **Validation:**

     * Uses `zod` schema (`productSchema`) to validate form data before submission.
     * Shows inline validation errors.
  6. **Form Submission:**

     * Sends `FormData` to `PUT /api/products/update-product/[id]`.
     * Handles new image uploads.
     * Updates product, categories, and images in a transaction.
     * Displays success/error notifications using `sonner` toast.
     * Redirects to `/admin-dashboard/products` after successful update.
  7. **Loading & Submitting UI:**

     * Shows spinner when fetching product data.
     * Disables submit button during submission.

```ts
<EditProduct productId={productId} />
```

---

## **3. API Routes**

### **3.1 Get Product Data**

File: `app/api/products/get-product/[id]/route.ts`

* **Purpose:** Fetch a single product’s data for the edit form.
* **Flow:**

  1. Authenticate user session.
  2. Validate `productId`.
  3. Fetch product from database.
  4. Fetch related categories, images, and attributes.
  5. Return formatted product JSON.

```ts
GET /api/products/get-product/[id]
```

**Response Example:**

```json
{
  "product": {
    "id": "uuid",
    "name": "Dell XPS 13",
    "brand": "Dell",
    "productType": "laptop",
    "categories": ["Ultrabook", "High-End"],
    "images": ["url1", "url2"],
    "stock": 10,
    "stockStatus": "In Stock",
    "status": "Brand New",
    "description": "High-end ultrabook",
    "hasDiscount": false,
    "originalPrice": "1500000",
    "salePrice": null,
    "hasWarranty": true,
    "warrantyPeriod": 365,
    "warrantyDetails": "Manufacturer warranty"
  }
}
```

---

### **3.2 Update Product**

File: `app/api/products/update-product/[id]/route.ts`

* **Purpose:** Update product details in the database.
* **Flow:**

  1. Authenticate session & verify admin role.
  2. Validate `productId`.
  3. Parse `FormData` from client.
  4. Validate input using `productSchema`.
  5. Upload new images to storage (if any).
  6. Start a database transaction:

     * Update product record.
     * Update product categories (delete old, insert new).
     * Update images (delete old, insert new if provided).
  7. Revalidate Next.js cache for affected paths (`/products`, `/admin-dashboard/products`, product detail pages).
  8. Return success response.

```ts
PUT /api/products/update-product/[id]
```

**Validation & Error Handling:**

* Uses `ZodError` to catch validation issues.
* Returns 400 for validation errors, 401 for unauthorized, 403 for forbidden, and 500 for server errors.

---

## **4. Form Fields & Features**

| Section        | Fields / Features                                                  |
| -------------- | ------------------------------------------------------------------ |
| Product Type   | Select from `PRODUCT_TYPES`, loads relevant categories dynamically |
| Basic Details  | Name, Brand, Stock Quantity, Stock Status                          |
| Pricing        | Original Price, Sale Price (toggle discount)                       |
| Warranty       | Warranty switch, Period, Details                                   |
| Categories     | Dynamic buttons based on product type                              |
| Product Status | Select from `PRODUCT_STATUS`                                       |
| Description    | Textarea for detailed description                                  |
| Image Upload   | Multiple files, previews, remove existing, max 5 images            |
| Actions        | Cancel button, Update button with spinner during submission        |

---

## **5. Validation Rules**

* Required: `productType`, `name`, `brand`, `stock`, `status`, `description`, `categories`.
* Numeric validation: `stock`, `originalPrice`, `salePrice` (if discount enabled).
* Conditional validation: `salePrice` required if discount enabled, warranty fields required if warranty enabled.
* Image validation: max 5 images allowed.

---

## **6. Notes on Implementation**

* **React Hooks:** `useState`, `useEffect`, `useCallback` for form management and API calls.
* **Server-side & Client-side separation:**

  * Page component: Server component
  * Edit form: Client component (`"use client";`)
* **Error Handling:** Both frontend (inline) and backend (API response) errors are displayed.
* **Image Handling:** Existing images are preserved unless new ones are uploaded.
* **SEO Updates:** Handles `slug`, `metaTitle`, `metaDescription`, and `keywords`.

---

✅ **In summary:**
Your system provides a **full-featured product editing workflow**, including dynamic form population, validation, image management, category selection, discount/warranty toggles, and secure API endpoints for data persistence. It’s modular, secure, and integrates both **frontend and backend validation** with **Next.js server and client components**.

---

If you want, I can also create a **diagram showing the data flow from frontend to backend and database** for your edit system—it will make it super easy to visualize for documentation or onboarding.

Do you want me to create that diagram?
