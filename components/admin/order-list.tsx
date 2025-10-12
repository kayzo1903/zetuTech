"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHeader, TableHead, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Eye, Trash2, Loader2 } from "lucide-react";

// Types
interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  customerPhone: string;
  customerEmail?: string;
  createdAt: string;
  paymentStatus: string;
  itemsCount: number;
  userId?: string;
  userName?: string;
}

interface OrdersResponse {
  success: boolean;
  orders: AdminOrder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ServerSession {
  isAdmin: boolean;
  user: { id: string; name: string; email: string; role: string } | null;
}

interface AdminOrdersListProps {
  serverSession?: ServerSession;
}

// Status styles
const ORDER_STATUS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-orange-100 text-orange-800 border-orange-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

const PAYMENT_STATUS = {
  pending: "bg-yellow-100 text-yellow-800",
  unpaid: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
} as const;

export default function AdminOrdersList({ serverSession }: AdminOrdersListProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 0 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🕒 Debounce Search (prevents spam requests)
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // 🧠 Fetch Orders (stable callback to avoid infinite re-renders)
  const fetchOrders = useCallback(async () => {
    if (!serverSession?.isAdmin) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/orders?${params}`);
      const data: OrdersResponse = await res.json();

      if (data.success) {
        setOrders(data.orders);
        if (data.pagination) setPagination(data.pagination);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [serverSession?.isAdmin, pagination.page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 🗑 Delete order
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Order deleted");
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err)
      toast.error("Delete failed");
      
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const formatPrice = (amt: string) => `TZS ${parseFloat(amt).toLocaleString()}`;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-TZ", { year: "numeric", month: "short", day: "numeric" });

  const getCustomerName = (order: AdminOrder) =>
    order.userName || order.customerEmail?.split("@")[0] || "Guest";

  // 🧭 Pagination handler
  const handlePageChange = (newPage: number) => {
    if (newPage !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // 🚫 Access control
  if (!serverSession) return <div className="p-6">Loading...</div>;
  if (!serverSession.isAdmin)
    return (
      <div className="p-6 text-center space-y-3">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-600">Admin privileges required</p>
        <Button onClick={() => router.push("/dashboard")}>Go Back</Button>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Orders Management</h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.keys(ORDER_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Loading orders...</p>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50/10 transition">
                  <TableCell className="font-mono">
                    {order.orderNumber}
                    {!order.userId && <Badge className="ml-2">Guest</Badge>}
                  </TableCell>
                  <TableCell>{getCustomerName(order)}</TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell>{order.itemsCount}</TableCell>
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge className={ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={PAYMENT_STATUS[order.paymentStatus as keyof typeof PAYMENT_STATUS]}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin-dashboard/orders/${order.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setOrderToDelete(order.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }).map((_, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={pagination.page === idx + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The order and its records will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => orderToDelete && handleDelete(orderToDelete)}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
