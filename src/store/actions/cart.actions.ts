import {
  ADD_ITEM_TO_CART,
  CLEAR_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM_QUANTITY,
} from "./cart.actions.const";
import type { Currency } from "@/services/menu.type";
import type { CartItem } from "@/store/reducers/cart.type";

export const addItemToCart = (params: {
  item: CartItem;
  currency: Currency;
  restaurantId: string;
}) => ({
  type: ADD_ITEM_TO_CART,
  payload: {
    item: params.item,
    currency: params.currency,
    restaurantId: params.restaurantId,
  },
});

export const updateCartItemQuantity = (item: CartItem) => ({
  type: UPDATE_CART_ITEM_QUANTITY,
  payload: {
    item,
  },
});

export const removeItemFromCart = (itemId: string) => ({
  type: REMOVE_ITEM_FROM_CART,
  payload: {
    itemId,
  },
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
