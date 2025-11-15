import React from "react";
import { Spin, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { RestaurantCardComponent } from "@/components";

import type { RestaurantListProps } from "./restaurantList.type";

import "./restaurantList.style.scss";

const { Text } = Typography;

export const RestaurantListComponent: React.FC<RestaurantListProps> = ({
  items,
  loading,
  hasMore,
  loadMore,
  onView,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="restaurant-list">
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="restaurant-list__loader">
            <Spin size="small" />
          </div>
        }
        endMessage={
          !loading ? (
            <Text className="restaurant-list__end">
              {items.length === 0 ? "No restaurant found" : "No more results to show"}
            </Text>
          ) : undefined
        }
      >
        <div className="restaurant-list__grid">
          {items.map((restaurantItem) => (
            <div key={restaurantItem.id} className="restaurant-list__item">
              <RestaurantCardComponent
                restaurant={restaurantItem}
                onView={onView}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
