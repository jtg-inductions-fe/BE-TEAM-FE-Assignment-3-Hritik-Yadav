import React from "react";
import { Card, Tag, Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import type { RestaurantCardProps } from "./RestaurantCard.type";
import { STATUS_TAG_COLOR } from "./RestaurantCard.const";
import "./restaurantCard.style.scss";

const { Text, Title } = Typography;

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const { id, name, openingTime, closingTime, status } = restaurant;

  const statusColor = STATUS_TAG_COLOR[status] || "default";

  return (
    <Card key={id} className="restaurant-card">
      <Space direction="vertical" className="restaurant-card__content">
        <Space align="center" className="restaurant-card__header">
          <Title level={4} className="restaurant-card__title">
            {name}
          </Title>
          <Tag color={statusColor} className="restaurant-card__status">
            {status}
          </Tag>
        </Space>
        <Text type="secondary" className="restaurant-card__timings">
          Opens : {openingTime}
        </Text>
        <Text type="secondary" className="restaurant-card__timings">
          Closes : {closingTime}
        </Text>
        <Space>
          <Button onClick={() => navigate(`/restaurant/${id}/mnu-items`)}>View Items</Button>
          <Button type="default" onClick={() => onUpdate(restaurant)}>
            Update
          </Button>
          <Button danger onClick={() => onDelete(restaurant)}>
            Delete
          </Button>
        </Space>
      </Space>
    </Card>
  );
};
