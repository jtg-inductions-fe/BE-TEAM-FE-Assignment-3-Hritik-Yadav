import { Currency } from "@/services/menu.type";
import { CartItem, CartState } from "./cart.type";
import { DEFAULT_CART_CURRENCY } from "./cart.const";

export const roundToTwoDecimals = (value: number): number => Math.round(value * 100) / 100;

//for calculation the total amount 
export const calculateCartTotalAmount = (
  items: CartItem[],
  currency: Currency,
): CartState["totalAmount"] => {
  const subtotal = roundToTwoDecimals(
    items.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0),
  );
  const serviceCharge = subtotal > 0 ? roundToTwoDecimals(Math.max(20, subtotal * 0.01)) : 0;
  const amount = subtotal > 0 ? roundToTwoDecimals(subtotal + serviceCharge) : 0;

  return {
    subtotal,
    serviceCharge,
    amount,
    currency,
  };
};

//currency is one of the allowed currency
export const resolveCurrency = (currency?: Currency): Currency => currency ?? DEFAULT_CART_CURRENCY;
