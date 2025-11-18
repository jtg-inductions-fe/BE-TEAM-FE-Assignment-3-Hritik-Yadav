import type { MenuItem } from "@services/menu.type";

export interface MenuItemListProps {
  items: MenuItem[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onView: (id: string) => void;
}
