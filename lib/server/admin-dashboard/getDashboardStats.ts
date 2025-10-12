// lib/server/admin-dashboard/getDashboardStats.ts
import { dbServer } from "@/db/db-server";
import { order, orderItem, product,  user } from "@/db/schema";
import { sql, and, gte, lt, count, sum, desc, eq} from "drizzle-orm";

export async function getDashboardStatsData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalRevenueResult] = await dbServer
    .select({ total: sum(order.totalAmount) })
    .from(order)
    .where(and(gte(order.createdAt, startOfMonth)));

  const [lastMonthRevenueResult] = await dbServer
    .select({ total: sum(order.totalAmount) })
    .from(order)
    .where(and(gte(order.createdAt, startOfLastMonth), lt(order.createdAt, startOfMonth)));

  const [totalOrdersResult] = await dbServer
    .select({ count: count() })
    .from(order)
    .where(gte(order.createdAt, startOfMonth));

  const [lastMonthOrdersResult] = await dbServer
    .select({ count: count() })
    .from(order)
    .where(and(gte(order.createdAt, startOfLastMonth), lt(order.createdAt, startOfMonth)));

  const [totalProductsResult] = await dbServer.select({ count: count() }).from(product);
  const [lowStockResult] = await dbServer
    .select({ count: count() })
    .from(product)
    .where(sql`${product.stock} < 10`);

  const [totalCustomersResult] = await dbServer
    .select({ count: count() })
    .from(user)
    .where(sql`${user.role} = 'buyer'`);

  const [newCustomersResult] = await dbServer
    .select({ count: count() })
    .from(user)
    .where(and(sql`${user.role} = 'buyer'`, gte(user.createdAt, startOfMonth)));

  const totalRevenue = parseFloat(totalRevenueResult?.total || "0");
  const lastMonthRevenue = parseFloat(lastMonthRevenueResult?.total || "0");
  const revenueGrowth =
    lastMonthRevenue > 0
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : totalRevenue > 0
      ? 100
      : 0;

  const totalOrders = totalOrdersResult?.count || 0;
  const lastMonthOrders = lastMonthOrdersResult?.count || 0;
  const orderGrowth =
    lastMonthOrders > 0
      ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
      : totalOrders > 0
      ? 100
      : 0;

  return {
    totalRevenue,
    revenueGrowth: Math.round(revenueGrowth),
    totalOrders,
    orderGrowth: Math.round(orderGrowth),
    totalProducts: totalProductsResult?.count || 0,
    lowStockCount: lowStockResult?.count || 0,
    totalCustomers: totalCustomersResult?.count || 0,
    newCustomers: newCustomersResult?.count || 0,
  };
}


export async function getPendingOrders(limit = 5) {
  try {
    // First, get the last 5 pending orders
    const orders = await dbServer
      .select({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        userId: order.userId,
        userName: user.name,
        userEmail: user.email,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        paymentStatus: order.paymentStatus,
        deliveryMethod: order.deliveryMethod,
        agentLocation: order.agentLocation,
           paymentMethod: order.paymentMethod, 
        itemsCount: sql<number>`(
          SELECT COUNT(*) FROM ${orderItem} WHERE ${orderItem.orderId} = ${order.id}
        )`.as("items_count"),
      })
      .from(order)
      .leftJoin(user, eq(order.userId, user.id))
      .where(eq(order.status, "pending"))
      .orderBy(desc(order.createdAt))
      .limit(limit);

    // Then, get the total count of ALL pending orders
    const [totalCountResult] = await dbServer
      .select({ count: count() })
      .from(order)
      .where(eq(order.status, "pending"));

    const totalPendingOrders = totalCountResult?.count || 0;

    return { 
      orders, 
      pagination: { 
        total: totalPendingOrders,
        page: 1,
        limit: limit,
        totalPages: Math.ceil(totalPendingOrders / limit)
      } 
    };
  } catch (error) {
    console.error("Failed to fetch pending orders:", error);
    return { 
      orders: [], 
      pagination: { 
        total: 0,
        page: 1,
        limit: limit,
        totalPages: 0
      } 
    };
  }
}
