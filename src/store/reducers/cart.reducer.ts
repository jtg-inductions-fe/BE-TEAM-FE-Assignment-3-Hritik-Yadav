import type { Currency } from "@/services/menu.type";

import type { CartAction } from "@/store/actions/cart.actions.type";
import {
  ADD_ITEM_TO_CART,
  CLEAR_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM_QUANTITY,
} from "@/store/actions/cart.actions.const";

import type { CartItem, CartState } from "./cart.type";

const DEFAULT_CART_CURRENCY: Currency = "INR";

const roundToTwoDecimals = (value: number): number => Math.round(value * 100) / 100;

const calculateCartTotalAmount = (
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

const resolveCurrency = (currency?: Currency): Currency => currency ?? DEFAULT_CART_CURRENCY;

const initialState: CartState = {
  items: [],
  totalAmount: {
    subtotal: 0,
    serviceCharge: 0,
    amount: 0,
    currency: DEFAULT_CART_CURRENCY,
  },
  restaurantId: null,
};

export const cartReducer = (state: CartState = initialState, action: CartAction): CartState => {
  switch (action.type) {
    case ADD_ITEM_TO_CART: {
      const { item, currency, restaurantId } = action.payload;
      const nextCurrency = resolveCurrency(currency);

      if (item.availableQuantity <= 0 || item.availableQuantity < item.quantity) {
        return state;
      }

      if (state.restaurantId !== null && state.restaurantId !== restaurantId) {
        return state;
      }

      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.itemId === item.itemId,
      );

      let updatedItems: CartItem[];

      if (existingItemIndex === -1) {
        updatedItems = [...state.items, item];
      } else {
        return state;
      }

      return {
        items: updatedItems,
        totalAmount: calculateCartTotalAmount(updatedItems, nextCurrency),
        restaurantId: state.restaurantId ?? restaurantId,
      };
    }

    case UPDATE_CART_ITEM_QUANTITY: {
      const { item } = action.payload; //get item here also
      const existingItem = state.items.find((cartItem) => cartItem.itemId === item.itemId);
      if (!existingItem) {
        return state;
      }

      const newQuantity = Math.min(item.quantity, item.availableQuantity);

      if (newQuantity <= 0) {
        const filteredItems = state.items.filter((cartItem) => cartItem.itemId !== item.itemId);

        if (filteredItems.length === 0) {
          return {
            ...initialState,
            totalAmount: {
              ...initialState.totalAmount,
              currency: state.totalAmount.currency,
            },
          };
        }

        return {
          items: filteredItems,
          restaurantId: state.restaurantId,
          totalAmount: calculateCartTotalAmount(filteredItems, state.totalAmount.currency),
        };
      }

      if (newQuantity === existingItem.quantity) {
        return state;
      }

      const updatedItems = state.items.map((cartItem) =>
        cartItem.itemId === item.itemId
          ? { ...cartItem, quantity: newQuantity, availableQuantity: item.availableQuantity }
          : cartItem,
      );

      return {
        items: updatedItems,
        restaurantId: state.restaurantId,
        totalAmount: calculateCartTotalAmount(updatedItems, state.totalAmount.currency),
      };
    }

    case REMOVE_ITEM_FROM_CART: {
      const { itemId } = action.payload;
      const updatedItems = state.items.filter((cartItem) => cartItem.itemId !== itemId);

      if (updatedItems.length === 0) {
        return {
          ...initialState,
          totalAmount: {
            ...initialState.totalAmount,
            currency: state.totalAmount.currency,
          },
        };
      }

      return {
        items: updatedItems,
        restaurantId: state.restaurantId,
        totalAmount: calculateCartTotalAmount(updatedItems, state.totalAmount.currency),
      };
    }

    case CLEAR_CART: {
      return {
        ...initialState,
        totalAmount: {
          ...initialState.totalAmount,
          currency: state.totalAmount.currency,
        },
      };
    }

    default:
      return state;
  }
};
