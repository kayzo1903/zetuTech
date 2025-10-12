// types/database.ts
import { order, orderItem, orderAddress, product } from '@/db/schema';

export type OrderWithRelations = typeof order.$inferSelect & {
  orderItems: (typeof orderItem.$inferSelect & {
    product: typeof product.$inferSelect;
  })[];
  orderAddresses: typeof orderAddress.$inferSelect[];
};

export type OrderData = typeof order.$inferSelect;
export type OrderItemData = typeof orderItem.$inferSelect;
export type OrderAddressData = typeof orderAddress.$inferSelect;