// components/admin/recent-orders.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getPendingOrders } from "@/lib/server/admin-dashboard/getDashboardStats";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    label: "Pending",
  },
};

function formatDate(dateString: Date) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: string | number) {
  return `TZS ${Number(amount).toLocaleString()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCustomerDisplay(order: any) {
  if (order.userName) return order.userName;
  if (order.customerEmail) return order.customerEmail;
  if (order.customerPhone) return order.customerPhone;
  return "Guest Customer";
}

export async function RecentOrders() {
  try {
    // Fetch pending orders using the server function
    const { orders, pagination } = await getPendingOrders(5);
    const pendingOrdersCount = pagination?.total || 0;

    return (
      <Card className="lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Pending Orders
              {pendingOrdersCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {pendingOrdersCount} Pending
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {pendingOrdersCount > 0 
                ? `${pendingOrdersCount} orders awaiting processing`
                : "No pending orders"
              }
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/orders?status=pending">
                View All Pending
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-full ${statusInfo.color}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">
                          {order.orderNumber}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`${statusInfo.color} border font-medium text-xs`}
                        >
                          {statusInfo.label}
                        </Badge>
                        {order.paymentStatus && order.paymentStatus !== 'paid' && (
                          <Badge variant="outline" className="text-xs bg-orange-300 text-gray-800">
                            {order.paymentStatus}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p className="truncate">
                          {getCustomerDisplay(order)}
                        </p>
                        <p>
                          {order.itemsCount || 0} items • {formatDate(order.createdAt)}
                        </p>
                        {order.agentLocation && (
                          <p className="truncate text-xs">
                            📍 {order.agentLocation}
                          </p>
                        )}
                        {order.deliveryMethod && (
                          <p className="text-xs capitalize">
                            🚚 {order.deliveryMethod.replace('_', ' ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <p className="font-semibold text-sm">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.paymentMethod ? `Paid via ${order.paymentMethod}` : 'Payment pending'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8"
                      asChild
                    >
                      <Link href={`/admin-dashboard/orders/${order.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="text-center py-8 border rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <div className="text-muted-foreground mb-2">
                  No pending orders
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  All orders are processed and up to date.
                </p>
                <Button asChild variant="outline">
                  <Link href="/admin-dashboard/orders">View All Orders</Link>
                </Button>
              </div>
            )}
          </div>

          {pendingOrdersCount > 5 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  Showing 5 of {pendingOrdersCount} pending orders
                </span>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/admin-dashboard/orders?status=pending">
                    View all pending
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('Error in RecentOrders component:', error);
    return (
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>Orders awaiting processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="mb-2">Failed to load pending orders</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}