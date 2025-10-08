import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";

/* ---------------------------
   Better Auth Tables (NO CHANGE)
---------------------------- */

// User table - keep as TEXT for Better Auth
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  role: text("role").default("buyer"),
});

// Session table - keep as TEXT
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// Account table - keep as TEXT
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

// Verification table - keep as TEXT
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ---------------------------
   Custom E-commerce Tables
---------------------------- */

// Stock Status Definitions
export const STOCK_STATUS = {
  ARCHIVED: "Archived",
  OUT_OF_STOCK: "Out of Stock",
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  PREORDER: "Preorder",
  DISCONTINUED: "Discontinued",
  BACKORDERED: "Backordered",
  LIMITED_STOCK: "Limited Stock",
  AVAILABLE_SOON: "Available Soon",
  TEMPORARILY_UNAVAILABLE: "Temporarily Unavailable",
  COMING_SOON: "Coming Soon",
  SPECIAL_ORDER: "Special Order",
  IN_TRANSIT: "In Transit",
  ON_HOLD: "On Hold",
  RESERVED: "Reserved",
  FOR_PARTS: "For Parts or Not Working",
} as const;

export type StockStatus = (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];

/* ----------- Products ----------- */
export const product = pgTable("product", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  brand: varchar("brand", { length: 100 }).notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  stockStatus: varchar("stock_status", { length: 50 })
    .default(STOCK_STATUS.IN_STOCK)
    .notNull(),
  originalPrice: decimal("original_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  hasDiscount: boolean("has_discount").default(false).notNull(),
  stock: integer("stock").default(0).notNull(),
  hasWarranty: boolean("has_warranty").default(false).notNull(),
  warrantyPeriod: integer("warranty_period"),
  warrantyDetails: text("warranty_details"),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  metaTitle: varchar("meta_title", { length: 300 }),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  structuredData: text("structured_data"),
  sku: varchar("sku", { length: 100 }).unique(),
  upc: varchar("upc", { length: 50 }),
  // FK to Better Auth user table
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ----------- Product Category ----------- */
export const productCategory = pgTable("product_category", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 300 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ----------- Product Image ----------- */
export const productImage = pgTable("product_image", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  title: text("title"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ----------- Product Review ----------- */
export const productReview = pgTable("product_review", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  userId: text("user_id") // FK remains text to match Better Auth user
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }),
  comment: text("comment"),
  helpful: integer("helpful").default(0),
  verifiedPurchase: boolean("verified_purchase").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ----------- Product Attribute ----------- */
export const productAttribute = pgTable("product_attribute", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ----------- Product SEO Click ----------- */
export const productSeoClick = pgTable("product_seo_click", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  position: integer("position"),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});


/* ----------- Search Queries ----------- */
export const searchQuery = pgTable("search_query", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  resultCount: integer("result_count").notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ----------- Page Views ----------- */
export const pageView = pgTable("page_view", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  referrer: text("referrer"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ----------- Featured Product ----------- */
export const featuredProduct = pgTable("featured_product", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).default("active").notNull(), // 'active' or 'inactive'
  userId: text("user_id") // Admin who added the featured product
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Featured Product Status Definitions
export const FEATURED_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FeaturedStatus =
  (typeof FEATURED_STATUS)[keyof typeof FEATURED_STATUS];

/* ---------- wishlist and wishlist items ------------------ */

export const wishlist = pgTable("wishlist", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).default("My Wishlist").notNull(),
  visibility: varchar("visibility", { length: 20 })
    .default("private")
    .notNull(), // private | public
  shareToken: varchar("share_token", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const wishlistItem = pgTable("wishlist_item", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  wishlistId: uuid("wishlist_id")
    .notNull()
    .references(() => wishlist.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  note: text("note"),
  priceAtAdd: decimal("price_at_add", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

/* ----------- Cart ----------- */
export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  sessionId: text("session_id").unique(),
  expiresAt: timestamp("expires_at").default(sql`NOW() + INTERVAL '30 days'`).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ----------- Cart Items ----------- */
export const cartItem = pgTable("cart_item", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at time of adding
  selectedAttributes: text("selected_attributes"), // JSON string for product variations
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});


/* ----------- Order ----------- */
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