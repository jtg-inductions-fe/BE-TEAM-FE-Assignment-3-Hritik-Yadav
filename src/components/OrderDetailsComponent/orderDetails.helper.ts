import { roundToTwoDecimals } from "@/store/reducers/cart.helper";
import type { Items } from "@/services/order.type";

export const calculateItemsTotalAmount = (items: Items[]) => {
  const subtotal = roundToTwoDecimals(
    items.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0),
  );
  const serviceCharge = subtotal > 0 ? roundToTwoDecimals(Math.max(20, subtotal * 0.01)) : 0;
  const amount = subtotal > 0 ? roundToTwoDecimals(subtotal + serviceCharge) : 0;

  return {
    subtotal,
    serviceCharge,
    amount,
  };
};
