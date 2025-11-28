// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromRequest } from '@/lib/server/cart/session-util';
import { clearCart, getCartItems, getOrCreateCart } from '@/utils/cart-helper';


export async function GET(request: NextRequest) {
  try {
    // Get or create guest session ID
    const guestSessionId = await getSessionIdFromRequest(request);
    
    const cart = await getOrCreateCart(undefined, guestSessionId);
    const items = await getCartItems(cart.id);
    
    return NextResponse.json({
      success: true,
      cart: {
        ...cart,
        items
      },
      items
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const guestSessionId = await getSessionIdFromRequest(request);
    const cart = await getOrCreateCart(undefined, guestSessionId);
    
    await clearCart(cart.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}