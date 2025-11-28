# Admin Dashboard Documentation

## Overview

The Admin Dashboard is the central management interface for e-commerce store administrators. It provides real-time insights, quick actions, and comprehensive analytics for store management.

## File Structure

```
app/admin/page.tsx                          # Main dashboard page
├── components/admin/
│   ├── dashboard-stats.tsx                 # Key metrics cards
│   ├── quickactions.tsx                    # Quick action buttons
│   ├── recent-orders.tsx                   # Pending orders widget
│   └── sales-chart.tsx                     # Dynamic sales visualization
└── lib/server/admin-dashboard/
    └── getDashboardStats.ts                # Server-side data fetching
```

## Components Breakdown

### 1. Main Dashboard Page (`/app/admin/page.tsx`)

```tsx
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
```

**Purpose**: Main layout container that orchestrates all dashboard components.

**Features**:
- Responsive grid layout
- Consistent spacing and padding
- Header with quick actions
- Component composition

---

### 2. Dashboard Stats (`/components/admin/dashboard-stats.tsx`)

**Purpose**: Displays key performance indicators (KPIs) in card format.

**Data Displayed**:
- **Total Revenue**: Current month's revenue with growth percentage
- **Orders**: Number of orders with growth trend
- **Products**: Total products count with low stock alerts
- **Customers**: Customer count with new customer acquisition

**Technical Details**:
- **Server Component**: Fetches data directly from database
- **Data Source**: `getDashboardStatsData()` server function
- **Update Frequency**: Real-time (no caching)
- **Error Handling**: Graceful fallback states

**Key Metrics Calculated**:
```typescript
// Revenue growth calculation
revenueGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

// Order growth calculation  
orderGrowth = ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100

// Low stock alert
lowStockCount = products with stock < 10
```

---

### 3. Recent Orders (`/components/admin/recent-orders.tsx`)

**Purpose**: Shows pending orders requiring immediate attention.

**Data Displayed**:
- Last 5 pending orders
- Total count of all pending orders
- Order details (number, customer, amount, items)
- Quick action buttons

**Technical Details**:
- **Server Component**: Uses `getPendingOrders()` server function
- **Data Filtering**: Only shows `status = "pending"` orders
- **Real-time Count**: Separate query for total pending orders
- **Navigation**: Links to detailed orders page

**Order Information**:
- Order number and status
- Customer contact information
- Item count and total amount
- Creation timestamp
- Delivery method and payment status

---

### 4. Sales Chart (`/components/admin/sales-chart.tsx`)

**Purpose**: Interactive revenue visualization with time period selection.

**Features**:
- **Dynamic Time Periods**: 7 days, 30 days, 3 months, 6 months, 1 year
- **Interactive Dropdown**: Real-time chart updates
- **Responsive Design**: Adapts to different screen sizes
- **Currency Formatting**: TZS formatting with proper localization

**Technical Details**:
- **Client Component**: Requires `"use client"` directive
- **API Integration**: Fetches from `/api/admin/dashboard/sales`
- **State Management**: `useState` for period selection
- **Data Fetching**: `useEffect` with dependency on selected period

**Time Period Logic**:
- **7 Days**: Daily data points (Mon, Tue, Wed...)
- **30 Days**: Weekly aggregates (Week 1, Week 2...)
- **3+ Months**: Monthly data (Jan, Feb, Mar...)

---

### 5. Quick Actions (`/components/admin/quickactions.tsx`)

**Purpose**: Provides quick navigation to frequently used admin sections.

**Typical Actions**:
- Add New Product
- View All Orders  
- Manage Customers
- Analytics Reports
- Inventory Management

**Technical Details**:
- Static component (no data fetching)
- Uses Next.js `Link` for client-side navigation
- Responsive button layout

---

## Data Flow Architecture

### Server-Side Data Fetching

```typescript
// Server functions in getDashboardStats.ts
export async function getDashboardStatsData() {
  // Direct database queries using Drizzle ORM
  // Returns: totalRevenue, orderGrowth, productCounts, etc.
}

export async function getPendingOrders(limit = 5) {
  // Fetches pending orders with user joins
  // Returns: orders array + total count
}
```

### API Routes for Dynamic Data

```typescript
// API route for sales chart
/app/api/admin/dashboard/sales/route.ts
// Handles dynamic time period requests
// Returns formatted chart data
```

---

## Performance Considerations

### 1. **Server Components for Static Data**
```tsx
// DashboardStats and RecentOrders use server components
// Benefits: Faster initial load, better SEO, less JavaScript
```

### 2. **Client Components for Interactivity**
```tsx
// SalesChart uses client component
// Reason: Dynamic user interactions (dropdown selection)
```

### 3. **Efficient Data Fetching**
- Parallel data fetching where possible
- Appropriate caching strategies
- Minimal data transfer

---

## Error Handling Strategy

### 1. **Component-Level Error Boundaries**
```tsx
try {
  // Data fetching
} catch (error) {
  // Show graceful fallback UI
  return <ErrorState />;
}
```

### 2. **Loading States**
```tsx
// Individual components handle their own loading states
// Maintains layout stability during data fetching
```

### 3. **Empty States**
```tsx
// Meaningful empty states for zero data
// e.g., "No pending orders - all caught up!"
```

---

## Responsive Design

### Breakpoint Strategy
- **Mobile**: Single column layout
- **Tablet**: 2-column grid for stats
- **Desktop**: Multi-column layouts with optimal spacing

### Component Responsiveness
- **Stats Cards**: 1 → 2 → 4 columns
- **Sales Chart**: Full width on mobile, constrained on desktop
- **Recent Orders**: Adapts to available space

---

## Security Considerations

### 1. **Authentication**
```tsx
// All server functions and API routes check:
const { session, isAdmin } = await getServerSession();
if (!session || !isAdmin) {
  // Return unauthorized response
}
```

### 2. **Data Access Control**
- Role-based access (admin only)
- User-scoped data where applicable
- Secure database queries

---

## Future Enhancements

### 1. **Real-time Updates**
- WebSocket integration for live data
- Push notifications for new orders

### 2. **Advanced Analytics**
- Customer behavior insights
- Product performance metrics
- Sales forecasting

### 3. **Customization**
- Drag-and-drop widget rearrangement
- Custom metric selection
- Saved dashboard views

---

## Usage Examples

### Adding a New Metric Card
1. Update `getDashboardStatsData()` server function
2. Add new card to `DashboardStats` component
3. Ensure proper TypeScript types

### Adding New Time Period
1. Update API route time period logic
2. Add option to dropdown in `SalesChart`
3. Test data aggregation for new period

---

This documentation provides a comprehensive overview of the Admin Dashboard architecture, helping maintain and extend the system effectively.