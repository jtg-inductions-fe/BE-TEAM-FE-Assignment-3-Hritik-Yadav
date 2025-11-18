import {
  ADD_ITEM_TO_CART,
  CLEAR_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM_QUANTITY,
} from "@store/actions/cart.actions.const";
import { DEFAULT_CART_CURRENCY } from "./cart.const";
import { calculateCartTotalAmount, resolveCurrency } from "./cart.helper";

import type { CartAction } from "@store/actions/cart.actions.type";
import type { CartItem, CartState } from "./cart.type";

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

      // checking if the quantity of items added is within range of the available quantity
      if (item.availableQuantity <= 0 || item.availableQuantity < item.quantity) {
        return state;
      }
      //cheking if the restaurantId matches from the cart Items
      if (state.restaurantId !== null && state.restaurantId !== restaurantId) {
        return state;
      }

      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.itemId === item.itemId,
      );

      let updatedItems: CartItem[];

      //if item does not exist in the cart then add else ignore
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
      const { item } = action.payload;
      const existingItem = state.items.find((cartItem) => cartItem.itemId === item.itemId);
      //if item is not present in the cart
      if (!existingItem) {
        return state;
      }

      const newQuantity = Math.min(item.quantity, item.availableQuantity);
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
        return initialState;
      }

      return {
        items: updatedItems,
        restaurantId: state.restaurantId,
        totalAmount: calculateCartTotalAmount(updatedItems, state.totalAmount.currency),
      };
    }

    case CLEAR_CART: {
      return initialState;
    }

    default:
      return state;
  }
};
