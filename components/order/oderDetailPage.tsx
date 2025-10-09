// app/components/orderDetailPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  User,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Order, OrderResponse } from "@/lib/types/orders";

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending : sessionLoading } = authClient.useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (session?.user && orderId) {
      fetchOrder();
    }
  });

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/get/${orderId}`);
      const result: OrderResponse = await response.json();

      if (result.success) {
        setOrder(result.order);
      } else {
        console.error('Failed to fetch order:');
        // Redirect if order not found or unauthorized
        if (response.status === 404 || response.status === 401) {
          router.push('/account/orders');
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/account/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
      case 'confirmed':
        return <Package className="w-5 h-5 text-orange-600" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'confirmed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: string) => {
    return `TZS ${parseFloat(amount).toLocaleString()}`;
  };

  const getStatusProgress = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'processing', label: 'Processing' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' },
    ];

    const currentIndex = steps.findIndex(step => step.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (sessionLoading || loading) {
    return <OrderDetailSkeleton />;
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to view order details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signin">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Order Not Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <Link href="/account/orders">
              <Button>Back to Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusSteps = getStatusProgress(order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/account/orders">
            <Button variant="ghost" className="mb-4 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-2 text-lg px-4 py-2 ${getStatusColor(order.status)}`}
            >
              {getStatusIcon(order.status)}
              <span className="capitalize font-semibold">{order.status}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>
                  Track your order progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.key} className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-100 text-green-600' 
                          : step.current
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          step.current ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                        }`}>
                          {step.label}
                        </p>
                        {step.current && order.statusHistory?.[0] && (
                          <p className="text-sm text-gray-500 mt-1">
                            Updated: {formatDate(order.statusHistory[0].createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                        {item.attributes && (
                          <p className="text-xs text-gray-500 mt-1">
                            {JSON.parse(item.attributes).color && `Color: ${JSON.parse(item.attributes).color}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency((parseFloat(item.price) * item.quantity).toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Status History</CardTitle>
                  <CardDescription>
                    Recent updates on your order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.statusHistory.map((history) => (
                      <div key={history.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        {getStatusIcon(history.status)}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {history.status}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {history.notes}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(history.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {parseFloat(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {parseFloat(order.shippingAmount) === 0 
                      ? 'Free' 
                      : formatCurrency(order.shippingAmount)
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium capitalize">
                      {order.deliveryMethod.replace('_', ' ')}
                    </p>
                    {order.agentLocation && (
                      <p className="text-sm text-gray-600">{order.agentLocation}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{order.address?.fullName || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.customerPhone}</span>
                </div>
                {order.customerEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{order.customerEmail}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.address && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">{order.address.fullName}</p>
                      <p className="text-gray-600">{order.address.address}</p>
                      <p className="text-gray-600">
                        {order.address.city}, {order.address.region}
                      </p>
                      <p className="text-gray-600">{order.address.country}</p>
                      {order.address.notes && (
                        <p className="text-gray-500 mt-2">
                          <strong>Notes:</strong> {order.address.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader for Order Detail
function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Skeleton className="h-9 w-28 mb-4" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map(j => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}