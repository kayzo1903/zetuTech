// app/api/products/product-list/route.ts
import { getProducts } from "@/app/products/libs/servers/getProduct";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const rawParams = Object.fromEntries(request.nextUrl.searchParams);

  // Clean params
  const searchParams = Object.fromEntries(
    Object.entries(rawParams).filter(([v]) => v !== "")
  );

  try {
    const data = await getProducts(searchParams);
    return Response.json(data);
  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
