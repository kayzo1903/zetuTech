// lib/orders/security.ts
import { dbServer } from '@/db/db-server';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function validateOrderAccess(orderId: string, userId?: string | null) {
  try {
    // First, check if order exists
    const orderData = await dbServer.query.order.findFirst({
      where: eq(order.id, orderId),
      columns: { 
        id: true, 
        userId: true, 
        guestSessionId: true,
        verificationCode: true,
        pdfFile: true
      }
    });

    if (!orderData) {
      return { allowed: false, reason: 'not_found' };
    }

    // If user is authenticated, check if they own the order
    if (userId && orderData.userId === userId) {
      return { allowed: true, sessionId: null, order: orderData };
    }

    // For guest orders, validate session
    if (!orderData.userId && orderData.guestSessionId) {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('guest_session_id')?.value;
      
      if (sessionId === orderData.guestSessionId) {
        return { allowed: true, sessionId, order: orderData };
      }
    }

    // If no user ID provided but order exists, allow access (for receipt generation)
    // This handles cases where we're generating receipts for guest orders
    if (!userId && orderData.guestSessionId) {
      return { allowed: true, sessionId: null, order: orderData };
    }

    return { allowed: false, reason: 'unauthorized' };
  } catch (error) {
    console.error('Error validating order access:', error);
    return { allowed: false, reason: 'error' };
  }
}