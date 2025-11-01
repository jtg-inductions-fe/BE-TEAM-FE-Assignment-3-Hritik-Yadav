import React from "react";
import { Card, Tag, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { STATUS_TAG_COLOR } from "./RestaurantCard.const";
import type { RestaurantCardProps } from "./RestaurantCard.type";
import "./restaurantCard.style.scss";

const { Text, Title } = Typography;

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onUpdate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { id, name, openingTime, closingTime, status } = restaurant;

  const statusColor = STATUS_TAG_COLOR[status] || "default";

  return (
    <Card className="restaurant-card">
      <div className="restaurant-card__content">
        <div className="restaurant-card__header">
          <Title level={4} className="restaurant-card__title">
            {name}
          </Title>
          <Tag color={statusColor} className="restaurant-card__status">
            {status}
          </Tag>
        </div>
        <div className="restaurant-card__meta">
          <Text type="secondary" className="restaurant-card__timings">
            Opens at {openingTime}
          </Text>
          <Text type="secondary" className="restaurant-card__timings">
            Closes at {closingTime}
          </Text>
        </div>
        <div className="restaurant-card__actions">
          <Button onClick={() => navigate(`/restaurant/${id}/mnu-items`)}>View Items</Button>
          <Button type="default" onClick={() => onUpdate(restaurant)}>
            Update
          </Button>
          <Button danger onClick={() => onDelete(restaurant)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
