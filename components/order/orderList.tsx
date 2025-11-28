// app/components/orderList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Search,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import OrdersSkeleton from "./orderSkeleton";

// Define a simplified order type for the list view
interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  subtotal: string;
  shippingAmount: string;
  taxAmount: string;
  discountAmount: string;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  agentLocation?: string;
  customerPhone: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt: string;
  itemsCount?: number; // Add items count instead of full items array
}

interface OrdersListResponse {
  success: boolean;
  orders: OrderSummary[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function OrdersList() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders?limit=50');
      const result: OrdersListResponse = await response.json();

      if (result.success) {
        setOrders(result.orders);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'processing':
      case 'confirmed':
        return <Package className="w-4 h-4 text-orange-600" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
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
    });
  };

  const formatCurrency = (amount: string) => {
    return `TZS ${parseFloat(amount).toLocaleString()}`;
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sessionLoading) {
    return <OrdersSkeleton />;
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to view your orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signin?callbackUrl=/account/orders">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and manage your orders
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by order number or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <OrdersSkeleton />
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start shopping to see your orders here'
                }
              </p>
              {!searchTerm && (
                <Link href="/products">
                  <Button>Start Shopping</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`flex items-center gap-1 ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Placed on:</span>
                          <p>{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>
                          {/* FIXED: Use itemsCount or show "N/A" */}
                          <p>{order.itemsCount ? `${order.itemsCount} item${order.itemsCount !== 1 ? 's' : ''}` : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {order.deliveryMethod && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">
                            Delivery: {order.deliveryMethod.replace('_', ' ')}
                            {order.agentLocation && ` • ${order.agentLocation}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/account/orders/${order.id}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}