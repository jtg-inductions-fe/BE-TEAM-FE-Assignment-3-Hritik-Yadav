import React from "react";
import { useParams } from "react-router-dom";
import { Typography } from "antd";

import { BackToButton } from "@/components";

export const RestaurantItemsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <Typography.Title level={3}>Menu Items (Dummy)</Typography.Title>
      <Typography.Paragraph>
        This is a placeholder for restaurant {id}s menu items.
      </Typography.Paragraph>
      <BackToButton label="Back to Restaurant" />
    </div>
  );
};
