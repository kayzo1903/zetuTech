import { pgTable, text, boolean, jsonb, uuid } from "drizzle-orm/pg-core";

export const businessInfo = pgTable("business_info", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Contact Info
  address: text("address").notNull().default(''),
  phone: text("phone").notNull().default(''),
  email: text("email").notNull().default(''),
  businessHours: jsonb("business_hours").$type<{
    weekdays: string;
    weekends: string;
  }>().notNull().default({ weekdays: '', weekends: '' }),
  whatsappNumber: text("whatsapp_number").notNull().default(''),
  whatsappMessage: text("whatsapp_message").notNull().default(''),
  mapEmbedUrl: text("map_embed_url").notNull().default(''),

  // Support Info
  supportEmail: text("support_email").notNull().default(''),
  supportPhone: text("support_phone").notNull().default(''),
  liveChatHours: text("live_chat_hours").notNull().default(''),
  warrantyPeriod: text("warranty_period").notNull().default(''),
  shippingInfo: text("shipping_info").notNull().default(''),
  returnPolicy: text("return_policy").notNull().default(''),
  faq: jsonb("faq").$type<
    { 
      id: string; 
      question: { en: string; sw: string };
      answer: { en: string; sw: string };
    }[]
  >().notNull().default([]),

  // Site Settings
  siteName: text("site_name").notNull().default(''),
  siteDescription: text("site_description").notNull().default(''),
  currency: text("currency").notNull().default('TZS'),
  maintenanceMode: boolean("maintenance_mode").default(false),
});