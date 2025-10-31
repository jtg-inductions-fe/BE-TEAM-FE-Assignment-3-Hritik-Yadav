import React from "react";
import { Spin, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { RestaurantCard } from "@/components";
import type { Restaurant } from "@/services/restaurant.type";
import "./restaurantList.style.scss";

const { Text } = Typography;

export interface RestaurantListProps {
  items: Restaurant[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onUpdate: (restaurantItem: Restaurant) => void;
  onDelete: (restaurantItem: Restaurant) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
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
        <div className="restuarant-list__loader">
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
                <RestaurantCard
                  restaurant={restaurantItem}
                  onUpdate={() => onUpdate(restaurantItem)}
                  onDelete={() => onDelete(restaurantItem)}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};
