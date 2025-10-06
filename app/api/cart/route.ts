import { NextRequest, NextResponse } from "next/server";
import { getCartContext } from "@/lib/context/cart-context";
import { getCartItems, getOrCreateCart } from "@/utils/cart-helper";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionId } = await getCartContext(req);
    const cart = await getOrCreateCart(userId, sessionId);
    const items = await getCartItems(cart.id);

    return NextResponse.json({ cart, items });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
