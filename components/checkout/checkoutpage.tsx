// app/checkout/page.tsx - Enhanced for guest support
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart/store";
import CheckoutProgress from "./checkout-progress";
import DeliveryStep from "@/components/checkout/steps/delivery-step";
import ContactStep from "./steps/contact-step";
import OrderSummary from "./order-summary";
import AddressStep from "./steps/address-step";
import PaymentStep from "./steps/payment-step";
import ReviewStep from "./steps/review-step";
import { AddressData, CheckoutData, ContactData, DeliveryData, PaymentData } from "@/lib/types/checkout";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getClientGuestSessionId } from "@/lib/server/cart/client-session-util";

export default function CheckoutPage() {
  const { items, summary, isLoading, clearCart } = useCartStore();
  const { data: session } = authClient.useSession(); // or your auth context
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: { phone: "", email: "", region: "" },
    delivery: { method: "", agentLocation: "" },
    address: { fullName: "", address: "", city: "", notes: "" },
    payment: { method: "cash_delivery" },
  });

  // Get guest session ID for guest orders
  const guestSessionId = getClientGuestSessionId(); //whats plan here it was just declared 

  // Redirect if cart is empty
  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p>Add some products to proceed to checkout</p>
        </div>
      </div>
    );
  }

  const updateCheckoutData = (
    step: keyof CheckoutData,
    data: ContactData | DeliveryData | AddressData | PaymentData
  ) => {
    setCheckoutData((prev) => ({ ...prev, [step]: data }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleOrderConfirmation = async () => {
    try {
      const isDarEsSalaam = checkoutData.contact?.region === "Dar es Salaam";
      const shippingCost = isDarEsSalaam ? 0 : 15000;

      const orderData = {
        contact: checkoutData.contact,
        delivery: checkoutData.delivery,
        address: checkoutData.address,
        payment: checkoutData.payment,
        pricing: {
          subtotal: summary.originalTotal,
          discount: summary.totalDiscount,
          shipping: shippingCost,
          tax: Math.round(summary.cartTotal * 0.18),
          total: summary.cartTotal + shippingCost + Math.round(summary.cartTotal * 0.18),
        },
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          attributes: item.selectedAttributes,
        })),
        
        // Send user ID if logged in, otherwise rely on session
        userId: session?.user?.id || null,
        // Include guest session ID for tracking
        guestSessionId: !session?.user ? guestSessionId : null,
      };

      // Call the order creation API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Order placed successfully!');
        
        // Clear local cart state
        clearCart();
        
        // Redirect to success page with guest info
        router.push(`/checkout/success?orderId=${result.order.id}&orderNumber=${result.order.orderNumber}&isGuest=${result.order.isGuest}`);
      } else {
        throw new Error(result.error || 'Failed to create order');
      }

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContactStep
            data={checkoutData.contact}
            onUpdate={(data: ContactData) => updateCheckoutData("contact", data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DeliveryStep
            data={checkoutData.delivery}
            contactData={checkoutData.contact}
            onUpdate={(data: DeliveryData) => updateCheckoutData("delivery", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <AddressStep
            data={checkoutData.address}
            deliveryData={checkoutData.delivery}
            onUpdate={(data: AddressData) => updateCheckoutData("address", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <PaymentStep
            data={checkoutData.payment}
            onUpdate={(data: PaymentData) => updateCheckoutData("payment", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <ReviewStep
            checkoutData={checkoutData}
            onConfirm={handleOrderConfirmation}
            onBack={prevStep}
            isGuest={!session?.user} // Pass guest status to review step
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with guest notice */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Checkout
            </h1>
            {!session?.user && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                🔒 Guest Checkout
              </div>
            )}
          </div>
          {!session?.user && (
            <p className="text-sm text-gray-600 mt-2">
              You&apos;re checking out as a guest. <button className="text-blue-600 hover:underline">Sign in</button> to save your order history.
            </p>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <CheckoutProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">{renderStep()}</div>
          <div className="lg:col-span-1">
            <OrderSummary checkoutData={checkoutData} isGuest={!session?.user} />
          </div>
        </div>
      </div>
    </div>
  );
}