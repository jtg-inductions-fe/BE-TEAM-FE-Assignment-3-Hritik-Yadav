import React from "react";
import { Spin, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { BackToButtonComponent, MenuItemCardComponent } from "@/components";

import type { MenuItemListProps } from "./menuItemList.component.type";

import "./menuItemList.component.style.scss";

const { Title, Text } = Typography;

export const MenuItemListComponent: React.FC<MenuItemListProps> = ({
  items,
  loading,
  loadingMore,
  hasMore,
  loadMore,
  restaurantId,
}) => {
  return (
    <div className="menu-item-list">
      <header className="menu-container__heading">
        <Title level={2} className="menu-container__section-title">
          Your MenuItems
        </Title>
        <BackToButtonComponent label="Back To Restaurant" />
      </header>
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
                <MenuItemCardComponent item={menuItem} restaurantId={restaurantId} />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};
