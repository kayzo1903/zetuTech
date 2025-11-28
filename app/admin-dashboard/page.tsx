import { DashboardStats } from "@/components/admin/dashboard-stats";
import { QuickActions } from "@/components/admin/quickactions";
import { RecentOrders } from "@/components/admin/recent-orders";
import { SalesChart } from "@/components/admin/sales-chart";
import React from "react";

export default function Dashboardpage() {
  return (
    <main className="space-y-6 p-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Welcome back! Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
          
          <QuickActions />
        </div>
      <DashboardStats />
      <RecentOrders />
      <SalesChart />
    </main>
  );
}
