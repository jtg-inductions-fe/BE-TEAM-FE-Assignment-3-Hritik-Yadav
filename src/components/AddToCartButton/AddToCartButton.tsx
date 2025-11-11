import React from "react";
import { Button } from "antd";

import type { AddToCartButtonProps } from "./addToCartButton.type";

import "./addToCartButton.style.scss";

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  disabled = false,
  onClick,
}) => {

  return (
    <Button
      type="default"
      disabled={disabled}
      onClick={onClick}
      className="add-to-cart__button"
    >
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
};
