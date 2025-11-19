import { ORDER_STATUS } from "@/containers/OrdersListContainer/orderListContainer.const";

import type { Order, OrderStatus } from "@services/order.type";

export interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  status: string;
  setStatus: (status: OrderStatus) => void;
  filters: { key: OrderStatus; label: string }[];
  getStatusMenuItems?: (orderId: string) => {
    items: {
      key: ORDER_STATUS;
      label: string;
      onClick: () => void;
    }[];
  };
}
