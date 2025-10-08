// components/checkout/steps/payment-step.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Wallet, Clock } from 'lucide-react';
import { PaymentData } from '@/lib/types/checkout';
import { paymentSchema } from '@/lib/validation-schemas/checkout';

interface PaymentStepProps {
  data: PaymentData;
  onUpdate: (data: PaymentData) => void;
  onNext: () => void;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'cash_delivery',
    name: 'Cash on Delivery',
    description: 'Pay with cash when you receive your order',
    icon: Wallet,
    available: true,
    badge: null
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pay securely with M-Pesa mobile money',
    icon: Smartphone,
    available: false,
    badge: 'Coming Soon'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, or other cards',
    icon: CreditCard,
    available: false,
    badge: 'Coming Soon'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Transfer directly to our bank account',
    icon: CreditCard,
    available: false,
    badge: 'Coming Soon'
  }
];

export default function PaymentStep({ data, onUpdate, onNext, onBack }: PaymentStepProps) {
  const [formData, setFormData] = useState<PaymentData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleMethodChange = (method: string) => {
    const newData = { method };
    setFormData(newData);
    
    if (touched.method) {
      validateField('method', method);
    }
    
    onUpdate(newData);
  };

  const handleBlur = (field: keyof PaymentData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof PaymentData, value: string) => {
    const result = paymentSchema.pick({ [field]: true }).safeParse({ [field]: value });
    
    if (!result.success) {
      const error = result.error.issues[0]?.message || 'Invalid value';
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const result = paymentSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit
    setTouched({
      method: true
    });

    if (validateForm()) {
      onNext();
    }
  };

  const isFormValid = paymentSchema.safeParse(formData).success;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Payment Method
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Choose how you want to pay for your order
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <Label className="text-sm font-medium mb-4 block">
            Select Payment Method
          </Label>
          <RadioGroup
            value={formData.method}
            onValueChange={handleMethodChange}
            className="space-y-4"
          >
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                    !method.available 
                      ? 'opacity-60 cursor-not-allowed' 
                      : formData.method === method.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  } ${errors.method ? 'border-red-500' : ''}`}
                  onClick={() => method.available && handleMethodChange(method.id)}
                >
                  <RadioGroupItem 
                    value={method.id} 
                    id={method.id} 
                    disabled={!method.available}
                    onBlur={() => handleBlur('method')}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <Label 
                        htmlFor={method.id} 
                        className={`font-medium cursor-pointer ${!method.available && 'cursor-not-allowed'}`}
                      >
                        {method.name}
                      </Label>
                      {method.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {method.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {method.description}
                    </p>
                    {!method.available && (
                      <p className="text-xs text-amber-600 mt-1">
                        This payment method will be available soon
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </RadioGroup>
          {errors.method && (
            <p className="text-red-500 text-xs mt-2">{errors.method}</p>
          )}
        </div>

        {/* Payment Information Box */}
        {formData.method === 'cash_delivery' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-300">
                  Cash on Delivery Selected
                </h4>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  You&apos;ll pay with cash when you receive your order. Please have the exact amount ready.
                </p>
                <ul className="text-xs text-green-600 dark:text-green-500 mt-2 space-y-1">
                  <li>• Payment is made upon delivery/pickup</li>
                  <li>• Please check items before payment</li>
                  <li>• Have exact change ready if possible</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">
              Please fix the errors above to continue
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Your order will be processed once you confirm on the next step</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Review Order
          </Button>
        </div>
      </form>
    </div>
  );
}