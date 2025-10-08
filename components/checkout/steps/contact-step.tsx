// components/checkout/steps/contact-step.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TANZANIA_REGIONS = [
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Tanga',
  'Kahama',
  'Tabora',
  'Zanzibar',
  'Other'
];

interface ContactStepProps {
  data: {
    phone: string;
    email: string;
    region: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export default function ContactStep({ data, onUpdate, onNext }: ContactStepProps) {
  const [formData, setFormData] = useState(data);

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  const isFormValid = formData.phone && formData.region;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Contact Information
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        We&apos;ll use this to contact you about your order
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Number */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+255 XXX XXX XXX"
            className="mt-1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            We&apos;ll call/SMS this number for delivery updates
          </p>
        </div>

        {/* Email (Optional) */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your@email.com"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional - for order confirmation and receipts
          </p>
        </div>

        {/* Region Selection */}
        <div>
          <Label htmlFor="region" className="text-sm font-medium">
            Your Region *
          </Label>
          <Select
            value={formData.region}
            onValueChange={(value) => handleChange('region', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent>
              {TANZANIA_REGIONS.map(region => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            This determines delivery options available
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue to Delivery
          </Button>
        </div>
      </form>
    </div>
  );
}