// app/api/orders/route.ts - Updated version
import { NextRequest, NextResponse } from 'next/server';
import { dbServer } from '@/db/db-server';
import { order, orderItem } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { getServerSession } from '@/lib/server-session';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get user's orders with items count
    const orders = await dbServer
      .select({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        subtotal: order.subtotal,
        shippingAmount: order.shippingAmount,
        taxAmount: order.taxAmount,
        discountAmount: order.discountAmount,
        deliveryMethod: order.deliveryMethod,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        agentLocation: order.agentLocation,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        itemsCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${orderItem} 
          WHERE ${orderItem.orderId} = ${order.id}
        )`.as('items_count'),
      })
      .from(order)
      .where(eq(order.userId, session.user.id))
      .orderBy(desc(order.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [countResult] = await dbServer
      .select({ count: sql<number>`count(*)` })
      .from(order)
      .where(eq(order.userId, session.user.id));

    const total = countResult?.count || 0;

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}