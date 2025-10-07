// app/api/cart/update/route.ts
import { updateCartItemQuantity } from "@/utils/cart-helper";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || !quantity) {
      return NextResponse.json(
        { success: false, error: "Cart item ID and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    await updateCartItemQuantity(cartItemId, quantity);

    return NextResponse.json({
      success: true,
      message: "Cart item updated successfully",
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update cart item",
      },
      { status: 500 }
    );
  }
}
