import { getCartContext } from "@/lib/context/cart-context";
import { addItemToCart } from "@/utils/cart-helper";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity, selectedAttributes } = body;

    const { userId, sessionId } = await getCartContext(req);
    const items = await addItemToCart({
      userId,
      sessionId,
      productId,
      quantity,
      selectedAttributes,
    });

    return NextResponse.json({ items });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Cart ADD error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
