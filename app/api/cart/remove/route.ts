// app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromRequest } from '@/lib/server/cart/session-util';
import { removeCartItem } from '@/utils/cart-helper';


export async function DELETE(request: NextRequest) {
  try {
    await getSessionIdFromRequest(request); // Ensure session exists
    const body = await request.json();
    
    const { cartItemId } = body;
    
    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    await removeCartItem(cartItemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove cart item error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove cart item' 
      },
      { status: 400 }
    );
  }
}