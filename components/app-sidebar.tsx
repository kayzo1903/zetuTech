import * as React from "react"
import { Laptop, Store , Star, MessageSquare, ShoppingCart, Settings, LogOut, Users, BarChart3 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: BarChart3,
    },
    {
      title: "Products",
      url: "#",
      icon: Laptop,
      items: [
        {
          title: "All Products",
          url: "/admin-dashboard/products",
        },
        {
          title: "Add New Product",
          url: "/admin-dashboard/products/add",
        },
        {
          title: "Categories",
          url: "/admin-dashboard/products/categories",
        },
      ],
    },
    {
      title: "Orders",
      url: "/admin-dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/admin-dashboard/customers",
      icon: Users,
    },
    {
      title: "Reviews",
      url: "/admin-dashboard/reviews",
      icon: Star,
    },
    {
      title: "Complaints",
      url: "/admin-dashboard/complaints",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      url: "/admin-dashboard/settings",
      icon: Settings,
    },
    {
      title: "Exit",
      url: "/",
      icon: LogOut,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-blue-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Store className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">ZetuTech</span>
                  <span className="text-xs">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}