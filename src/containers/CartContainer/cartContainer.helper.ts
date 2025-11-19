import type { CartItem } from "@/store/reducers/cart.type";
import type { OrderPayload } from "@/services/order.type";
import { ORDER_STATUS } from "../OrdersListContainer/orderListContainer.const";

export const mapCartToOrderPayload = (
  items: CartItem[],
  totals: { currency: string; amount: number },
  restaurantId: string | null,
  userId: string,
  userName: string | null,
): OrderPayload => {
  return {
    status: ORDER_STATUS.pending,
    restaurant: { id: restaurantId, name: "" },
    user: { id: userId, name: userName ?? "" },
    orderItems: items.map((item) => ({
      id: item.itemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: { currency: totals.currency, totalPrice: totals.amount },
  } as OrderPayload;
};

export default mapCartToOrderPayload;
