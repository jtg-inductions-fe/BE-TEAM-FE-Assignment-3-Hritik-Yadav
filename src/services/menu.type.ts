export type ItemCategory = "VEG" | "NONVEG";
export type Currency = "INR" | "USD" | "EUR" | "JPY";

export interface Amount {
  currency: Currency;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageName: string;
  amount: Amount;
  rating: number;
  category: ItemCategory;
  quantity: number;
  imageUrl: string;
}

export interface MenuItemPayload {
  name: string;
  description: string;
  amount: Amount;
  imageName: string;
  rating: number;
  category: ItemCategory;
  quantity: number;
  ownerId?: string;
  restaurantId?: string;
}

export interface MenuItemFormValues {
  name: string;
  description: string;
  amount: Amount;
  rating: number;
  category: ItemCategory;
  quantity: number;
}

export interface ListMenuItemsResponseData {
  items: MenuItem[];
  nextPageToken?: string | null;
}

export interface ListMenuItemsParams {
  perPage?: number;
  nextPageToken?: string | null;
}
