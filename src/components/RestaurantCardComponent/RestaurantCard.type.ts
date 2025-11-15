import type { Restaurant } from "@services/restaurant.type";

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onView: (id: string) => void;
  onUpdate: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
}
