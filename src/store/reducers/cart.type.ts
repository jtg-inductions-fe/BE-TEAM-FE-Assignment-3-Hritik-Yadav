import type { Currency } from "@/services/menu.type";

export interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  availableQuantity: number;
}

export interface CartTotalAmount {
  subtotal: number;
  serviceCharge: number;
  amount: number;
  currency: Currency;
}

export interface CartState {
  items: CartItem[];
  totalAmount: CartTotalAmount;
  restaurantId: string | null;
}
