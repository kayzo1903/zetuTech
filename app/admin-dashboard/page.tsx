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
              Welcome back! Here's what's happening with Tzdraft today.
            </p>
          </div>
        </div>
      
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 border rounded-lg border-dashed">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Tzdraft Operations Dashboard</h2>
        <p>Use the sidebar to manage messages, settings, and business information.</p>
      </div>
    </main>
  );
}
