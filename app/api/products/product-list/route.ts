// app/api/products/product-list/route.ts
import { getProducts } from "@/lib/server/getProduct";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);

  try {
    const data = await getProducts(searchParams);
    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
