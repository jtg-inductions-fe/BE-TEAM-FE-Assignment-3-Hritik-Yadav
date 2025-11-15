import React from "react";
import { Button, Empty, InputNumber, Space, Typography, List, Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { getPriceLabel } from "@/utils/helper";

import type { CartComponentProps } from "./cart.component.type";

import "./cart.component.style.scss";

const { Title, Text } = Typography;

export const CartComponent: React.FC<CartComponentProps> = ({
  items,
  totals,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
}) => {
  const currency = totals.currency;

  const hasItems = items.length > 0;

  return (
    <section className="cart">
      <div className="cart__header">
        <Title level={3} className="cart__title">
          Your Cart
        </Title>
      </div>

      <div className="cart__list">
        {hasItems ? (
          <List
            dataSource={items}
            renderItem={(item) => (
              <Card className="cart__item-card" key={item.itemId}>
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => onRemoveItem(item.itemId)}
                  className="item-card__remove-button"
                >
                  Remove
                </Button>
                <Space size={"large"}>
                  <Text strong className="item-card__item-name">
                    {item.name}
                  </Text>
                  <Text type="secondary">Price: {getPriceLabel(currency, item.unitPrice)} x</Text>
                  <InputNumber
                    min={1}
                    max={item.availableQuantity}
                    value={item.quantity}
                    onChange={(value) => {
                      const nextQuantity = typeof value === "number" ? value : item.quantity;
                      onQuantityChange(item.itemId, nextQuantity);
                    }}
                  />
                  <Text type="secondary"> = {getPriceLabel(currency, item.itemTotal)}</Text>
                </Space>
              </Card>
            )}
          />
        ) : (
          <Empty description="Your cart is empty" />
        )}
      </div>

      <div className="cart__summary">
        <div className="cart__summary-values">
          <Space direction="horizontal" size={8} className="cart__summary-item">
            <Text type="secondary">Subtotal: </Text>
            <Text strong>{getPriceLabel(currency, totals.subtotal)}</Text>
          </Space>
          <Space direction="horizontal" size={8} className="cart__summary-item">
            <Text type="secondary">Service Charge: </Text>
            <Text strong>{getPriceLabel(currency, totals.serviceCharge)}</Text>
          </Space>
          <Space direction="horizontal" size={3} className="cart__summary-item">
            <Title level={4} className="cart__amount">
              <Text type="secondary">Total Amount: </Text>
              {getPriceLabel(currency, totals.amount)}
            </Title>
          </Space>
        </div>
        <div className="cart__summary-actions">
          <Button
            danger
            onClick={onClearCart}
            disabled={!hasItems}
            className="summary-actions__clear-button"
          >
            Clear Cart
          </Button>
          <Button type="primary" disabled={!hasItems} className="summary-actions__checkout-button">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </section>
  );
};
