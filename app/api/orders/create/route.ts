// app/api/orders/create/route.ts - Fixed to match your schema
import { NextRequest, NextResponse } from 'next/server';
import { dbServer } from '@/db/db-server';
import { order, orderItem, orderAddress, orderStatusHistory, cart, cartItem } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionIdFromRequest } from '@/lib/server/cart/session-util';
import { orderCreateSchema } from '@/lib/validation-schemas/checkout';

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionIdFromRequest(request);
    const body = await request.json();

    console.log('🔍 Received order data:', body);

    // Validate the request data
    const validationResult = orderCreateSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('❌ Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid order data', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const orderData = validationResult.data;
    const orderNumber = generateOrderNumber();

    console.log('🔄 Starting database transaction...');

    return await dbServer.transaction(async (tx) => {
      try {
        // Create the order - support both user and guest
        const [newOrder] = await tx.insert(order).values({
          orderNumber,
          userId: body.userId || null,
          guestSessionId: !body.userId ? (body.guestSessionId || sessionId) : null,
          status: 'pending',
          subtotal: orderData.pricing.subtotal.toString(),
          shippingAmount: orderData.pricing.shipping.toString(),
          taxAmount: orderData.pricing.tax.toString(),
          discountAmount: orderData.pricing.discount.toString(),
          totalAmount: orderData.pricing.total.toString(),
          deliveryMethod: orderData.delivery.method,
          paymentMethod: orderData.payment.method,
          paymentStatus: orderData.payment.method === 'cash_delivery' ? 'pending' : 'unpaid',
          agentLocation: orderData.delivery.agentLocation || null,
          customerPhone: orderData.contact.phone,
          customerEmail: orderData.contact.email || null,
        }).returning();

        console.log('✅ Order created:', newOrder.id);

        // Create order address
        await tx.insert(orderAddress).values({
          orderId: newOrder.id,
          type: 'shipping',
          fullName: orderData.address.fullName,
          phone: orderData.contact.phone,
          email: orderData.contact.email || '',
          address: orderData.address.address || '',
          city: orderData.address.city || orderData.contact.region,
          region: orderData.contact.region,
          country: 'Tanzania',
          notes: orderData.address.notes || '',
        });

        console.log('✅ Order address created');

        // Create order items - FIXED: Using cartItems from validated data
        const orderItems = orderData.cartItems.map(item => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice.toString(),
          attributes: item.attributes ? JSON.stringify(item.attributes) : null,
        }));

        console.log('📦 Creating order items:', orderItems.length);
        await tx.insert(orderItem).values(orderItems);
        console.log('✅ Order items created');

        // Create initial status history
        await tx.insert(orderStatusHistory).values({
          orderId: newOrder.id,
          status: 'pending',
          notes: 'Order created successfully',
        });

        console.log('✅ Status history created');

        // Clear the cart (works for both user and guest)
        if (body.userId) {
          // Clear user cart
          console.log('🛒 Clearing user cart for user:', body.userId);
          const [userCart] = await tx.select().from(cart).where(eq(cart.userId, body.userId));
          if (userCart) {
            await tx.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
            console.log('✅ User cart cleared');
          }
        } else {
          // Clear guest cart using session ID
          console.log('🛒 Clearing guest cart for session:', sessionId);
          const [guestCart] = await tx.select().from(cart).where(eq(cart.sessionId, sessionId));
          if (guestCart) {
            await tx.delete(cartItem).where(eq(cartItem.cartId, guestCart.id));
            console.log('✅ Guest cart cleared');
          } else {
            console.log('❌ No guest cart found for session:', sessionId);
          }
        }

        console.log('🎉 Order creation completed successfully');

        return NextResponse.json({
          success: true,
          order: {
            id: newOrder.id,
            orderNumber: newOrder.orderNumber,
            total: newOrder.totalAmount,
            status: newOrder.status,
            isGuest: !body.userId,
          },
        });

      } catch (txError) {
        console.error('❌ Transaction error:', txError);
        throw txError;
      }
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ZT-${timestamp}-${random}`;
}