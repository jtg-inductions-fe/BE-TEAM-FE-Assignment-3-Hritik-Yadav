import type { Restaurant } from "@services/restaurant.type";

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onUpdate: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
}
