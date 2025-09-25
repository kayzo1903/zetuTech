// lib/server/get-infinityProduct.ts
import { ProductType } from "@/components/cards/productcards";

const MAX_PRODUCTS = 50; // total products available

export async function getInfinityProducts(
  offset: number = 0,
  limit: number = 12
): Promise<ProductType[]> {
  // Generate dummy products
  const allProducts = Array.from({ length: MAX_PRODUCTS }).map((_, i) => ({
    id: `product-${i + 1}`,
    name: `Laptop Model ${i + 1}`,
    slug: `laptop-model-${i + 1}`,
    brand: i % 3 === 0 ? "ZetuTech" : i % 3 === 1 ? "TechPro" : "EliteComp",
    images: ["/images/categories/laptops.jpg"],
    originalPrice: 1500000 + i * 10000,
    salePrice: i % 2 === 0 ? 1200000 + i * 5000 : undefined,
    hasDiscount: i % 2 === 0,
    averageRating: 4.0 + (i % 5) * 0.2,
    stock: i % 5 === 0 ? 0 : 10 + (i % 10),
  }));

  // Return only the slice based on offset and limit
  return allProducts.slice(offset, offset + limit);
}
