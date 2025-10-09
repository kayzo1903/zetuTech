'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactData } from '@/lib/types/checkout';
import { contactSchema } from '@/lib/validation-schemas/checkout';

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
  'Other',
];

interface ContactStepProps {
  data: ContactData;
  onUpdate: (data: ContactData) => void;
  onNext: () => void;
}

export default function ContactStep({ data, onUpdate, onNext }: ContactStepProps) {
  const [formData, setFormData] = useState<ContactData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // --- Helper: Format phone for readability ---
  const formatPhone = (input: string): string => {
    let digits = input.replace(/\D/g, ''); // remove non-digits
    if (digits.startsWith('0')) digits = '255' + digits.slice(1);
    else if (!digits.startsWith('255')) digits = '255' + digits;
    digits = digits.slice(0, 12);
    const formatted = `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`.trim();
    return formatted;
  };

  const cleanPhone = (value: string) => value.replace(/\D/g, '').replace(/^255/, '+255');

  const handleChange = (field: keyof ContactData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (touched[field]) validateField(field, value);
    onUpdate(newData);
  };

  const handleBlur = (field: keyof ContactData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof ContactData, value: string) => {
    const sanitized = field === 'phone' ? cleanPhone(value) : value;
    const result = contactSchema.pick({ [field]: true }).safeParse({ [field]: sanitized });

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
    const sanitizedData = {
      ...formData,
      phone: cleanPhone(formData.phone),
    };

    const result = contactSchema.safeParse(sanitizedData);
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
    setTouched({ phone: true, email: true, region: true });
    if (validateForm()) onNext();
  };

  const isFormValid = contactSchema.safeParse({
    ...formData,
    phone: cleanPhone(formData.phone),
  }).success;

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
            onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
            onBlur={() => handleBlur('phone')}
            placeholder="+255 712 345 678"
            className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Use <strong>+255</strong> format, e.g. <strong>+255712345678</strong>
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
            onBlur={() => handleBlur('email')}
            placeholder="your@email.com"
            className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
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
            <SelectTrigger
              className={`mt-1 ${errors.region ? 'border-red-500' : ''}`}
              onBlur={() => handleBlur('region')}
            >
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
          {errors.region && (
            <p className="text-red-500 text-xs mt-1">{errors.region}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            This determines available delivery options
          </p>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">
              Please fix the errors above to continue
            </p>
          </div>
        )}

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
