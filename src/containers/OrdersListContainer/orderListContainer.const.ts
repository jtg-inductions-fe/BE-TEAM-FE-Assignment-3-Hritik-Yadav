import { OrderStatus } from "@/services/order.type";

export enum ORDER_STATUS {
  all = "all",
  accepted = "accepted",
  delivered = "delivered",
  pending = "pending",
  rejected = "rejected",
}

export const FILTERS: { key: OrderStatus; label: string }[] = [
  { key: ORDER_STATUS.all, label: "All" },
  { key: ORDER_STATUS.pending, label: "Pending" },
  { key: ORDER_STATUS.accepted, label: "Accepted" },
  { key: ORDER_STATUS.rejected, label: "Cancelled" },
  { key: ORDER_STATUS.delivered, label: "Delivered" },
];

export const ORDERS_PAGE_SIZE = 10;
