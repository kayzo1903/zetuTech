// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromRequest } from '@/lib/server/cart/session-util';
import { addItemToCart } from '@/utils/cart-helper';


export async function POST(request: NextRequest) {
  try {
    const guestSessionId = await getSessionIdFromRequest(request);
    const body = await request.json();
    
    const { productId, quantity, selectedAttributes } = body;
    
    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const items = await addItemToCart({
      sessionId: guestSessionId,
      productId,
      quantity,
      selectedAttributes
    });

    return NextResponse.json({
      success: true,
      items
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add item to cart' 
      },
      { status: 400 }
    );
  }
}