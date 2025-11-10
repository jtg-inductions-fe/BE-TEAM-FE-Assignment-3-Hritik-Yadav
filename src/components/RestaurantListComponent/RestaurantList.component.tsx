import React from "react";
import { Spin, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { RestaurantCardComponent } from "@/components";

import type { RestaurantListProps } from "./restaurantList.component.type";

import "./restaurantList.component.style.scss";

const { Text } = Typography;

export const RestaurantListComponent: React.FC<RestaurantListProps> = ({
  items,
  loading,
  loadingMore,
  hasMore,
  loadMore,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="restaurant-list">
      {loading ? (
        <div className="restaurant-list__loader">
          <Spin />
        </div>
      ) : items.length === 0 ? (
        <Text className="restaurant-list__empty">No restaurant found</Text>
      ) : (
        <InfiniteScroll
          dataLength={items.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            loadingMore ? (
              <div className="restaurant-list__loader">
                <Spin size="small" />
              </div>
            ) : undefined
          }
          endMessage={<div className="restaurant-list__end">No more results to show</div>}
        >
          <div className="restaurant-list__grid">
            {items.map((restaurantItem) => (
              <div key={restaurantItem.id} className="restaurant-list__item">
                <RestaurantCardComponent
                  restaurant={restaurantItem}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};
