// app/checkout/page.tsx
"use client";

import { useState } from "react";
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

export default function CheckoutPage() {
  const { items, summary, isLoading } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: { phone: "", email: "", region: "" },
    delivery: { method: "", agentLocation: "" },
    address: { fullName: "", address: "", city: "", notes: "" },
    payment: { method: "cash_delivery" },
  });

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
          />
        );
      default:
        return null;
    }
  };

  const handleOrderConfirmation = async () => {
    try {
      // ✅ Fixed shipping calculation
      const isDarEsSalaam = checkoutData.contact?.region === "Dar es Salaam";
      const shippingCost = isDarEsSalaam ? 0 : 15000;

      const orderData = {
        // Customer information
        contact: checkoutData.contact,
        delivery: checkoutData.delivery,
        address: checkoutData.address,
        payment: checkoutData.payment,

        // ✅ Correct pricing with proper shipping
        pricing: {
          subtotal: summary.originalTotal,
          discount: summary.totalDiscount,
          shipping: shippingCost, // Now correctly 0 or 15,000
          tax: Math.round(summary.cartTotal * 0.18),
          total:
            summary.cartTotal +
            shippingCost +
            Math.round(summary.cartTotal * 0.18),
        },

        // Cart items
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          attributes: item.selectedAttributes,
        })),

        // Additional metadata
        cartSummary: summary,
        timestamp: new Date().toISOString(),
      };

      console.log("Order data with correct shipping:", orderData);
      toast.success("Order data prepared successfully!");
    } catch (error) {
      console.error("Order preparation error:", error);
      toast.error("Failed to prepare order data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Stepper */}
        <CheckoutProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2">{renderStep()}</div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary checkoutData={checkoutData} />
          </div>
        </div>
      </div>
    </div>
  );
}