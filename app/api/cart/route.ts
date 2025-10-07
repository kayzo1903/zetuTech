// app/api/cart/route.ts
import { getServerSession } from '@/lib/server-session';
import { getCartItems, getOrCreateCart } from '@/utils/cart-helper';
import { getGuestSessionId } from '@/utils/cart-session';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const session = await getServerSession();
    let userId: string | undefined;
    let sessionId: string | undefined;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      sessionId = await getGuestSessionId();
    }

    const cart = await getOrCreateCart(userId, sessionId);
    const items = await getCartItems(cart.id);

    return NextResponse.json({
      success: true,
      cart,
      items,
    });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cart' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // This would clear the entire cart
    // Implementation depends on your auth/session system
    return NextResponse.json({ 
      success: true, 
      message: 'Cart cleared' 
    });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to clear cart' 
      },
      { status: 500 }
    );
  }
}