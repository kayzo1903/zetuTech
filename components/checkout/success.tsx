// app/checkout/success/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Phone,
  Download,
  Loader2,
  Shield,
  ExternalLink,
} from "lucide-react";

interface OrderData {
  order: {
    id: string;
    orderNumber: string;
    orderDate: string;
    status: string;
    subtotal: number;
    shippingAmount: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: string;
    deliveryMethod: string;
    customerPhone: string;
    customerEmail?: string;
    receiptUrl?: string;
    verificationCode?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    region: string;
    country: string;
  } | null;
}

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);

  const orderId = searchParams.get("orderId");

  const fetchOrderData = useCallback(async () => {
    try {
      console.log("🔄 Fetching order data...");
      const response = await fetch(`/api/orders/${orderId}/receipt-data`);
      const result = await response.json();

      if (result.success) {
        setOrderData(result.data);
        // If receipt already exists, set verification link
        if (result.data.order.verificationCode) {
          setVerificationLink(
            `${window.location.origin}/verify/${result.data.order.verificationCode}`
          );
        }
      } else {
        setError(result.error || "Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    fetchOrderData();
  }, [orderId, router, fetchOrderData]);

  const generateReceipt = useCallback(
    async (autoDownload = false) => {
      if (!orderId || isGenerating) return;

      setIsGenerating(true);
      setError(null);

      try {
        console.log("🔄 Generating new receipt...");
        const response = await fetch(
          `/api/orders/${orderId}/generate-receipt`,
          {
            method: "POST",
          }
        );

        const result = await response.json();

        if (result.success) {
          setVerificationLink(result.verifyLink);
          // Update order data with new receipt info
          setOrderData((prev) =>
            prev
              ? {
                  ...prev,
                  order: {
                    ...prev.order,
                    receiptUrl: result.receiptUrl,
                    verificationCode: result.verificationCode,
                  },
                }
              : null
          );

          // Auto-download only if requested
          if (autoDownload && result.receiptUrl) {
            await downloadReceiptDirectly(result.receiptUrl);
          }
        } else {
          setError(result.error || "Failed to generate receipt");
        }
      } catch (error) {
        console.error(error)
        setError("Failed to generate receipt. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    [orderId, isGenerating]
  );

  const downloadReceiptDirectly = async (receiptUrl: string) => {
    try {
      const response = await fetch(receiptUrl);

      if (!response.ok) {
        throw new Error(`Failed to download receipt: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `zetutech-receipt-${
        orderData?.order.orderNumber || "receipt"
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw error;
    }
  };

  const downloadReceipt = async () => {
    if (!orderData) return;

    setIsDownloading(true);
    setError(null);

    try {
      // If receipt already exists and has a URL, download it directly
      if (orderData.order.receiptUrl) {
        await downloadReceiptDirectly(orderData.order.receiptUrl);
        return;
      }

      // If no receipt exists, generate one first WITH auto-download
      await generateReceipt(true);
    } catch (error) {
      console.error(error)
      setError("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateOnly = async () => {
    if (!orderId) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}/generate-receipt`, {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        setVerificationLink(result.verifyLink);
        setOrderData((prev) =>
          prev
            ? {
                ...prev,
                order: {
                  ...prev.order,
                  receiptUrl: result.receiptUrl,
                  verificationCode: result.verificationCode,
                },
              }
            : null
        );
      } else {
        setError(result.error || "Failed to generate receipt");
      }
    } catch (error) {
      console.error(error)
      setError("Failed to generate receipt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPaymentMethod = (method: string): string => {
    const methods: { [key: string]: string } = {
      cash_delivery: "Cash on Delivery",
      card: "Credit/Debit Card",
      mobile_money: "Mobile Money",
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unable to Load Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return <div>Order not found</div>;
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order Number
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{orderData.order.orderNumber}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(orderData.order.orderDate).toLocaleDateString(
                  "en-TZ"
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">We&apos;ll contact you</p>
                  <p className="text-sm text-gray-600">
                    On {orderData.order.customerPhone}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-sm mb-1">What&apos;s Next?</p>
                <ul className="text-sm text-gray-600 space-y-1 dark:text-gray-200">
                  <li>• We&apos;ll prepare your order within 24 hours</li>
                  <li>
                    • You&apos;ll receive a call to confirm pickup/delivery
                    details
                  </li>
                  <li>• Bring your ID and order number for pickup</li>
                  <li>
                    • Pay with{" "}
                    {formatPaymentMethod(
                      orderData.order.paymentMethod
                    ).toLowerCase()}{" "}
                    when you collect your items
                  </li>
                </ul>
              </div>

              {/* Order Summary Preview */}
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium text-sm mb-2">Order Summary</p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Items ({orderData.items.length}):</span>
                    <span className="font-medium">
                      {formatCurrency(orderData.order.subtotal)}
                    </span>
                  </div>
                  {orderData.order.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>
                        -{formatCurrency(orderData.order.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {formatCurrency(orderData.order.shippingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(orderData.order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(orderData.order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/account/orders/${orderId}`}>View Order Details</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>

          {/* Receipt Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={downloadReceipt}
              disabled={isDownloading || isGenerating}
            >
              {isDownloading || isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isGenerating
                ? "Generating..."
                : isDownloading
                ? "Downloading..."
                : "Download Receipt"}
            </Button>

            {!orderData.order.receiptUrl && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleGenerateOnly}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                {isGenerating ? "Generating..." : "Generate Only"}
              </Button>
            )}
          </div>
        </div>

        {/* Verification & Receipt Status */}
        <div className="mt-6 space-y-4">
          {verificationLink && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    ✅ Receipt Generated & Verified
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your receipt is secured with verification code
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={verificationLink} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Verify Online
                    </Link>
                  </Button>
                  {orderData.order.receiptUrl && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={orderData.order.receiptUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View PDF
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!orderData.order.receiptUrl && !isGenerating && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📄 Generate a secure, verifiable receipt for your records
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Choose &quot;Download Receipt&quot; to generate and download, or
                &quot;Generate Only&quot; to create without downloading.
              </p>
            </div>
          )}
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Need help? Contact us at <strong>+255 123 456 789</strong> or
          </p>
          <p>
            email <strong>support@zetutech.co.tz</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
