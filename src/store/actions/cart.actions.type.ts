import type { Currency } from "@/services/menu.type";

import type { CartItem } from "@/store/reducers/cart.type";
import {
  ADD_ITEM_TO_CART,
  CLEAR_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM_QUANTITY,
} from "./cart.actions.const";

export type AddItemToCartAction = {
  type: typeof ADD_ITEM_TO_CART;
  payload: {
    item: CartItem;
    currency: Currency;
    restaurantId: string;
  };
};

export type RemoveItemFromCartAction = {
  type: typeof REMOVE_ITEM_FROM_CART;
  payload: {
    itemId: string;
  };
};

export type UpdateCartItemQuantityAction = {
  type: typeof UPDATE_CART_ITEM_QUANTITY;
  payload: {
    item: CartItem;
  };
};

export type ClearCartAction = {
  type: typeof CLEAR_CART;
};

export type CartAction =
  | AddItemToCartAction
  | RemoveItemFromCartAction
  | UpdateCartItemQuantityAction
  | ClearCartAction;
