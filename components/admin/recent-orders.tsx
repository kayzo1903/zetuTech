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
import { Eye, Clock, CheckCircle, AlertCircle, MoreVertical } from "lucide-react";
import Link from "next/link";
import { getPendingOrders } from "@/lib/server/admin-dashboard/getDashboardStats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
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
  if (order.customerEmail) return order.customerEmail.split('@')[0]; // Just the username part on mobile
  if (order.customerPhone) return order.customerPhone;
  return "Guest";
}

export async function RecentOrders() {
  try {
    // Fetch pending orders using the server function
    const { orders, pagination } = await getPendingOrders(5);
    const pendingOrdersCount = pagination?.total || 0;

    return (
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              Pending Orders
              {pendingOrdersCount > 0 && (
                <Badge variant="destructive" className="animate-pulse text-xs sm:text-sm">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{pendingOrdersCount} Pending</span>
                  <span className="sm:hidden">{pendingOrdersCount}</span>
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {pendingOrdersCount > 0 
                ? `${pendingOrdersCount} orders awaiting processing`
                : "No pending orders"
              }
            </CardDescription>
          </div>
          <div className="flex gap-2 self-stretch sm:self-auto">
            <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
              <Link href="/admin-dashboard/orders?status=pending">
                <span className="hidden sm:inline">View All Pending</span>
                <span className="sm:hidden">View All</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => {
              const statusInfo = statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="flex items-start justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  {/* Left Section - Order Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Status Icon - Hidden on mobile, visible on tablet+ */}
                    <div className={`p-2 rounded-full ${statusInfo.color} hidden sm:flex`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Order Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <p className="font-semibold text-sm truncate">
                            #{order.orderNumber}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`${statusInfo.color} border font-medium text-xs`}
                          >
                            <span className="hidden sm:inline">{statusInfo.label}</span>
                            <span className="sm:hidden">Pending</span>
                          </Badge>
                          {order.paymentStatus && order.paymentStatus !== 'paid' && (
                            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hidden sm:inline-flex">
                              {order.paymentStatus}
                            </Badge>
                          )}
                        </div>

                        {/* Mobile Dropdown */}
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin-dashboard/orders/${order.id}`} className="flex items-center gap-2 cursor-pointer">
                                  <Eye className="h-4 w-4" />
                                  View Order
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Customer & Items */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium truncate">
                          {getCustomerDisplay(order)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span>{order.itemsCount || 0} items</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      {/* Additional Info - Stacked on mobile */}
                      <div className="space-y-1 sm:space-y-0.5">
                        {order.agentLocation && (
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <span className="hidden sm:inline">📍</span>
                            {order.agentLocation}
                          </p>
                        )}
                        {order.deliveryMethod && (
                          <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                            <span className="hidden sm:inline">🚚</span>
                            {order.deliveryMethod.replace('_', ' ')}
                          </p>
                        )}
                        {order.paymentStatus && order.paymentStatus !== 'paid' && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 sm:hidden">
                            {order.paymentStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Price & Actions */}
                  <div className="flex flex-col items-end gap-2 sm:gap-3 min-w-[100px] sm:min-w-[120px]">
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {order.paymentMethod ? `Paid via ${order.paymentMethod}` : 'Payment pending'}
                      </p>
                    </div>

                    {/* Desktop View Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 hidden sm:flex"
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

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="text-center py-6 sm:py-8 border rounded-lg">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                <div className="text-muted-foreground text-sm sm:text-base mb-2">
                  No pending orders
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  All orders are processed and up to date.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin-dashboard/orders">View All Orders</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Footer - Show more info */}
          {pendingOrdersCount > 5 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-muted-foreground">
                <span className="text-center sm:text-left">
                  Showing 5 of {pendingOrdersCount} pending orders
                </span>
                <Button variant="link" className="p-0 h-auto text-sm" asChild>
                  <Link href="/admin-dashboard/orders?status=pending">
                    View all pending orders
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Pending Orders</CardTitle>
          <CardDescription>Orders awaiting processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-red-500" />
            <p className="text-sm sm:text-base mb-2">Failed to load pending orders</p>
            <p className="text-xs sm:text-sm mb-4">Please try refreshing the page</p>
            <Button 
              variant="outline" 
              size="sm"
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