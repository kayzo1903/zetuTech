import { decimal, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { sql } from "drizzle-orm";
import { product } from "./product";

export const order = pgTable("order", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  // Make userId optional for guest orders
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  // Add guest session tracking
  guestSessionId: text("guest_session_id"),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  
  // Enhanced pricing fields
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Delivery & Payment info
  deliveryMethod: varchar("delivery_method", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default('pending').notNull(),
  
  // Agent information
  agentLocation: varchar("agent_location", { length: 100 }),
  agentInstructions: text("agent_instructions"),
  
  // Customer contact
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),

  //receipt-sytem
  verificationCode: text("verification_code").unique(),
  pdfFile: text("pdf_file"), // store the generated PDF here (BLOB)
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ----------- Order Items ----------- */
export const orderItem = pgTable("order_item", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  attributes: text("attributes"), // JSON string for product variations
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ----------- Order Addresses ----------- */
export const orderAddress = pgTable("order_address", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // 'shipping' | 'billing'
  fullName: varchar("full_name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  city: varchar("city", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).default('Tanzania').notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ----------- Order Status History ----------- */
export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});