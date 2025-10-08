// components/checkout/steps/review-step.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cart/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Edit2, MapPin, User, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewStepProps } from '@/lib/types/checkout';


export default function ReviewStep({ checkoutData, onConfirm, onBack }: ReviewStepProps) {
  const { items, summary } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fixed shipping logic
  const isDarEsSalaam = checkoutData.contact?.region === 'Dar es Salaam';
  const shippingCost = isDarEsSalaam ? 0 : 15000;
  
  const tax = summary.cartTotal * 0.18;
  const total = summary.cartTotal + shippingCost + tax;

  const isDirectDelivery = checkoutData.delivery?.method === 'direct_delivery';
 // const isAgentPickup = checkoutData.delivery?.method === 'agent_pickup';

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - will be connected to real API in Phase 2
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Order placed successfully!', {
        description: 'You will receive a confirmation message shortly.'
      });
      
      await onConfirm();
    } catch (error) {
        console.error(error)
      toast.error('Failed to place order', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Review Your Order
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Please review all information before confirming your order
      </p>

      <div className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h3>
              <Button variant="ghost" size="sm" className="h-8">
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="space-y-1 text-sm">
              <p><strong>Phone:</strong> {checkoutData.contact?.phone}</p>
              {checkoutData.contact?.email && (
                <p><strong>Email:</strong> {checkoutData.contact.email}</p>
              )}
              <p><strong>Region:</strong> {checkoutData.contact?.region}</p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Information
              </h3>
              <Button variant="ghost" size="sm" className="h-8">
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={isDirectDelivery ? "default" : "secondary"}>
                  {isDirectDelivery ? 'Direct Delivery' : 'Agent Pickup'}
                </Badge>
                <span>
                  {isDirectDelivery ? `TZS ${shippingCost.toLocaleString()}` : 'FREE'}
                </span>
              </div>
              
              {isDirectDelivery ? (
                <div>
                  <p><strong>Address:</strong> {checkoutData.address?.address}</p>
                  <p><strong>City:</strong> {checkoutData.address?.city}</p>
                  {checkoutData.address?.notes && (
                    <p><strong>Instructions:</strong> {checkoutData.address.notes}</p>
                  )}
                </div>
              ) : (
                <div>
                  <p><strong>Pickup Location:</strong> {checkoutData.delivery?.agentLocation}</p>
                  <p className="text-amber-600 text-sm">
                    Please bring your ID for verification
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </h3>
              <Button variant="ghost" size="sm" className="h-8">
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="text-sm">
              <Badge variant="outline" className="mb-2">
                {checkoutData.payment?.method === 'cash_delivery' ? 'Cash on Delivery' : 'Online Payment'}
              </Badge>
              <p className="text-gray-600">
                {checkoutData.payment?.method === 'cash_delivery' 
                  ? 'Pay with cash when you receive your order'
                  : 'Payment will be processed immediately'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-500">
                      Qty: {item.quantity} × TZS {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-medium">
                    TZS {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>TZS {summary.cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? 'Free' : `TZS ${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (18%)</span>
                <span>TZS {Math.round(tax).toLocaleString()}</span>
              </div>
              {summary.totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-TZS {summary.totalDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>TZS {total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-300">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
              </p>
              <p className="text-blue-700 dark:text-blue-400 mt-1">
                {checkoutData.payment?.method === 'cash_delivery'
                  ? 'Your order will be prepared and you will be contacted for delivery/pickup arrangements.'
                  : 'Your payment will be processed and order confirmed immediately.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Placing Order...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}