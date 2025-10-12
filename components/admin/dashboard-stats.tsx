// components/admin/dashboard-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStatsData } from "@/lib/server/admin-dashboard/getDashboardStats";
import { TrendingUp, TrendingDown, Package, Users, DollarSign, ShoppingCart } from "lucide-react";


export async function DashboardStats() {
  const stats = await getDashboardStatsData();

  const statCards = [
    {
      title: "Total Revenue",
      value: `TZS ${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      description: `${stats?.revenueGrowth || 0}% from last month`,
      trend: stats?.revenueGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      description: `${stats?.orderGrowth || 0}% from last month`,
      trend: stats?.orderGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      description: `${stats?.lowStockCount || 0} low in stock`,
      trend: "neutral",
    },
    {
      title: "Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      description: `${stats?.newCustomers || 0} new this month`,
      trend: stats?.newCustomers > 0 ? "up" : "neutral",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {card.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
              {card.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500 mr-1" />}
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}