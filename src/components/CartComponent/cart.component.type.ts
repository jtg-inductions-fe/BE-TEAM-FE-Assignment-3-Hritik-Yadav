import type { CartTotalAmount } from "@/store/reducers/cart.type";

export interface CartDisplayItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  availableQuantity: number;
}

export interface CartComponentProps {
  items: CartDisplayItem[];
  totals: CartTotalAmount;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}
