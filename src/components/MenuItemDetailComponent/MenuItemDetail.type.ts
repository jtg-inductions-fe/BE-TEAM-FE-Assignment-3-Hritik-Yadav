import type { MenuItem } from "@/services/menu.type";

export interface MenuItemDetailProps {
  menuItem: MenuItem;
  onUpdate: () => void;
  onDelete: () => void;
}
