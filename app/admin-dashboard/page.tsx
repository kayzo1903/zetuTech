import { DashboardStats } from "@/components/admin/dashboard-stats";
import { QuickActions } from "@/components/admin/quickactions";
import { RecentOrders } from "@/components/admin/recent-orders";
import { SalesChart } from "@/components/admin/sales-chart";
import React from "react";

export default function Dashboardpage() {
  return (
    <main className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <QuickActions />
      </div>
      <DashboardStats />
      <RecentOrders />
      <SalesChart />
    </main>
  );
}
