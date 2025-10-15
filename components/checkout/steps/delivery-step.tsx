// components/checkout/steps/delivery-step.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { DeliveryData } from '@/lib/types/checkout';
import { deliverySchema } from '@/lib/validation-schemas/checkout';
import { DAR_ES_SALAAM_AGENTS, OTHER_REGION_AGENTS } from '@/lib/delivery/address';

interface DeliveryStepProps {
  data: DeliveryData;
  contactData: {
    region: string;
  };
  onUpdate: (data: DeliveryData) => void;
  onNext: () => void;
  onBack: () => void;
}




export default function DeliveryStep({ data, contactData, onUpdate, onNext, onBack }: DeliveryStepProps) {
  const [formData, setFormData] = useState<DeliveryData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isDarEsSalaam = contactData.region === 'Dar es Salaam';

  const deliveryOptions = isDarEsSalaam 
    ? [
        {
          id: 'direct_delivery',
          name: 'Direct Delivery',
          description: 'We deliver directly to your address',
          price: 0,
          available: true
        },
        {
          id: 'agent_pickup',
          name: 'Agent Pickup',
          description: 'Pick up from our local agent',
          price: 0,
          available: true
        }
      ]
    : [
        {
          id: 'agent_pickup',
          name: 'Agent Pickup',
          description: 'Pick up from our local agent',
          price: 15000,
          available: true
        }
      ];

  const availableAgents = isDarEsSalaam 
    ? DAR_ES_SALAAM_AGENTS 
    : OTHER_REGION_AGENTS[contactData.region] || [];

  const handleMethodChange = (method: string) => {
    const newData = { ...formData, method, agentLocation: '' };
    setFormData(newData);
    
    if (touched.method) {
      validateField('method', method);
    }
    
    onUpdate(newData);
  };

  const handleAgentChange = (agentLocation: string) => {
    const newData = { ...formData, agentLocation };
    setFormData(newData);
    
    if (touched.agentLocation) {
      validateField('agentLocation', agentLocation);
    }
    
    onUpdate(newData);
  };

  const handleBlur = (field: keyof DeliveryData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof DeliveryData] as string);
  };

  const validateField = (field: keyof DeliveryData, value: string) => {
    const result = deliverySchema.pick({ [field]: true }).safeParse({ [field]: value });
    
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
    const result = deliverySchema.safeParse(formData);
    
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
      method: true,
      agentLocation: true
    });

    if (validateForm()) {
      onNext();
    }
  };

  const isFormValid = deliverySchema.safeParse(formData).success;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Delivery Method
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        How would you like to receive your order?
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Method Selection */}
        <div>
          <Label className="text-sm font-medium mb-4 block">
            Choose Delivery Method
          </Label>
          <RadioGroup
            value={formData.method}
            onValueChange={handleMethodChange}
            className="space-y-4"
          >
            {deliveryOptions.map(option => (
              <div
                key={option.id}
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.method === option.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                } ${errors.method ? 'border-red-500' : ''}`}
                onClick={() => handleMethodChange(option.id)}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id} 
                  onBlur={() => handleBlur('method')}
                />
                <div className="flex-1 min-w-0">
                  <Label htmlFor={option.id} className="font-medium cursor-pointer">
                    {option.name}
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={option.price === 0 ? "secondary" : "default"}>
                      {option.price === 0 ? 'FREE' : `TZS ${option.price.toLocaleString()}`}
                    </Badge>
                    {!isDarEsSalaam && option.id === 'agent_pickup' && (
                      <Badge variant="outline">Available</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
          {errors.method && (
            <p className="text-red-500 text-xs mt-2">{errors.method}</p>
          )}
        </div>

        {/* Agent Selection (if agent pickup chosen) */}
        {formData.method === 'agent_pickup' && availableAgents.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-4 block">
              Select Pickup Location
            </Label>
            <RadioGroup
              value={formData.agentLocation}
              onValueChange={handleAgentChange}
              className="space-y-3"
            >
              {availableAgents.map(agent => (
                <div
                  key={agent.id}
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.agentLocation === agent.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  } ${errors.agentLocation ? 'border-red-500' : ''}`}
                  onClick={() => handleAgentChange(agent.id)}
                >
                  <RadioGroupItem 
                    value={agent.id} 
                    id={agent.id} 
                    onBlur={() => handleBlur('agentLocation')}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={agent.id} className="font-medium cursor-pointer">
                      {agent.name}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {agent.address}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            {errors.agentLocation && (
              <p className="text-red-500 text-xs mt-2">{errors.agentLocation}</p>
            )}
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

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid}
            className="bg-blue-500 hover:bg-blue-700"
          >
            Continue to Address
          </Button>
        </div>
      </form>
    </div>
  );
}