import React from "react";
import { Card, Tag, Button, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { CATEGORY_COLOR } from "./menuItemCard.const";
import { getPriceLabel } from "@/utils/helper";

import type { MenuItemCardProps } from "./menuItemCard.type";

import "./menuItemCard.style.scss";

const { Title, Text } = Typography;

export const MenuItemCardComponent: React.FC<MenuItemCardProps> = ({ item, restaurantId }) => {
  const navigate = useNavigate();
  const { id, name, amount, rating, category, quantity, imageUrl } = item;
  const categoryColor = CATEGORY_COLOR[category];
  const priceLabel = getPriceLabel(amount.currency, amount.price);
  const availabilityLabel = quantity > 0 ? `${quantity} available` : "Out of stock";

  const handleViewDetails = () => {
    const detailsPage = `${ROUTES_URL.RESTAURANT}/${restaurantId}/${ROUTES_URL.MENU}/${ROUTES_URL.ITEM}/${id}`;
    navigate(detailsPage);
  };

  return (
    <Card className="menu-item-card" hoverable>
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
            block
            onClick={handleViewDetails}
            className="menu-item-card__button"
          >
            View Item
          </Button>
        </div>
      </div>
    </Card>
  );
};
