import React from "react";
import { Spin, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { MenuItemCardComponent } from "@/components";

import type { MenuItemListProps } from "./menuItemList.type";

import "./menuItemList.style.scss";

const { Text } = Typography;

export const MenuItemListComponent: React.FC<MenuItemListProps> = ({
  items,
  loading,
  hasMore,
  loadMore,
  restaurantId,
}) => {
  return (
    <div className="menu-item-list">
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="menu-item-list__loader">
            <Spin size="small" />
          </div> 
        }
        endMessage={
            <Text className="menu-item-list__end">
              {items.length === 0 ? "No Menu Item found" : "No more results to show"}
            </Text>
        }
      >
        <div className="menu-item-list__grid">
          {items.map((menuItem) => (
            <div key={menuItem.id} className="menu-item-list__item">
              <MenuItemCardComponent item={menuItem} restaurantId={restaurantId} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
