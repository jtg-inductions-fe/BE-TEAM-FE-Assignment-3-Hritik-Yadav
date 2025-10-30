import type { Moment } from "moment";

export type RestaurantStatus = "active" | "inactive";

export interface Restaurant {
  id: string;
  name: string;
  openingTime: string; // HH:mm (24h)
  closingTime: string; // HH:mm (24h)
  status: RestaurantStatus;
  ownerId?: string;
}

export interface RestaurantPayload {
  name: string;
  openingTime: string; // HH:mm (24h)
  closingTime: string; // HH:mm (24h)
  status: RestaurantStatus;
  ownerId?: string; // required for create, optional in update
}

export interface RestaurantFormValues {
  name: string;
  openingTime: Moment;
  closingTime: Moment;
  status: RestaurantStatus;
}

export interface CreateRestaurantResponseData {
  restaurant: Restaurant;
}

export interface GetRestaurantResponseData {
  restaurant: Restaurant;
}

export interface UpdateRestaurantResponseData {
  restaurant: Restaurant;
}

export interface DeleteRestaurantResponseData {
  id: string;
}

export interface ListRestaurantsResponseData {
  items: Restaurant[];
  perpage?: number;
  hasMore?: boolean;
  nextPageToken?: string | null;
  total?: number;
}
