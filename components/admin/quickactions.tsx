// components/admin/quick-actions.tsx
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      label: "Add Product",
      icon: Plus,
      href: "/admin-dashboard/products/add",
      variant: "default" as const,
    },
    {
      label: "View Products",
      icon: Package,
      href: "/admin-dashboard/products",
      variant: "outline" as const,
    },
    {
      label: "Customers",
      icon: Users,
      href: "/admin-dashboard/customers",
      variant: "outline" as const,
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin-dashboard/analytics",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {actions.map((action) => (
        <Button key={action.label} variant={action.variant} size="sm" asChild>
          <Link href={action.href} className="flex items-center gap-2">
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}