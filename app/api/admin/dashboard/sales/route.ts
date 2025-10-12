// app/api/admin/dashboard/sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbServer } from "@/db/db-server";
import { order } from "@/db/schema";
import { and, gte, lt, sum } from "drizzle-orm";
import { getServerSession } from "@/lib/server-session";

export async function GET(request: NextRequest) {
  try {
    const { session, isAdmin } = await getServerSession();

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    const now = new Date();
    //let startDate: Date;
    const dataPoints: { name: string; revenue: number }[] = [];

    switch (period) {
      case "7d":
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const dayStart = new Date();
          dayStart.setDate(dayStart.getDate() - i);
          dayStart.setHours(0, 0, 0, 0);

          const dayEnd = new Date();
          dayEnd.setDate(dayEnd.getDate() - i);
          dayEnd.setHours(23, 59, 59, 999);

          const [result] = await dbServer
            .select({ total: sum(order.totalAmount) })
            .from(order)
            .where(and(gte(order.createdAt, dayStart), lt(order.createdAt, dayEnd)));

          dataPoints.push({
            name: dayStart.toLocaleDateString("en-US", { weekday: 'short' }),
            revenue: parseFloat(result?.total || "0"),
          });
        }
        break;

      case "30d":
        // Last 30 days (grouped by week)
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
          weekStart.setHours(0, 0, 0, 0);

          const weekEnd = new Date();
          weekEnd.setDate(weekEnd.getDate() - i * 7);
          weekEnd.setHours(23, 59, 59, 999);

          const [result] = await dbServer
            .select({ total: sum(order.totalAmount) })
            .from(order)
            .where(and(gte(order.createdAt, weekStart), lt(order.createdAt, weekEnd)));

          dataPoints.push({
            name: `Week ${4 - i}`,
            revenue: parseFloat(result?.total || "0"),
          });
        }
        break;

      case "3m":
        // Last 3 months
        for (let i = 2; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

          const [result] = await dbServer
            .select({ total: sum(order.totalAmount) })
            .from(order)
            .where(and(gte(order.createdAt, monthStart), lt(order.createdAt, monthEnd)));

          dataPoints.push({
            name: monthStart.toLocaleString("default", { month: "short" }),
            revenue: parseFloat(result?.total || "0"),
          });
        }
        break;

      case "6m":
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

          const [result] = await dbServer
            .select({ total: sum(order.totalAmount) })
            .from(order)
            .where(and(gte(order.createdAt, monthStart), lt(order.createdAt, monthEnd)));

          dataPoints.push({
            name: monthStart.toLocaleString("default", { month: "short" }),
            revenue: parseFloat(result?.total || "0"),
          });
        }
        break;

      case "1y":
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

          const [result] = await dbServer
            .select({ total: sum(order.totalAmount) })
            .from(order)
            .where(and(gte(order.createdAt, monthStart), lt(order.createdAt, monthEnd)));

          dataPoints.push({
            name: monthStart.toLocaleString("default", { month: "short" }),
            revenue: parseFloat(result?.total || "0"),
          });
        }
        break;

      default:
        // Default to 7 days
        for (let i = 6; i >= 0; i--) {
          const dayStart = new Date();
          dayStart.setDate(dayStart.getDate() - i);
          dayStart.setHours(0, 0, 0, 0);

          const dayEnd = new Date();
          dayEnd.setDate(dayEnd.getDate() - i);
          dayEnd.setHours(23, 59, 59, 999);

          const [result] = await dbServer
            .select({ total: sum(order.totalAmount) })
            .from(order)
            .where(and(gte(order.createdAt, dayStart), lt(order.createdAt, dayEnd)));

          dataPoints.push({
            name: dayStart.toLocaleDateString("en-US", { weekday: 'short' }),
            revenue: parseFloat(result?.total || "0"),
          });
        }
    }

    return NextResponse.json({
      success: true,
      data: dataPoints,
    });
  } catch (error) {
    console.error("Sales data fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}