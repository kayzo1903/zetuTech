// app/api/cart/remove/route.ts
import { removeCartItem } from '@/utils/cart-helper';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId } = body;

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    await removeCartItem(cartItemId);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove item from cart' 
      },
      { status: 500 }
    );
  }
}