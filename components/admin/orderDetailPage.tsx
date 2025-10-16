// app/dashboard/orders/[orderId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Truck,
  FileText,
  CreditCard,
  Calendar,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Loader2,
  Menu,
} from "lucide-react";
import { OrderDetail, OrderResponse } from "@/lib/types/admin-orders-details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themeClasses } from "./order-details-skeleton";
import OrderDetailsSkeleton from "./order-details-skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Theme-aware status configurations
const ORDER_STATUS = {
  pending: {
    light: "bg-yellow-100 text-gray-900 border-yellow-200",
    dark: "bg-yellow-900/30 text-gray-900 border-yellow-700",
    icon: Package,
    label: "Pending",
  },
  confirmed: {
    light: "bg-blue-100 text-gray-900 border-blue-200",
    dark: "bg-blue-900/30 text-gray-300 border-blue-700",
    icon: CheckCircle,
    label: "Confirmed",
  },
  processing: {
    light: "bg-orange-100 text-gray-900 border-orange-200",
    dark: "bg-orange-900/30 text-gray-900 border-orange-700",
    icon: Package,
    label: "Processing",
  },
  shipped: {
    light: "bg-purple-100 text-gray-900 border-purple-200",
    dark: "bg-purple-900/30 text-gray-900 border-purple-700",
    icon: Truck,
    label: "Shipped",
  },
  delivered: {
    light: "bg-green-100 text-gray-900 border-green-200",
    dark: "bg-green-900/30 text-gray-900 border-green-700",
    icon: CheckCircle,
    label: "Delivered",
  },
  cancelled: {
    light: "bg-red-100 text-gray-900 border-red-200",
    dark: "bg-red-900/30 text-gray-900 border-red-700",
    icon: FileText,
    label: "Cancelled",
  },
  refunded: {
    light: "bg-gray-100 text-gray-800 border-gray-200",
    dark: "bg-gray-800 text-gray-300 border-gray-600",
    icon: CreditCard,
    label: "Refunded",
  },
} as const;

const PAYMENT_STATUS = {
  pending: {
    light: "bg-yellow-200 text-gray-800",
    dark: "bg-yellow-900/30 text-gray-900",
  },
  unpaid: {
    light: "bg-red-100 text-gray-800",
    dark: "bg-red-900/30 text-gray-900",
  },
  paid: {
    light: "bg-green-100 text-gray-800",
    dark: "bg-green-900/30 text-gray-900",
  },
  refunded: {
    light: "bg-gray-100 text-gray-800",
    dark: "bg-gray-800 text-gray-300",
  },
} as const;

// Progress steps in correct order
const PROGRESS_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Start collapsed on mobile
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const orderId = params.orderId as string;

  useEffect(() => {
    fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data: OrderResponse = await res.json();

      if (data.success) setOrder(data.order);
      else {
        toast.error("Order not found");
        router.push("/admin-dashboard/orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order");
      router.push("/admin-dashboard/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: `Order status updated to ${newStatus} by admin`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          `Status updated to ${
            ORDER_STATUS[newStatus as keyof typeof ORDER_STATUS].label
          }`
        );
        fetchOrder();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "cancelled",
          notes: "Order cancelled by admin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchOrder();
      } else {
        toast.error(data.error || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  const formatPrice = (amount: string) =>
    new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
    }).format(parseFloat(amount));

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-TZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return PROGRESS_STEPS.findIndex((step) => step.key === order.status);
  };

  const getNextAvailableStatuses = () => {
    if (!order) return [];
    const currentIndex = getCurrentStepIndex();
    return PROGRESS_STEPS.slice(currentIndex + 1);
  };

  // Helper function to get theme-aware status class
  const getStatusClass = (
    status: string,
    type: "order" | "payment" = "order"
  ) => {
    if (type === "payment") {
      const paymentStatus =
        PAYMENT_STATUS[status as keyof typeof PAYMENT_STATUS];
      return paymentStatus
        ? `${paymentStatus.light} dark:${paymentStatus.dark}`
        : "";
    }

    const orderStatus = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
    return orderStatus ? `${orderStatus.light} dark:${orderStatus.dark}` : "";
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <div
        className={`min-h-screen ${themeClasses.bg.secondary} flex items-center justify-center p-6`}
      >
        <Card
          className={`${themeClasses.card.bg} border ${themeClasses.border.primary} max-w-md`}
        >
          <CardContent className="pt-6 text-center">
            <h2
              className={`text-2xl font-bold ${themeClasses.text.primary} mb-2`}
            >
              Order Not Found
            </h2>
            <p className={`${themeClasses.text.secondary} mb-4`}>
              The order you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push("/admin-dashboard/orders")}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();
  const nextStatuses = getNextAvailableStatuses();
  const StatusIcon =
    ORDER_STATUS[order.status as keyof typeof ORDER_STATUS].icon;

  // Mobile Progress Bar Component
  const MobileProgressBar = () => (
    <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Order Progress
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentStepIndex + 1} of {PROGRESS_STEPS.length}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${
              ((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100
            }%`,
          }}
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        {PROGRESS_STEPS.map((step, index) => (
          <div
            key={step.key}
            className={`text-xs text-center ${
              index <= currentStepIndex
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-500 dark:text-gray-400"
            }`}
            style={{ width: `${100 / PROGRESS_STEPS.length}%` }}
          >
            {step.label.split(" ")[0]}
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile Quick Actions
  const MobileQuickActions = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3 z-40 shadow-lg">
      <div className="flex gap-2">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Menu className="w-4 h-4 mr-2" />
              Info
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>Order Information</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 overflow-y-auto pb-20">
              {/* Order Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  {parseFloat(order.discountAmount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {parseFloat(order.shippingAmount) === 0
                        ? "Free"
                        : formatPrice(order.shippingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">{formatPrice(order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-4 h-4" />
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{order.userName || order.customerEmail?.split("@")[0] || "Guest"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-xs">{order.customerEmail}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-4 h-4" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm capitalize">{order.paymentMethod.replace("_", " ")}</span>
                    <Badge variant="outline" className={getStatusClass(order.paymentStatus, "payment")}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.address && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="w-4 h-4" />
                      Shipping
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="font-medium">{order.address.fullName}</p>
                    <p className="text-gray-600 dark:text-gray-400">{order.address.address}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {order.address.city}, {order.address.region}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{order.address.phone}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="flex-1">
              <MoreVertical className="w-4 h-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {nextStatuses.map((status) => (
              <DropdownMenuItem
                key={status.key}
                onClick={() => updateOrderStatus(status.key)}
                disabled={updatingStatus}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as {status.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={handleCancelOrder}
              className="text-red-600 focus:text-red-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themeClasses.bg.secondary} pb-20`}>
      {/* Sticky Header */}
      <div
        className={`${themeClasses.bg.primary} border-b ${
          themeClasses.border.primary
        } transition-all duration-200 ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 shadow-lg dark:shadow-gray-900/50 py-2"
            : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/orders")}
                className="flex items-center gap-2 p-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              <div
                className={`transition-all duration-200 ${
                  isSticky ? "scale-95" : "scale-100"
                }`}
              >
                <h1
                  className={`font-bold ${themeClasses.text.primary} ${
                    isSticky ? "text-lg" : "text-xl sm:text-3xl"
                  }`}
                >
                  <span className="hidden sm:inline">Order </span>#{order.orderNumber}
                </h1>
                {!isSticky && (
                  <p className={`${themeClasses.text.secondary} text-xs sm:text-sm mt-1`}>
                    {formatDate(order.createdAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`capitalize flex items-center gap-2 ${getStatusClass(
                  order.status
                )} ${isSticky ? "text-xs" : "text-sm"}`}
              >
                <StatusIcon className="w-3 h-3" />
                <span className="hidden sm:inline">{order.status}</span>
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="hidden lg:flex items-center gap-1"
              >
                {showAdminPanel ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <MobileProgressBar />

      {/* Add padding when header is sticky to prevent content jump */}
      <div className={isSticky ? "pt-24 sm:pt-28" : "pt-4"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Admin Quick Actions Panel - Hidden on mobile by default */}
          {showAdminPanel && (
            <div className="mb-6 hidden lg:block">
              <Card
                className={`border ${themeClasses.border.accent} ${themeClasses.bg.accent}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Manage order status and perform administrative actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {/* Next Status Buttons */}
                    {nextStatuses.map((status) => (
                      <Button
                        key={status.key}
                        disabled={updatingStatus}
                        onClick={() => updateOrderStatus(status.key)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Mark as {status.label}
                      </Button>
                    ))}

                    {/* Cancel/Refund Options */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          More Actions
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className={`${themeClasses.bg.primary} border ${themeClasses.border.primary}`}
                      >
                        <DropdownMenuItem
                          onClick={handleCancelOrder}
                          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus("refunded")}
                          className="text-orange-600 dark:text-orange-400 focus:text-orange-600 dark:focus:text-orange-400"
                        >
                          Mark as Refunded
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Order Progress (Detailed) - Hidden on mobile, we have the compact version */}
              <Card className={`${themeClasses.card.bg} border ${themeClasses.border.primary} hidden lg:block`}>
                <CardHeader>
                  <CardTitle className={themeClasses.text.primary}>
                    Order Progress
                  </CardTitle>
                  <CardDescription>
                    Track the current status and next steps for this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {PROGRESS_STEPS.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const StepIcon =
                        ORDER_STATUS[step.key as keyof typeof ORDER_STATUS]
                          .icon;

                      return (
                        <div
                          key={step.key}
                          className="flex items-center gap-4"
                        >
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                              isCompleted
                                ? "bg-green-100 text-green-600 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                                : isCurrent
                                ? "bg-blue-100 text-blue-600 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
                                : "bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-600"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <StepIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                isCurrent
                                  ? "text-blue-600 dark:text-blue-400"
                                  : isCompleted
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-500 dark:text-gray-500"
                              }`}
                            >
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Current status • Updated{" "}
                                {formatDate(order.updatedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card
                className={`${themeClasses.card.bg} border ${themeClasses.border.primary}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className={`${themeClasses.text.primary} text-lg sm:text-xl`}>
                    Order Items
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""} • Total:{" "}
                    {formatPrice(order.totalAmount)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-0 sm:p-6">
                  {order.items.map((item) => {
                    let attributes: string | undefined;
                    try {
                      attributes = item.attributes
                        ? Object.values(JSON.parse(item.attributes)).join(", ")
                        : undefined;
                    } catch {}

                    return (
                      <div
                        key={item.id}
                        className={`flex justify-between items-start p-3 sm:p-4 border-b ${themeClasses.border.primary} last:border-b-0 ${themeClasses.card.hover} transition-colors`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                            {item.product.image ? (
                              <Image
                                src={item.product.image.url}
                                alt={item.product.image.alt || item.productName}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-semibold ${themeClasses.text.primary} text-sm sm:text-base truncate`}
                            >
                              {item.productName}
                            </h4>
                            <p
                              className={`text-xs sm:text-sm ${themeClasses.text.secondary}`}
                            >
                              {item.product.brand}
                            </p>
                            <p
                              className={`text-xs sm:text-sm ${themeClasses.text.secondary}`}
                            >
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                            {attributes && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                                {attributes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p
                            className={`font-semibold ${themeClasses.text.primary} text-sm sm:text-lg`}
                          >
                            {formatPrice(
                              (
                                parseFloat(item.price) * item.quantity
                              ).toString()
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Status History */}
              {order.statusHistory.length > 0 && (
                <Card
                  className={`${themeClasses.card.bg} border ${themeClasses.border.primary}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className={`${themeClasses.text.primary} text-lg sm:text-xl`}>
                      Status History
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Timeline of order status updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 p-0 sm:p-6">
                    {order.statusHistory.map((history) => {
                      const HistoryIcon =
                        ORDER_STATUS[
                          history.status as keyof typeof ORDER_STATUS
                        ].icon;
                      return (
                        <div
                          key={history.id}
                          className={`flex items-start gap-3 border-b ${themeClasses.border.primary} p-3 last:border-b-0 ${themeClasses.card.hover} transition-colors`}
                        >
                          <HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p
                                className={`font-medium capitalize ${themeClasses.text.primary} text-sm sm:text-base`}
                              >
                                {history.status}
                              </p>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getStatusClass(
                                  history.status
                                )}`}
                              >
                                {history.status}
                              </Badge>
                            </div>
                            {history.notes && (
                              <p
                                className={`text-xs sm:text-sm ${themeClasses.text.secondary} break-words`}
                              >
                                {history.notes}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-2">
                              <Calendar className="w-3 h-3" />
                              {formatDate(history.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar - Hidden on mobile */}
            <div className="hidden lg:block space-y-6">
              {/* Order Summary */}
              <Card
                className={`${themeClasses.card.bg} border ${themeClasses.border.primary}`}
              >
                <CardHeader>
                  <CardTitle className={themeClasses.text.primary}>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className={themeClasses.text.secondary}>
                      Subtotal
                    </span>
                    <span
                      className={`font-medium ${themeClasses.text.primary}`}
                    >
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>

                  {parseFloat(order.discountAmount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 dark:text-green-400">
                        Discount
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -{formatPrice(order.discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className={themeClasses.text.secondary}>
                      Shipping
                    </span>
                    <span
                      className={`font-medium ${themeClasses.text.primary}`}
                    >
                      {parseFloat(order.shippingAmount) === 0
                        ? "Free"
                        : formatPrice(order.shippingAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={themeClasses.text.secondary}>Tax</span>
                    <span
                      className={`font-medium ${themeClasses.text.primary}`}
                    >
                      {formatPrice(order.taxAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 font-semibold text-lg">
                    <span className={themeClasses.text.primary}>Total</span>
                    <span className={themeClasses.text.primary}>
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card
                className={`${themeClasses.card.bg} border ${themeClasses.border.primary}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${themeClasses.text.primary}`}
                  >
                    <User className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className={`flex items-center gap-3 p-2 rounded-lg ${themeClasses.bg.muted}`}
                  >
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>
                        {order.userName ||
                          order.customerEmail?.split("@")[0] ||
                          "Guest Customer"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-2 rounded-lg ${themeClasses.bg.muted}`}
                  >
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      className={`text-sm font-medium ${themeClasses.text.primary}`}
                    >
                      {order.customerPhone}
                    </span>
                  </div>

                  {order.customerEmail && (
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg ${themeClasses.bg.muted}`}
                    >
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span
                        className={`text-sm font-medium ${themeClasses.text.primary}`}
                      >
                        {order.customerEmail}
                      </span>
                    </div>
                  )}

                  {order.guestSessionId && (
                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-700 rounded-lg">
                      <p className="font-medium text-orange-800 dark:text-orange-300 text-sm">
                        Guest Order
                      </p>
                      <p className="text-orange-700 dark:text-orange-400 text-xs mt-1">
                        Session: {order.guestSessionId}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card
                className={`${themeClasses.card.bg} border ${themeClasses.border.primary}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${themeClasses.text.primary}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg ${themeClasses.bg.muted}`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span
                          className={`font-medium capitalize ${themeClasses.text.primary}`}
                        >
                          {order.paymentMethod.replace("_", " ")}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusClass(
                          order.paymentStatus,
                          "payment"
                        )}`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>

                    {order.paymentStatus === "paid" && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        <CheckCircle className="w-4 h-4" />
                        <span>Payment completed successfully</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.address && (
                <Card
                  className={`${themeClasses.card.bg} border ${themeClasses.border.primary}`}
                >
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 ${themeClasses.text.primary}`}
                    >
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div
                        className={`flex items-start gap-2 p-2 rounded-lg ${themeClasses.bg.muted}`}
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p
                            className={`font-medium ${themeClasses.text.primary}`}
                          >
                            {order.address.fullName}
                          </p>
                          <p className={themeClasses.text.secondary}>
                            {order.address.address}
                          </p>
                          <p className={themeClasses.text.secondary}>
                            {order.address.city}, {order.address.region}
                          </p>
                          <p className={themeClasses.text.secondary}>
                            {order.address.country}
                          </p>
                          <p className={themeClasses.text.secondary}>
                            {order.address.phone}
                          </p>
                          {order.address.email && (
                            <p className={themeClasses.text.secondary}>
                              {order.address.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {order.address.notes && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700 rounded-lg">
                          <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                            Delivery Notes:
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            {order.address.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions Footer */}
      <MobileQuickActions />
    </div>
  );
}