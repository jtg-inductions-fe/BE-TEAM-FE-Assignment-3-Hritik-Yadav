import { Restaurant } from "@/services/restaurant.type";

export interface RestaurantListProps {
  items: Restaurant[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onView: (id: string) => void;
  onUpdate: (restaurantItem: Restaurant) => void;
  onDelete: (restaurantItem: Restaurant) => void;
}
