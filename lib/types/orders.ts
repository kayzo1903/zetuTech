// lib/types/order.ts
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: string;
  subtotal: string;
  shippingAmount: string;
  taxAmount: string;
  discountAmount: string;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  agentLocation?: string;
  customerPhone: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: OrderAddress;
  statusHistory?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string;
  attributes?: string;
  product?: {
    name: string;
    images?: string[];
    slug: string;
  };
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  country: string;
  notes: string;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  notes: string;
  createdAt: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}