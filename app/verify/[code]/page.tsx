// app/verify/[code]/page.tsx
import { dbServer } from '@/db/db-server';
import { order, orderItem, orderAddress, product } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Calendar, Package, User, Phone } from 'lucide-react';



export default async function VerifyReceipt({ params }: { params: Promise<{ code : string }> } ) {
  const { code } = await params;

  // ========== FETCH DATA USING EXPLICIT QUERIES ==========

  // 1. Get main order data by verification code
  const [orderData] = await dbServer
    .select()
    .from(order)
    .where(eq(order.verificationCode, code))
    .limit(1);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Receipt
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            No valid receipt found for this verification code.
          </p>
        </div>
      </div>
    );
  }

  // 2. Get order items with product details
  const orderItems = await dbServer
    .select({
      id: orderItem.id,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      price: orderItem.price,
      product: {
        name: product.name,
        brand: product.brand,
      },
    })
    .from(orderItem)
    .innerJoin(product, eq(orderItem.productId, product.id))
    .where(eq(orderItem.orderId, orderData.id));

  // 3. Get shipping address
  const [shippingAddress] = await dbServer
    .select()
    .from(orderAddress)
    .where(
      and(
        eq(orderAddress.orderId, orderData.id),
        eq(orderAddress.type, 'shipping')
      )
    )
    .limit(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPaymentMethod = (method: string) => {
    const methods: { [key: string]: string } = {
      'cash_delivery': 'Cash on Delivery',
      'mpesa': 'M-Pesa',
      'card': 'Credit/Debit Card',
      'bank_transfer': 'Bank Transfer'
    };
    return methods[method] || method.replace('_', ' ').toUpperCase();
  };

  const formatDeliveryMethod = (method: string) => {
    const methods: { [key: string]: string } = {
      'direct_delivery': 'Direct Delivery',
      'agent_pickup': 'Agent Pickup'
    };
    return methods[method] || method.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Verification Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verified Receipt
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This receipt has been verified and is authentic.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{orderData.orderNumber}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Verified on {new Date().toLocaleDateString('en-TZ')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Order Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(orderData.createdAt).toLocaleDateString('en-TZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Status</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {orderData.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Payment Method</p>
                    <p className="text-sm text-gray-600">
                      {formatPaymentMethod(orderData.paymentMethod)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">Delivery Method</p>
                    <p className="text-sm text-gray-600">
                      {formatDeliveryMethod(orderData.deliveryMethod)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {shippingAddress && (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Customer</p>
                        <p className="text-sm text-gray-600">
                          {shippingAddress.fullName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-sm">Contact</p>
                        <p className="text-sm text-gray-600">
                          {shippingAddress.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Region</p>
                        <p className="text-sm text-gray-600">
                          {shippingAddress.region}
                        </p>
                      </div>
                    </div>

                    {shippingAddress.city && (
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">City</p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Order Items Preview */}
            {orderItems.length > 0 && (
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-3">Order Items ({orderItems.length})</h3>
                <div className="space-y-2">
                  {orderItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="flex-1 truncate">
                        {item.product?.name || 'Product'}
                        {item.product?.brand && ` (${item.product.brand})`}
                      </span>
                      <span className="ml-2">
                        {item.quantity} × {formatCurrency(parseFloat(item.price))}
                      </span>
                    </div>
                  ))}
                  {orderItems.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{orderItems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({orderItems.length}):</span>
                  <span>{formatCurrency(parseFloat(orderData.subtotal))}</span>
                </div>
                {parseFloat(orderData.discountAmount || "0") > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(parseFloat(orderData.discountAmount || "0"))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatCurrency(parseFloat(orderData.shippingAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(parseFloat(orderData.taxAmount))}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(parseFloat(orderData.totalAmount))}</span>
                </div>
              </div>
            </div>

            {/* Verification Code */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Verification Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Verification Code:</strong> {orderData.verificationCode}</p>
                <p><strong>Receipt Generated:</strong> {orderData.pdfFile ? 'Yes' : 'No'}</p>
                {orderData.pdfFile && (
                  <p>
                    <strong>PDF Available:</strong>{' '}
                    <a 
                      href={orderData.pdfFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Receipt PDF
                    </a>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact us at <strong>+255 123 456 789</strong></p>
          <p>or email <strong>support@zetutech.co.tz</strong></p>
        </div>
      </div>
    </div>
  );
}