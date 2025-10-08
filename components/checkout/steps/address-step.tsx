// components/checkout/steps/address-step.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addressSchema } from '@/lib/validation-schemas/checkout';

interface AddressStepProps {
  data: {
    fullName: string;
    address: string;
    city: string;
    notes: string;
  };
  deliveryData: {
    method: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AddressStep({
  data,
  deliveryData,
  onUpdate,
  onNext,
  onBack,
}: AddressStepProps) {
  const [formData, setFormData] = useState(data);
  const [error, setError] = useState<string | null>(null);

  const isDirectDelivery = deliveryData.method === 'direct_delivery';

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
    setError(null); // clear errors on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using zod schema
    const result = addressSchema.safeParse(formData);

    // Extra validation for direct delivery (city + address required)
    if (isDirectDelivery) {
      if (!formData.address || formData.address.length < 5 || !formData.city || formData.city.length < 2) {
        setError("Address and city are required for direct delivery");
        return;
      }
    }

    if (!result.success) {
      const firstError = result.error.message ?? "Invalid input";
      setError(firstError);
      return;
    }

    // Success
    setError(null);
    onNext();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {isDirectDelivery ? 'Delivery Address' : 'Contact Information'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {isDirectDelivery
          ? 'Where should we deliver your order?'
          : 'Your information for pickup verification'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Full Name */}
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            For delivery verification and identification
          </p>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium">
            {isDirectDelivery ? 'Delivery Address *' : 'Address (Optional)'}
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder={
              isDirectDelivery
                ? 'Street address, building, floor, etc.'
                : 'Your address (optional)'
            }
            className="mt-1"
            rows={3}
            required={isDirectDelivery}
          />
          {isDirectDelivery && (
            <p className="text-xs text-gray-500 mt-1">
              Please provide detailed address for smooth delivery
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city" className="text-sm font-medium">
            City {isDirectDelivery && '*'}
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Dar es Salaam"
            className="mt-1"
            required={isDirectDelivery}
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm font-medium">
            Delivery Instructions
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder={
              isDirectDelivery
                ? 'e.g., Call before delivery, gate color, landmark...'
                : 'e.g., Preferred pickup time, special requests...'
            }
            className="mt-1"
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">
            Any special instructions for {isDirectDelivery ? 'delivery' : 'pickup'}
          </p>
        </div>

        {/* Info Box */}
        <div
          className={`p-4 rounded-lg ${
            isDirectDelivery
              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200'
              : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200'
          }`}
        >
          <h4 className="font-medium text-sm mb-2">
            {isDirectDelivery ? '🚚 Direct Delivery' : '📍 Agent Pickup'}
          </h4>
          <p className="text-sm">
            {isDirectDelivery
              ? 'Our delivery team will contact you before delivery. Ensure someone is available to receive and pay for the package.'
              : 'Please bring your ID and order confirmation when picking up. Payment will be made at the pickup point.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
}
