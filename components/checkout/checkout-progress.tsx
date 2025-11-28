// components/checkout/checkout-progress.tsx
'use client';

import { Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Contact', description: 'Phone & Region' },
  { id: 2, name: 'Delivery', description: 'Method & Location' },
  { id: 3, name: 'Address', description: 'Shipping Details' },
  { id: 4, name: 'Payment', description: 'Payment Method' },
  { id: 5, name: 'Review', description: 'Confirm Order' },
];

interface CheckoutProgressProps {
  currentStep: number;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <li key={step.id} className="flex-1">
            <div className="flex flex-col items-center">
              {/* Connector Line */}
              {index > 0 && (
                <div
                  className={`w-full h-0.5 absolute -left-1/2 top-4 -z-10 ${
                    step.id <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
              
              {/* Step Circle */}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id < currentStep
                    ? 'bg-blue-600'
                    : step.id === currentStep
                    ? 'bg-blue-600 border-2 border-blue-600'
                    : 'bg-gray-300'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      step.id === currentStep ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </div>

              {/* Step Labels */}
              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-medium ${
                    step.id <= currentStep
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}