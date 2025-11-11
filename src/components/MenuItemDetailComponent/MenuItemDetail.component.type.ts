import type { MenuItem } from "@/services/menu.type";

export interface MenuItemDetailProps {
  menuItem: MenuItem;
  isOwnerView: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
  onAddToCart?: (menuItem: MenuItem) => void;
}
