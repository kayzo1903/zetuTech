Here’s a **comprehensive documentation** for your product delete system, covering **architecture, flow, endpoint details, security, and best practices**. This documentation can serve as a reference for developers working on the Muuza project.

---

# **Product Deletion System Documentation**

## **Overview**

The product deletion system allows administrators to **securely delete products** from the Muuza platform. This process:

1. Removes the product record from the database.
2. Deletes all related data such as product attributes, categories, and images.
3. Revalidates affected pages to ensure the UI updates immediately.
4. Provides a smooth UI experience with a confirmation dialog and loading indicators.

---

## **Key Components**

| Component                    | Location                                                         | Purpose                                                  |
| ---------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| API Endpoint                 | `/api/products/[id]/route.ts`                                    | Handles the backend deletion logic and database cleanup. |
| Frontend Page                | `/app/dashboard/allproducts/page.tsx`                            | Displays products with UI to delete.                     |
| Database Tables              | `product`, `productAttribute`, `productCategory`, `productImage` | Stores products and related data.                        |
| Loader Icon (Lucide Loader2) | `lucide-react`                                                   | Displays a loading state during deletion.                |
| Confirmation Dialog          | `@/components/ui/alert-dialog`                                   | Prevents accidental deletions.                           |

---

## **Flow Diagram**

```
Admin clicks Delete button
        │
        ▼
Show confirmation dialog (Are you sure?)
        │
        ▼
Admin confirms deletion
        │
        ▼
Frontend sends DELETE request → `/api/products/[id]`
        │
        ▼
API validates request:
    - Checks authentication
    - Checks admin role
    - Checks product existence
        │
        ▼
Start database transaction:
    1. Delete product attributes
    2. Delete product images
    3. Delete product categories
    4. Delete product record
        │
        ▼
Commit transaction
        │
        ▼
Revalidate pages:
    - `/products`
    - `/dashboard/allproducts`
    - `/product/[slug]`
        │
        ▼
API returns success response
        │
        ▼
Frontend shows success toast and refreshes product list
```

---

## **Backend Endpoint**

### **Route**

```
DELETE /api/products/[id]
```

### **Location**

`app/api/products/[id]/route.ts`

### **Description**

Deletes a product and its related records from the database.
**Only admin users** are authorized to perform this action.

### **Request Parameters**

| Parameter | Type   | Required | Description                                     |
| --------- | ------ | -------- | ----------------------------------------------- |
| `id`      | string | Yes      | The unique identifier of the product to delete. |

Example:

```
DELETE /api/products/12345
```

---

### **Authentication & Authorization**

* The request must include **valid authentication headers** (via `auth.api.getSession`).
* The user must have an **admin role**:

  ```ts
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Only admins can delete products" }, { status: 403 });
  }
  ```

---

### **Response Structure**

| Status Code                 | Description                   | Example Response                                                 |
| --------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `200 OK`                    | Product deleted successfully  | `{ "success": true, "message": "Product deleted successfully" }` |
| `400 Bad Request`           | Missing or invalid product ID | `{ "error": "Product ID is required" }`                          |
| `401 Unauthorized`          | User not authenticated        | `{ "error": "Unauthorized" }`                                    |
| `403 Forbidden`             | User is not an admin          | `{ "error": "Only admins can delete products" }`                 |
| `404 Not Found`             | Product does not exist        | `{ "error": "Product not found" }`                               |
| `500 Internal Server Error` | Unexpected error occurred     | `{ "error": "Internal server error" }`                           |

---

### **Backend Logic**

The deletion is performed inside a **database transaction** to ensure data consistency.

```ts
await dbServer.transaction(async (tx) => {
  await tx.delete(productAttribute).where(eq(productAttribute.productId, productId));
  await tx.delete(productImage).where(eq(productImage.productId, productId));
  await tx.delete(productCategory).where(eq(productCategory.productId, productId));
  await tx.delete(product).where(eq(product.id, productId));
});
```

This guarantees that:

* If **any step fails**, **no changes are saved**.
* No orphan records are left behind.

---

### **Revalidation**

After a product is deleted, Next.js caches must be refreshed so the UI updates immediately.

```ts
revalidatePath("/products");
revalidatePath("/dashboard/allproducts");
if (existingProduct[0].slug) {
  revalidatePath(`/product/${existingProduct[0].slug}`);
}
```

---

## **Frontend Implementation**

### **Page**

`app/dashboard/allproducts/page.tsx`

This page:

* Displays a list of products.
* Provides filters for status, category, brand, and product type.
* Includes an **Edit** and **Delete** button for each product.

---

### **Delete Workflow**

1. **Admin clicks the Trash button**

   * Opens a confirmation dialog to prevent accidental deletion.

2. **Admin confirms deletion**

   * The `handleDelete` function is triggered.

3. **Loading state shown**

   * The trash icon is replaced by a spinning `<Loader2>` icon.
   * The delete button is disabled to prevent multiple clicks.

4. **API request sent**

   * A DELETE request is made to `/api/products/[id]`.

5. **Frontend updates**

   * The product list refreshes.
   * A success or error toast notification is displayed.

---

### **Key Frontend Code Snippet**

```tsx
const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

const handleDelete = async (id: string) => {
  try {
    setDeletingProductId(id); // Show loader for this product
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    await fetchProducts(currentPage, statusFilter, categoryFilter, brandFilter, productTypeFilter);
    toast.success("Product deleted successfully");
  } catch (err) {
    toast.error("Failed to delete product");
  } finally {
    setDeletingProductId(null); // Reset loader state
  }
};
```

---

### **Loader Integration**

Shows a spinning loader when a product is being deleted.

```tsx
<Button
  variant="destructive"
  size="sm"
  className="h-8 w-8 p-0"
  disabled={deletingProductId === product.id}
>
  {deletingProductId === product.id ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <Trash2 className="h-4 w-4" />
  )}
</Button>
```

---

## **Security Considerations**

| Risk                     | Current Mitigation          | Recommendation                                            |
| ------------------------ | --------------------------- | --------------------------------------------------------- |
| Unauthorized deletions   | ✅ Admin check using session | None needed                                               |
| CSRF attacks             | ❌ Not implemented           | Add CSRF tokens or enforce `SameSite=Strict` cookies      |
| Permanent data loss      | ❌ Hard delete only          | Implement **soft deletes** by adding a `deletedAt` column |
| Orphaned external images | ❌ Not handled               | Delete files from cloud storage after DB deletion         |
| Data integrity           | ✅ Transaction used          | None needed                                               |

---

## **Testing Checklist**

| Test Case                        | Expected Result                                         |
| -------------------------------- | ------------------------------------------------------- |
| Delete with valid admin session  | Product is deleted, success toast appears               |
| Delete without authentication    | Returns `401 Unauthorized`                              |
| Delete as non-admin user         | Returns `403 Forbidden`                                 |
| Delete non-existent product      | Returns `404 Not Found`                                 |
| Cancel deletion in dialog        | No deletion occurs                                      |
| Delete multiple products quickly | Only one delete happens at a time due to button disable |
| UI revalidates after delete      | Product disappears from list immediately                |

---

## **Future Improvements**

1. **Soft Delete Implementation**

   * Instead of permanently deleting, mark the product as `deletedAt: Date`.
   * Allows recovery of accidentally deleted products.

2. **Background Cleanup Job**

   * Use a job queue (e.g., BullMQ) to asynchronously delete external images.

3. **Bulk Delete Support**

   * Allow selecting multiple products and deleting them in one request.

4. **Audit Logging**

   * Record who deleted a product and when for better traceability.

---

## **Summary**

This delete system ensures:

* **Secure operations** through authentication and admin-only access.
* **Consistent data handling** using database transactions.
* **Good UX** with confirmation dialogs, loading states, and real-time UI updates.
* **Scalability** with a structure ready for future enhancements like soft deletes and bulk actions.
