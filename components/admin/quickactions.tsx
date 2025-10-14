// components/admin/quick-actions.tsx
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, BarChart3, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QuickActions() {
  const actions = [
    {
      label: "Add Product",
      icon: Plus,
      href: "/admin-dashboard/products/add",
      variant: "default" as const,
      priority: "high", // Always visible on desktop, in dropdown on mobile
    },
    {
      label: "View Products",
      icon: Package,
      href: "/admin-dashboard/products",
      variant: "outline" as const,
      priority: "medium", // Visible on tablet+, in dropdown on mobile
    },
    {
      label: "Customers",
      icon: Users,
      href: "/admin-dashboard/customers",
      variant: "outline" as const,
      priority: "medium",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin-dashboard/analytics",
      variant: "outline" as const,
      priority: "low", // Always in dropdown on mobile
    },
  ];

  // For mobile: Primary action + dropdown for others
  const primaryAction = actions.find(action => action.priority === "high");
  const dropdownActions = actions.filter(action => action.priority !== "high");

  return (
    <div className="flex items-center gap-2">
      {/* Desktop/Tablet View - All buttons visible */}
      <div className="hidden md:flex items-center gap-2">
        {actions.map((action) => (
          <Button key={action.label} variant={action.variant} size="sm" asChild>
            <Link href={action.href} className="flex items-center gap-2">
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Mobile View - Primary button + dropdown */}
      <div className="flex md:hidden items-center gap-2">
        {/* Primary Action (Add Product) */}
        {primaryAction && (
          <Button variant={primaryAction.variant} size="sm" asChild>
            <Link href={primaryAction.href} className="flex items-center gap-2">
              <primaryAction.icon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:inline">
                {primaryAction.label}
              </span>
            </Link>
          </Button>
        )}

        {/* Dropdown for other actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {dropdownActions.map((action) => (
              <DropdownMenuItem key={action.label} asChild>
                <Link href={action.href} className="flex items-center gap-2 cursor-pointer">
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tablet-only view (medium priority actions visible) */}
      <div className="hidden sm:flex md:hidden items-center gap-2">
        {actions
          .filter(action => action.priority === "medium")
          .map((action) => (
            <Button key={action.label} variant={action.variant} size="sm" asChild>
              <Link href={action.href} className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">
                  {action.label.split(' ')[0]} {/* Just first word on small screens */}
                </span>
              </Link>
            </Button>
          ))}
      </div>
    </div>
  );
}