import React from "react";
import { List, Typography, Space } from "antd";

import { getPriceLabel } from "@/utils/helper";
import { calculateItemsTotalAmount } from "./orderDetails.helper";

import type { OrderDetailsProps } from "./orderDetails.type";

import "./orderDetails.style.scss";

const { Text } = Typography;

const currency = "INR";
export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { subtotal, serviceCharge, amount } = calculateItemsTotalAmount(order.orderItems);
  return (
    <div>
      <List
        dataSource={order.orderItems}
        renderItem={(item) => (
          <List.Item>
            <div className="item-detail">
              <Text strong>{item.name}</Text>
              <Text type="secondary">{getPriceLabel(currency, item.price)}</Text>
              <Text>x {item.quantity}</Text>
              <Text strong>{getPriceLabel(currency, item.price * item.quantity)}</Text>
            </div>
          </List.Item>
        )}
      />

      <div className="cost-detail">
        <Space direction="vertical" className="cost-detail__items">
          <Space className="cost-detail__item">
            <Text type="secondary">Subtotal</Text>
            <Text strong>{getPriceLabel(order.totalAmount.currency, subtotal)}</Text>
          </Space>
          <Space className="cost-detail__item">
            <Text type="secondary">Service Charge</Text>
            <Text strong>{getPriceLabel(order.totalAmount.currency, serviceCharge)}</Text>
          </Space>
          <Space className="cost-detail__item">
            <Text type="secondary">Total</Text>
            <Text strong>{getPriceLabel(order.totalAmount.currency, amount)}</Text>
          </Space>
        </Space>
      </div>
    </div>
  );
};
