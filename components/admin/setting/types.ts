// app/admin/types.ts
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  businessHours: {
    weekdays: string;
    weekends: string;
  };
  whatsappNumber: string;
  whatsappMessage: string;
  mapEmbedUrl: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SupportInfo {
  supportEmail: string;
  supportPhone: string;
  liveChatHours: string;
  warrantyPeriod: string;
  shippingInfo: string;
  returnPolicy: string;
  faq: FAQItem[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  currency: string;
  maintenanceMode: boolean;
}

// Add these type definitions for setter functions
export type SetContactInfo = (info: ContactInfo | ((prev: ContactInfo) => ContactInfo)) => void;
export type SetSupportInfo = (info: SupportInfo | ((prev: SupportInfo) => SupportInfo)) => void;
export type SetSiteSettings = (settings: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => void;