import React from "react";
import { Card, Tag, Button, Typography } from "antd";

import { useAuthContext } from "@/context/AuthContext";
import { USER_ROLE } from "@/services/service.const";
import { STATUS_TAG_COLOR } from "./RestaurantCard.const";

import type { RestaurantCardProps } from "./RestaurantCard.type";

import "./restaurantCard.style.scss";

const { Text, Title } = Typography;

export const RestaurantCardComponent: React.FC<RestaurantCardProps> = ({
  restaurant,
  onView,
  onUpdate,
  onDelete,
}) => {
  const { id, name, openingTime, closingTime, status } = restaurant;

  const statusColor = STATUS_TAG_COLOR[status] || "default";
  const { role } = useAuthContext();
  const isOwner = role === USER_ROLE.OWNER;

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
          <Button className="restaurant-card__button" onClick={() => onView(id)} type="primary">
            View Items
          </Button>
          {isOwner && (
            <>
              <Button
                className="restaurant-card__button"
                type="default"
                onClick={() => onUpdate(restaurant)}
              >
                Update
              </Button>
              <Button
                danger
                onClick={() => onDelete(restaurant)}
                className="restaurant-card__delete-button"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
