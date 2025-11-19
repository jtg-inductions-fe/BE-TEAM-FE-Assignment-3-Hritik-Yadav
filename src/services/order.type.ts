export type OrderStatus = "pending" | "accepted" | "rejected" | "delivered" | "all";

interface RestaurantInfo {
  id: string;
}

interface UserInfo {
  id: string;
  name: string;
}

export interface Items {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface totalAmountInfo {
  currency: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  name: string;
  orderStatus: OrderStatus;
  restaurant: RestaurantInfo;
  user: UserInfo;
  orderItems: Items[];
  totalAmount: totalAmountInfo;
  createdAt: string;
}

export interface OrderPayload {
  status: OrderStatus;
  restaurant: RestaurantInfo;
  user: UserInfo;
  orderItems: Items[];
  totalAmount: totalAmountInfo;
}

export interface OrderFormValues {
  OrderItems: Items[];
  totalAmount: totalAmountInfo;
}

export interface ListOrdersResponseData {
  items: Order[];
  nextPageToken?: string | null;
}

export interface ListOrderParams {
  status?: OrderStatus;
  perPage?: number;
  nextPageToken?: string | null;
}
