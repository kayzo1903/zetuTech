import { updateCartItemQuantity } from "@/utils/cart-helper";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
  try {
    const { cartItemId, quantity } = await req.json();
    await updateCartItemQuantity(cartItemId, quantity);
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Cart UPDATE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
