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
  openingTime: string;
  closingTime: string;
  status: RestaurantStatus;
  ownerId?: string;
}

export interface RestaurantFormValues {
  name: string;
  openingTime: Moment;
  closingTime: Moment;
  status: RestaurantStatus;
}

export interface ListRestaurantsResponseData {
  items: Restaurant[];
  nextPageToken?: string | null;
}

export interface ListRestaurantParams {
  perPage?: number;
  nextPageToken?: string | null;
}