import type { MenuItem } from "@services/menu.type";

export interface MenuItemCardProps {
  item: MenuItem;
  onView:(id: string) => void;
}
