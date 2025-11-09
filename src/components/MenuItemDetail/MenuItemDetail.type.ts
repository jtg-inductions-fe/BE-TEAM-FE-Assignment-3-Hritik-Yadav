import type { MenuItem } from "@/services/menu.type";

export interface MenuItemDetailProps {
  menuItem: MenuItem;
  onBack: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}
