// lib/validations/business-info.ts
import { z } from 'zod';

export const BusinessHoursSchema = z.object({
  weekdays: z.string().min(1, 'Weekday hours are required'),
  weekends: z.string().min(1, 'Weekend hours are required'),
});

export const ContactInfoSchema = z.object({
  address: z.string().trim().min(3, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.email('Invalid email address'),
  businessHours: BusinessHoursSchema,
  whatsappNumber: z.string().min(1, 'WhatsApp number is required'),
  whatsappMessage: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number format').min(1, 'WhatsApp message is required'),
  mapEmbedUrl: z.string().url('Invalid URL format').min(1, 'Map URL is required'),
});

export const FAQItemSchema = z.object({
  id: z.string(),
  question: z.string().min(3, 'Question is required'),
  answer: z.string().min(3, 'Answer is required'),
});

export const SupportInfoSchema = z.object({
  supportEmail: z.email('Invalid support email'),
  supportPhone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number format').min(1, 'Support phone is required'),
  liveChatHours: z.string().min(1, 'Live chat hours are required'),
  warrantyPeriod: z.string().min(1, 'Warranty period is required'),
  shippingInfo: z.string().min(1, 'Shipping info is required'),
  returnPolicy: z.string().min(1, 'Return policy is required'),
  faq: z.array(FAQItemSchema),
});

export const SiteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  currency: z.string().min(1, 'Currency is required'),
  maintenanceMode: z.boolean(),
});

// Infer TypeScript types from Zod schemas
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type SupportInfo = z.infer<typeof SupportInfoSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type FAQItem = z.infer<typeof FAQItemSchema>;
export type BusinessHours = z.infer<typeof BusinessHoursSchema>;