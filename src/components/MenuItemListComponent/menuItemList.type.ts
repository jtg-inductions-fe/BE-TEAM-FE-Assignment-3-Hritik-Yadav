import type { MenuItem } from "@services/menu.type";

export interface MenuItemListProps {
  items: MenuItem[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  restaurantId?: string;
  onView: (id: string) => void;
  onAddToCart?: (menuItem: MenuItem) => void;
}
