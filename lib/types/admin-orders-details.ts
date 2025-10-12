// Types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string;
  attributes?: string;
  product: {
    name: string;
    slug: string;
    brand: string;
    image?: { url: string; alt: string } | null;
  };
}

export interface OrderAddress {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  region: string;
  country: string;
  notes?: string;
}

export interface StatusHistory {
  id: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
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
  userId?: string;
  guestSessionId?: string;
  userName?: string;
  items: OrderItem[];
  address?: OrderAddress;
  statusHistory: StatusHistory[];
}

export interface OrderResponse {
  success: boolean;
  order: OrderDetail;
}