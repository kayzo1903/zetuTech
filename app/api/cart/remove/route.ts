import { removeCartItem } from "@/utils/cart-helper";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {
  try {
    const { cartItemId } = await req.json();
    await removeCartItem(cartItemId);
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Cart REMOVE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
