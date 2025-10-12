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
} from "lucide-react";
import { OrderDetail, OrderResponse } from "@/lib/types/admin-orders-details";


const ORDER_STATUS = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Package },
  confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  processing: { color: "bg-orange-100 text-orange-800", icon: Package },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800", icon: FileText },
  refunded: { color: "bg-gray-100 text-gray-800", icon: CreditCard },
} as const;

const PAYMENT_STATUS = {
  pending: "bg-yellow-100 text-yellow-800",
  unpaid: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
} as const;

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const orderId = params.orderId as string;

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

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
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchOrder();
      } else toast.error(data.error || "Failed to update status");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  if (loading)
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-32 bg-gray-400/60 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-400/60 rounded"></div>
            <div className="h-32 bg-gray-400/60 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-400/60 rounded"></div>
            <div className="h-32 bg-gray-400/60 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <Button className="mt-4" onClick={() => router.push("/admin-dashboard/orders")}>
          Back to Orders
        </Button>
      </div>
    );

  const progressSteps = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex = progressSteps.indexOf(order.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/orders")}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`capitalize ${ORDER_STATUS[order.status as keyof typeof ORDER_STATUS].color}`}
          >
            {order.status}
          </Badge>
          {!order.userId && <Badge variant="secondary">Guest</Badge>}
        </div>
      </div>

      {/* Admin Action Panel */}
      <div className="sticky top-4 flex flex-wrap gap-2 z-10">
        {progressSteps.map((status, idx) => (
          <Button
            key={status}
            disabled={idx <= currentIndex || updatingStatus}
            onClick={() => updateOrderStatus(status)}
            size="sm"
          >
            Set {status}
          </Button>
        ))}
        <Button variant="destructive" size="sm">
          Cancel / Refund
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>{order.items.length} items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => {
                let attributes: string | undefined;
                try {
                  attributes = item.attributes
                    ? Object.values(JSON.parse(item.attributes)).join(", ")
                    : undefined;
                } catch {}
                return (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {item.product.image ? (
                          <Image
                            src={item.product.image.url}
                            alt={item.product.image.alt || item.productName}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.productName}</h4>
                        <p className="text-sm text-gray-500">{item.product.brand}</p>
                        <p className="text-sm">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        {attributes && <p className="text-xs text-gray-400">{attributes}</p>}
                      </div>
                    </div>
                    <p className="font-semibold">{formatPrice((parseFloat(item.price) * item.quantity).toString())}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Status History */}
          {order.statusHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.statusHistory.map((history) => {
                  const StatusIcon = ORDER_STATUS[history.status as keyof typeof ORDER_STATUS].icon;
                  return (
                    <div key={history.id} className="flex items-start gap-3 border p-3 rounded-lg">
                      <StatusIcon className="w-5 h-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium capitalize">{history.status}</p>
                        {history.notes && <p className="text-sm text-gray-600">{history.notes}</p>}
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> {formatDate(history.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="font-medium">{order.userName || order.customerEmail?.split("@")[0] || "Guest"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> <p>{order.customerPhone}</p>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> <p>{order.customerEmail}</p>
                </div>
              )}
              {order.guestSessionId && (
                <Badge variant="secondary">Guest Session: {order.guestSessionId}</Badge>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <p className="capitalize">{order.paymentMethod.replace("_", " ")}</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${PAYMENT_STATUS[order.paymentStatus as keyof typeof PAYMENT_STATUS]}`}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">{order.address.fullName}</p>
                    <p>{order.address.address}</p>
                    <p>{order.address.city}, {order.address.region}</p>
                    <p>{order.address.country}</p>
                    <p>{order.address.phone}</p>
                    {order.address.email && <p>{order.address.email}</p>}
                    {order.address.notes && (
                      <p className="text-xs mt-1 bg-blue-50/30 border border-blue-200 rounded p-1">{order.address.notes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
