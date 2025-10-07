// app/api/cart/add/route.ts
import { getServerSession } from '@/lib/server-session';
import { addItemToCart } from '@/utils/cart-helper';
import { getGuestSessionId } from '@/utils/cart-session';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, selectedAttributes } = body;

    // Validation
    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    let userId: string | undefined;
    let sessionId: string | undefined;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      sessionId = await getGuestSessionId();
    }

    const items = await addItemToCart({
      userId,
      sessionId,
      productId,
      quantity,
      selectedAttributes,
    });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add item to cart' 
      },
      { status: 500 }
    );
  }
}