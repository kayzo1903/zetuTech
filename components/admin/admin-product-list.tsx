// app/dashboard/allproducts/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

// Types for the product data from API
interface Product {
  id: string;
  name: string;
  brand: string;
  productType: string;
  status: string;
  stock: number;
  originalPrice: string;
  salePrice: string | null;
  hasDiscount: boolean;
  categories: string[];
  images: string[];
  createdAt: string;
  stockStatus: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const PRODUCT_STATUS = {
  Draft: "bg-gray-100 text-gray-800",
  Active: "bg-green-100 text-green-800",
  "Out of Stock": "bg-red-100 text-red-800",
  Archived: "bg-yellow-100 text-yellow-800",
} as const;

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  ); // NEW

  // Fetch products from API
  const fetchProducts = async (
    page: number = 1,
    status: string = "all",
    category: string = "all",
    brand: string = "all",
    productType: string = "all"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      // Add optional filters only if they're not "all"
      if (status !== "all") {
        params.append("status", status);
      }

      if (category !== "all") {
        params.append("category", category);
      }

      if (brand !== "all") {
        params.append("brand", brand);
      }

      if (productType !== "all") {
        params.append("productType", productType);
      }

      console.log("Fetching products with params:", params.toString());

      const response = await fetch(`/api/products?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch products: ${response.status}`
        );
      }

      const data: ProductsResponse = await response.json();

      // Validate the response structure
      if (!data.products || !data.pagination) {
        throw new Error("Invalid response format from server");
      }

      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.totalCount);
      setCurrentPage(data.pagination.page);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filter changes
  useEffect(() => {
    fetchProducts(
      1,
      statusFilter,
      categoryFilter,
      brandFilter,
      productTypeFilter
    );
  }, [statusFilter, categoryFilter, brandFilter, productTypeFilter]);

  // Get all unique categories, brands, and product types for filters
  const allCategories = Array.from(
    new Set(products.flatMap((product) => product.categories || []))
  );

  const allBrands = Array.from(
    new Set(products.map((product) => product.brand).filter(Boolean))
  );

  const allProductTypes = Array.from(
    new Set(products.map((product) => product.productType).filter(Boolean))
  );

  const handleDelete = async (id: string) => {
    try {
      // Implement delete API call
      const response = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
      });

      setDeletingProductId(id); // Show loader for this product
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh the product list
      fetchProducts(
        currentPage,
        statusFilter,
        categoryFilter,
        brandFilter,
        productTypeFilter
      );
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    } finally {
      setDeletingProductId(null); // Reset loader state
    }
  };

  const formatPrice = (price: string | null) => {
    if (!price) return "-";
    return `TZS ${parseInt(price).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
        <Button onClick={() => fetchProducts()} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {allBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={productTypeFilter}
            onValueChange={setProductTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Product Types</SelectItem>
              {allProductTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  No products found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative rounded-md overflow-hidden border">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.categories?.slice(0, 2).map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                      {product.categories && product.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {product.hasDiscount ? (
                        <>
                          <span className="text-green-600 font-semibold">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-gray-500 line-through text-sm">
                            {formatPrice(product.originalPrice)}
                          </span>
                        </>
                      ) : (
                        <span>{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock === 0
                          ? "text-red-600 font-semibold"
                          : product.stock < 10
                          ? "text-yellow-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        PRODUCT_STATUS[
                          product.status as keyof typeof PRODUCT_STATUS
                        ] || "bg-gray-100 text-gray-800"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          // Handle edit - navigate to edit page
                          window.location.href = `/admin-dashboard/products/edit-product/${product.id}`;
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={deletingProductId === product.id} // Disable during delete
                          >
                            {deletingProductId === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the product &quot;
                              {product.name}&quot; and remove it from our
                              servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {products.length} of {totalCount} products
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() =>
              fetchProducts(
                currentPage - 1,
                statusFilter,
                categoryFilter,
                brandFilter,
                productTypeFilter
              )
            }
          >
            Previous
          </Button>
          <span className="flex items-center text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              fetchProducts(
                currentPage + 1,
                statusFilter,
                categoryFilter,
                brandFilter,
                productTypeFilter
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
