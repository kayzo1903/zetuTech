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

interface DeliveryStepProps {
  data: {
    method: string;
    agentLocation: string;
  };
  contactData: {
    region: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const DAR_ES_SALAAM_AGENTS = [
  { id: 'posta', name: 'Central Posta', address: 'Posta Mpya, Dar es Salaam' },
  { id: 'kariakoo', name: 'Kariakoo Market', address: 'Kariakoo, Dar es Salaam' },
  { id: 'mbezi', name: 'Mbezi Luis', address: 'Mbezi Luis, Dar es Salaam' }
];

const OTHER_REGION_AGENTS: Record<string, Array<{id: string, name: string, address: string}>> = {
  'Arusha': [
    { id: 'arusha_central', name: 'Arusha Central', address: 'Soko Kuu, Arusha' }
  ],
  'Mwanza': [
    { id: 'mwanza_central', name: 'Mwanza Central', address: 'City Center, Mwanza' }
  ],
  // Add more regions as needed
};

export default function DeliveryStep({ data, contactData, onUpdate, onNext, onBack }: DeliveryStepProps) {
  const [formData, setFormData] = useState(data);
  const isDarEsSalaam = contactData.region === 'Dar es Salaam';

// components/checkout/steps/delivery-step.tsx - Update delivery options
const deliveryOptions = isDarEsSalaam 
  ? [
      {
        id: 'direct_delivery',
        name: 'Direct Delivery',
        description: 'We deliver directly to your address',
        price: 0, // ✅ FREE in Dar es Salaam
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
        price: 15000, // ✅ 15,000 TZS outside Dar es Salaam
        available: true
      }
    ];

    
  const availableAgents = isDarEsSalaam 
    ? DAR_ES_SALAAM_AGENTS 
    : OTHER_REGION_AGENTS[contactData.region] || [];

  const handleMethodChange = (method: string) => {
    const newData = { ...formData, method, agentLocation: '' };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleAgentChange = (agentLocation: string) => {
    const newData = { ...formData, agentLocation };
    setFormData(newData);
    onUpdate(newData);
  };

  const isFormValid = formData.method && 
    (formData.method !== 'agent_pickup' || formData.agentLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

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
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
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
                  }`}
                >
                  <RadioGroupItem value={agent.id} id={agent.id} />
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue to Address
          </Button>
        </div>
      </form>
    </div>
  );
}