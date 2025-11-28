// lib/types/product.ts
import { PRODUCT_TYPES, PRODUCT_CATEGORIES } from "@/lib/validation-schemas/product-type";

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  brand: string;
  productType: string;
  originalPrice: number; // ✅ Use number consistently
  salePrice: number | null; // ✅ Use number consistently
  hasDiscount: boolean;
  stock: number;
  stockStatus: string;
  status: string;
  slug: string;
  categories: string[];
  images: string[];
  averageRating?: number; // ✅ Make optional for flexibility
  reviewCount?: number; // ✅ Make optional
  createdAt: string;
  updatedAt?: string;
  warrantyPeriod?: number | null;
  warrantyDetails?: string | null;
  sku?: string | null;
  hasWarranty?: boolean; // ✅ Make optional
}


export interface ProductsResponse {
  products: Product[];
  filters: {
    brands: string[];
    productTypes: typeof PRODUCT_TYPES;
    categories: typeof PRODUCT_CATEGORIES;
  };
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchParams {
  productType?: string;
  category?: string;
  brand?: string;
  status?: string;
  stockStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  page?: string;
  q?: string;
}

export interface ProductsListProps {
  initialData: {
    products: Product[];
    filters: {
      brands: string[];
      productTypes: typeof PRODUCT_TYPES;
      categories: typeof PRODUCT_CATEGORIES;
    };
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  searchParams: SearchParams;
}