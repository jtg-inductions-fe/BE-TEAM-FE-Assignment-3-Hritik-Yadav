import React from "react";
import { Button, Spin, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { MenuItemCard } from "@/components";
import type { MenuItem } from "@/services/menu.type";
import "./menuItemList.style.scss";
import Title from "antd/lib/typography/Title";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

export interface MenuItemListProps {
  items: MenuItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  restaurantId?: string;
  onBack: () => void;
}

export const MenuItemList: React.FC<MenuItemListProps> = ({
  items,
  loading,
  loadingMore,
  hasMore,
  loadMore,
  restaurantId,
  onBack,
}) => {
  return (
    <div className="menu-item-list">
      <header className="menu-container__heading">
        <Title level={2} className="menu-container__section-title">
          Your MenuItems
        </Title>
      </header>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        className="menu-item-detail__back"
      >
        Back to restaurants
      </Button>
      {loading ? (
        <div className="menu-item-list__loader">
          <Spin />
        </div>
      ) : items.length === 0 ? (
        <Text className="menu-item-list__empty">No menu-item found</Text>
      ) : (
        <InfiniteScroll
          dataLength={items.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            loadingMore ? (
              <div className="menu-item-list__loader">
                <Spin size="small" />
              </div>
            ) : undefined
          }
          endMessage={<div className="menu-item-list__end">No more results to show</div>}
        >
          <div className="menu-item-list__grid">
            {items.map((menuItem) => (
              <div key={menuItem.id} className="menu-item-list__item">
                <MenuItemCard item={menuItem} restaurantId={restaurantId} />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};
