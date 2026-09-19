import type { placeOrderSchema } from "@/validations/order.validation";
import {
  cancelOrderSchema,
  type orderFilterFormSchema,
  type orderFormSchema,
} from "@/validations/order.validation";
import type z from "zod";
import type { BrandType } from "./brand.type";
import type { PaymentMethod, PaymentStatus } from "./payment.type";
import type { RefundStatus } from "./refund.type";

export type OrderStatus =
  | "PENDING"
  | "REJECTED"
  | "ACCEPTED"
  | "SHIPPED"
  | "DELIVERED"
  | "DONE"
  | "CANCELLED";
export type OrderPaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";
export type OrderSource = "CUSTOMER" | "ADMIN";

export type PaymentType = {
  id: number;
  orderId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  reference: string | null;
  note: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export interface RefundType {
  id: number;
  orderId: number;
  amount: number;
  status: RefundStatus;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrderType {
  id: number;
  code: string;
  image: string | null;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  createdAt: string | Date;
  totalPrice: number;
  customerAddress: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerNotes: string | null;
  cancelledReason: string | null;
  rejectedReason: string | null;
  totalPaidAmount: number;
  totalRefundAmount: number;
  orderItems: {
    quantity: number;
    price: number | string;
    size: number;
    image: string | null;
    product: {
      id: number;
      name: string;
      slug: string;
      brand: string;
    };
  }[];
}

export interface AdminOrderType {
  id: number;
  code: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  customerNotes: string | null;
  rejectedReason: string | null;
  cancelledReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: number;
  source: OrderSource;
  image?: string;
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
    phone: string | null;
    email: string;
  };
}

export interface OrderItem {
  id: number;
  orderId: number;
  productVariantId: number;
  quantity: number;
  price: string | number;
  createdAt: string;
  productVariant?: {
    id: number;
    slug: string;
    sku: string;
    size: number;
    price: number;
    discount: number;
    stock: number;
    reserved: number;
    totalCost: number;
    productId: number;
    isPrimary: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    product: {
      id: number;
      name: string;
      slug: string;
      brand: BrandType;
    };
  };
}

export interface OrderDetailType extends AdminOrderType {
  orderItems: OrderItem[];
  payments: PaymentType[];
  refunds: RefundType[];
  totalPaidAmount: number;
  totalRefundAmount: number;
}

export interface OrderListResult<T = AdminOrderType> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface OrderQueryParams {
  limit?: number;
  offset?: number;
  cursor?: number | null;
  search?: string;
  status?: string;
  paymentStatus?: string;
  source?: string;
  condition?: string;
}

export type OrderFilterFormValues = z.infer<typeof orderFilterFormSchema>;

export interface OrderItemCreateInput {
  itemId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderParams {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  status: OrderStatus;
  items: OrderItemCreateInput[];
  rejectedReason?: string;
  cancelledReason?: string;
}

export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type CancelOrderValues = z.infer<typeof cancelOrderSchema>;
export type PlaceOrderFormValues = z.infer<typeof placeOrderSchema>;
