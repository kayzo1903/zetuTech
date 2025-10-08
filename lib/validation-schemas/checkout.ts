// lib/validation-schema/checkout.ts

import { z } from 'zod';

// ✅ CONTACT SCHEMA
export const contactSchema = z.object({
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+255[0-9]{9}$/, "Phone must be in format +255 XXX XXX XXX"),
  email: z.string()
    .email("Invalid email address")
    .optional()
    .or(z.literal('')),
  region: z.string()
    .min(1, "Please select your region")
});

export type ContactData = z.infer<typeof contactSchema>;

// ✅ DELIVERY SCHEMA
export const deliverySchema = z.object({
  method: z.enum(['direct_delivery', 'agent_pickup']),
  agentLocation: z.string().optional()
}).refine((data) => {
  if (data.method === 'agent_pickup') {
    return data.agentLocation && data.agentLocation.length > 0;
  }
  return true;
}, {
  message: "Please select a pickup location",
  path: ["agentLocation"]
});

export type DeliveryData = z.infer<typeof deliverySchema>;

// ✅ ADDRESS SCHEMA
export const addressSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name too long"),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address too long")
    .optional()
    .or(z.literal('')),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City name too long")
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(500, "Notes too long")
    .optional()
    .or(z.literal(''))
});

export type AddressData = z.infer<typeof addressSchema>;

// ✅ PAYMENT SCHEMA
export const paymentSchema = z.object({
  method: z.enum(['cash_delivery', 'mpesa', 'card', 'bank_transfer'])
});

export type PaymentData = z.infer<typeof paymentSchema>;

// ✅ MAIN CHECKOUT SCHEMA
export const checkoutSchema = z.object({
  contact: contactSchema,
  delivery: deliverySchema,
  address: addressSchema,
  payment: paymentSchema
}).refine((data) => {
  // Conditional validation: address and city required for direct delivery
  if (data.delivery.method === 'direct_delivery') {
    return (
      data.address.address &&
      data.address.address.length >= 5 &&
      data.address.city &&
      data.address.city.length >= 2
    );
  }
  return true;
}, {
  message: "Address and city are required for direct delivery",
  path: ["address"]
});

export type CheckoutData = z.infer<typeof checkoutSchema>;

// ✅ ORDER CREATION SCHEMA
export const orderCreateSchema = checkoutSchema.safeExtend({
  cartItems: z.array(z.object({
    productId: z.string().uuid(),
    productName: z.string().min(1),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive(),
    attributes: z.any().optional()
  })).min(1, "Cart must contain at least one item"),
  pricing: z.object({
    subtotal: z.number().positive(),
    discount: z.number().min(0),
    shipping: z.number().min(0),
    tax: z.number().min(0),
    total: z.number().positive()
  })
  
});

export type OrderCreateData = z.infer<typeof orderCreateSchema>;

// ✅ STEP VALIDATION FUNCTION
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateCheckoutStep = (step: string, data: any) => {
  switch (step) {
    case 'contact':
      return contactSchema.safeParse(data);
    case 'delivery':
      return deliverySchema.safeParse(data);
    case 'address':
      return addressSchema.safeParse(data);
    case 'payment':
      return paymentSchema.safeParse(data);
    case 'complete':
      return checkoutSchema.safeParse(data);
    default:
      return { success: false, error: new Error('Invalid step') };
  }
};

// ✅ GET STEP VALIDATION SCHEMA
export const getStepValidation = (step: string) => {
  switch (step) {
    case 'contact': return contactSchema;
    case 'delivery': return deliverySchema;
    case 'address': return addressSchema;
    case 'payment': return paymentSchema;
    default: return z.any();
  }
};
