// types/checkout.ts
export interface ContactData {
  phone: string;
  email: string;
  region: string;
}

export interface DeliveryData {
  method: string;
  agentLocation: string;
}

export interface AddressData {
  fullName: string;
  address: string;
  city: string;
  notes: string;
}

export interface PaymentData {
  method: string;
}

export interface CheckoutData {
  contact: ContactData;
  delivery: DeliveryData;
  address: AddressData;
  payment: PaymentData;
}

export interface ReviewStepProps {
  checkoutData: CheckoutData;
  onConfirm: () => Promise<void> | void;
  onBack: () => void;
}

// Add to types/checkout.ts
export interface ContactStepProps {
  data: ContactData;
  onUpdate: (data: ContactData) => void;
  onNext: () => void;
}

export interface DeliveryStepProps {
  data: DeliveryData;
  contactData: ContactData;
  onUpdate: (data: DeliveryData) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface AddressStepProps {
  data: AddressData;
  deliveryData: DeliveryData;
  onUpdate: (data: AddressData) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface PaymentStepProps {
  data: PaymentData;
  onUpdate: (data: PaymentData) => void;
  onNext: () => void;
  onBack: () => void;
}