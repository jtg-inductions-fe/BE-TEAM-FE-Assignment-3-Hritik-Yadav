import React from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Button } from "antd";

import { ROUTES_URL } from "@/routes/routes.const";

export const RestaurantItemsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <Typography.Title level={3}>Menu Items (Dummy)</Typography.Title>
      <Typography.Paragraph>
        This is a placeholder for restaurant {id}s menu items.
      </Typography.Paragraph>
      <Link to={ROUTES_URL.RESTAURANT}>
        <Button type="default">Back to Restaurants</Button>
      </Link>
    </div>
  );
};
