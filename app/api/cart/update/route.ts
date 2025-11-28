// app/api/cart/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromRequest } from '@/lib/server/cart/session-util';
import { updateCartItemQuantity } from '@/utils/cart-helper';


export async function PUT(request: NextRequest) {
  try {
    await getSessionIdFromRequest(request); // Ensure session exists
    const body = await request.json();
    
    const { cartItemId, quantity } = body;
    
    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    await updateCartItemQuantity(cartItemId, quantity);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update cart item' 
      },
      { status: 400 }
    );
  }
}