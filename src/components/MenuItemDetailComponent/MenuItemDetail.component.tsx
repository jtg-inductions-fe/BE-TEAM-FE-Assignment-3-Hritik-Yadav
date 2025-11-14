import React from "react";
import { Button, Card, Divider, Image, Rate, Space, Statistic, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { CATEGORY_COLOR } from "../MenuItemCardComponent/menuItemCard.const";
import { getPriceLabel } from "@/utils/helper";
import { BackToButtonComponent } from "../BackToButtonComponent";

import type { MenuItemDetailProps } from "./MenuItemDetail.type";

import "./menuItemDetail.style.scss";

const { Title, Text } = Typography;

export const MenuItemDetailComponent: React.FC<MenuItemDetailProps> = ({
  menuItem,
  onUpdate,
  onDelete,
}) => {
  const { name, imageUrl, description, category, amount, quantity, rating } = menuItem;
  const categoryColor = CATEGORY_COLOR[category];
  const priceLabel = getPriceLabel(amount.currency, amount.price);

  return (
    <section className="menu-item-detail">
      <BackToButtonComponent label="Back to Menu" />

      <Card className="menu-item-detail__card" bodyStyle={{ padding: 0 }}>
        <div className="menu-item-detail__card-content">
          <div className="menu-item-detail__image">
            <Image src={imageUrl} alt={`image of ${name}`} preview loading="lazy" />
          </div>

          <div className="menu-item-detail__details">
            <div className="menu-item-detail__header">
              <Title level={3} className="menu-item-detail__title">
                {name}
              </Title>
              <Tag color={categoryColor}>{category}</Tag>
            </div>

            <Space direction="vertical" size="large" className="menu-item-detail__summary">
              <Space size="large" wrap className="menu-item-detail__statistics">
                <Statistic title="Price" value={priceLabel} />
                <Statistic title="Available" value={quantity} suffix="servings" />
                <Statistic title="Rating" value={rating} precision={1} suffix="/ 5" />
              </Space>

              <div className="menu-item-detail__rating">
                <Rate disabled allowHalf value={rating} />
                <Text type="secondary">{rating.toFixed(1)} of 5</Text>
              </div>

              <Divider className="menu-item-detail__divider" />

              <div className="menu-item-detail__description">
                <Title level={5}>Description</Title>
                <Text>{description}</Text>
              </div>

              <Divider className="menu-item-detail__divider" />

              <div className="menu-item-detail__actions">
                <Space size="middle">
                  <Button
                    className="menu-item-detail__button"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={onUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    className="menu-item-detail__delete-button"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                </Space>
              </div>
            </Space>
          </div>
        </div>
      </Card>
    </section>
  );
};
