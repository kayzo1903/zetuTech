// app/api/products/infinity/route.ts
import { NextResponse } from "next/server";
import { getInfinityProducts } from "@/lib/server/get-infinityProduct";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const products = await getInfinityProducts(offset, limit);
  return NextResponse.json(products);
}
