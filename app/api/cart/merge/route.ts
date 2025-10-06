import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { dbServer } from "@/db/db-server";
import { cart, cartItem } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { guestSessionId, userId } = await req.json();

    const [guestCart] = await dbServer
      .select()
      .from(cart)
      .where(eq(cart.sessionId, guestSessionId));

    if (!guestCart) return NextResponse.json({ success: true });

    const [userCart] = await dbServer
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    if (userCart) {
      const guestItems = await dbServer
        .select()
        .from(cartItem)
        .where(eq(cartItem.cartId, guestCart.id));

      for (const item of guestItems) {
        await dbServer.insert(cartItem).values({
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedAttributes: item.selectedAttributes,
        });
      }

      await dbServer.delete(cart).where(eq(cart.id, guestCart.id));
    } else {
      await dbServer
        .update(cart)
        .set({ userId })
        .where(eq(cart.id, guestCart.id));
    }

    return NextResponse.json({ success: true });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Cart MERGE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
