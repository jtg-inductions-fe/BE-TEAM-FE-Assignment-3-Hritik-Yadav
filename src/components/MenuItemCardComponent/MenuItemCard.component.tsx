import React from "react";
import { Card, Tag, Button, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { CATEGORY_COLOR } from "./menuItemCard.component.const";
import { getPriceLabel } from "@/utils/helper";
import { AddToCartButton } from "@components/AddToCartButton";

import type { MenuItemCardProps } from "./menuItemCard.component.type";

import "./menuItemCard.component.style.scss";

const { Title, Text } = Typography;

export const MenuItemCardComponent: React.FC<MenuItemCardProps> = ({
  item,
  restaurantId,
  onView,
  onAddToCart,
}) => {
  const { id, name, amount, rating, category, quantity, imageUrl } = item;
  const categoryColor = CATEGORY_COLOR[category];
  const priceLabel = getPriceLabel(amount.currency, amount.price);
  const availabilityLabel = quantity > 0 ? `${quantity} available` : "Out of stock";

  const handleViewDetails = () => {
    if (onView) {
      onView(id);
      return;
    }
  };

  return (
    <Card className="menu-item-card">
      <div className="menu-item-card__content">
        <div className="menu-item-card__header">
          <Title level={4} className="menu-item-card__title">
            {name}
          </Title>
          <Tag color={categoryColor} className="menu-item-card__category">
            {category}
          </Tag>
        </div>
        <div className="menu-item-card__meta">
          <img
            src={imageUrl}
            alt={`image of ${name}`}
            height={100}
            width={100}
            loading="lazy"
            className="menu-item-card__thumbnail"
          />
          <div className="menu-item-card__meta-info">
            <Text strong className="menu-item-card__price">
              {priceLabel}
            </Text>
            <div className="menu-item-card__rating">
              <StarFilled className="menu-item-card__rating-icon" />
              <Text>{rating.toFixed(1)}</Text>
            </div>
            <Text className="menu-item-card__availability">{availabilityLabel}</Text>
          </div>
        </div>
        <div className="menu-item-card__actions">
          <Button
            type="primary"
            onClick={handleViewDetails}
            className="menu-item-card__button"
          >
            View Item
          </Button>
          {onAddToCart && (
            <AddToCartButton
              disabled={quantity <= 0}
              onClick={() => onAddToCart(item)}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
