import React, { useCallback, useMemo } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { CartComponent } from "@/components";
import { selectCartItems, selectCartTotalAmount } from "@store/selectors/selector";
import { clearCart, removeItemFromCart, updateCartItemQuantity } from "@store/actions/cart.actions";

import type { CartDisplayItem } from "@components/CartComponent/cart.component.type";

import "./cartContainer.style.scss";

export const CartContainer: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotalAmount);

  const cartItems: CartDisplayItem[] = useMemo(
    () =>
      items.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        itemTotal: Math.round(item.price * item.quantity * 100) / 100,
        availableQuantity: item.availableQuantity,
      })),
    [items],
  );

  const handleQuantityChange = useCallback(
    (itemId: string, quantity: number) => {
      const cartItem = items.find((entry) => entry.itemId === itemId);
      if (!cartItem) {
        return;
      }

      const nextQuantity = Math.min(Math.max(quantity, 1), cartItem.availableQuantity);

      if (quantity > cartItem.availableQuantity) {
        message.warning(`Only ${cartItem.availableQuantity} available for ${cartItem.name}`);
      }

      if (nextQuantity === cartItem.quantity) {
        return;
      }

      dispatch(updateCartItemQuantity({ ...cartItem, quantity: nextQuantity }));
    },
    [dispatch, items],
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      dispatch(removeItemFromCart(itemId));
      message.success("Item removed from cart");
    },
    [dispatch],
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
    message.info("Cart cleared");
  }, [dispatch]);

  return (
    <div className="cart-container">
      <CartComponent
        items={cartItems}
        totals={totals}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
};
