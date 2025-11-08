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

export const FEATURED_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FeaturedStatus =
  (typeof FEATURED_STATUS)[keyof typeof FEATURED_STATUS];