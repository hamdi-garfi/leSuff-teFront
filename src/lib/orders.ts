import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

export type AccountOrder = {
  id: number;
  number: string;
  status: string;
  fulfillmentStatus: string;
  deliveryMode: string;
  paymentMethod: string | null;
  total: number;
  discountAmount: number | null;
  itemCount: number;
  shippingCity: string | null;
  shippingCountry: string | null;
  createdAt: string;
  items: { productName: string; productSlug: string; imageUrl: string | null; size: string; color: string; quantity: number; unitPrice: number }[];
};

export async function getMyOrders(): Promise<AccountOrder[]> {
  const token = getTokenFromCookies();
  if (!token) {
    return [];
  }

  try {
    return await backendFetch<AccountOrder[]>('/api/account/orders', { token, cache: 'no-store' });
  } catch (e) {
    if (e instanceof BackendError && e.status === 401) {
      return [];
    }
    throw e;
  }
}

export type AccountOrderItem = {
  id: number;
  variantId: number;
  sku: string;
  productSlug: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  refundedQuantity: number;
  unitPrice: number;
};

export type AccountReturnRequest = {
  id: number;
  number: string;
  status: string;
  reason: string;
  refundAmount: number | null;
  orderId: number;
  orderNumber: string;
  items: { orderItemId: number; product: string; size: string; color: string; quantity: number }[];
  createdAt: string;
};

export type AccountOrderDetail = {
  id: number;
  number: string;
  invoiceNumber: string | null;
  invoiceIssuedAt: string | null;
  status: string;
  fulfillmentStatus: string;
  deliveryMode: string;
  total: number;
  totalExcludingVat: number;
  totalVatAmount: number;
  discountAmount: number | null;
  shippingCost: number | null;
  paymentMethod: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  carrier: string | null;
  giftWrap: boolean;
  giftMessage: string | null;
  shippingAddress: { street: string; city: string; postalCode: string; country: string; complement: string | null } | null;
  billingAddress: { street: string; city: string; postalCode: string; country: string; complement: string | null } | null;
  createdAt: string;
  items: AccountOrderItem[];
  returns: AccountReturnRequest[];
};

export async function getOrderDetail(id: number): Promise<AccountOrderDetail | null> {
  const token = getTokenFromCookies();
  if (!token) {
    return null;
  }

  try {
    return await backendFetch<AccountOrderDetail>(`/api/account/orders/${id}`, { token, cache: 'no-store' });
  } catch (e) {
    if (e instanceof BackendError && (e.status === 401 || e.status === 404)) {
      return null;
    }
    throw e;
  }
}
