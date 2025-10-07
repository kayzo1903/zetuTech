// app/api/cart/merge/route.ts
import { getServerSession } from '@/lib/server-session';
import { mergeCarts } from '@/utils/cart-helper';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { guestSessionId } = body;

    if (!guestSessionId) {
      return NextResponse.json(
        { success: false, error: 'Guest session ID is required' },
        { status: 400 }
      );
    }

    const items = await mergeCarts(guestSessionId, session.user.id);

    return NextResponse.json({
      success: true,
      items,
      message: 'Cart merged successfully',
    });
  } catch (error) {
    console.error('Cart merge error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to merge carts' 
      },
      { status: 500 }
    );
  }
}