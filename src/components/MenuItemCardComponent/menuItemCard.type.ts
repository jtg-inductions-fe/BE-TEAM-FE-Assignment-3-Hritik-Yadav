import type { MenuItem } from "@services/menu.type";

export interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  onView: (id: string) => void;
  onAddToCart?: (item: MenuItem) => void;
}
