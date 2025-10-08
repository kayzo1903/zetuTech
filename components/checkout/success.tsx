// app/checkout/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Phone, Download } from 'lucide-react';

interface OrderSuccessData {
  orderNumber: string;
  orderId: string;
  total: string;
  status: string;
}

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderSuccessData | null>(null);

  const orderNumber = searchParams.get('orderNumber');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderNumber || !orderId) {
      router.push('/');
      return;
    }

    // In a real app, you might fetch order details from API
    setOrderData({
      orderNumber,
      orderId,
      total: '0', // You would get this from the API
      status: 'pending'
    });
  }, [orderNumber, orderId, router]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{orderData.orderNumber}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">We&apos;ll contact you</p>
                  <p className="text-sm text-gray-600">On your provided phone number</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-sm mb-1">What&apos;s Next?</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• We&apos;ll prepare your order within 24 hours</li>
                  <li>• You&apos;ll receive a call to confirm pickup/delivery details</li>
                  <li>• Bring your ID and order number for pickup</li>
                  <li>• Pay with cash when you collect your items</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/orders/${orderData.orderId}`}>
              View Order Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need help? Contact us at <strong>+255 123 456 789</strong> or</p>
          <p>email <strong>support@zetutech.co.tz</strong></p>
        </div>
      </div>
    </div>
  );
}