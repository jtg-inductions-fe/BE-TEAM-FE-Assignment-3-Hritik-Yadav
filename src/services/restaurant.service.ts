import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";
import type { BackendResponse } from "./service.type";
import type {
  ListRestaurantParams,
  ListRestaurantsResponseData,
  Restaurant,
  RestaurantPayload,
} from "./restaurant.type";

export const createRestaurant = async (
  token: string,
  payload: RestaurantPayload,
): Promise<BackendResponse<Restaurant>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT);
  const { data } = await axios.post<BackendResponse<Restaurant>>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getRestaurant = async (
  token: string,
  restaurantId: string,
): Promise<BackendResponse<Restaurant>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT, restaurantId);
  const { data } = await axios.get<BackendResponse<Restaurant>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateRestaurant = async (
  token: string,
  restaurantId: string,
  payload: RestaurantPayload,
): Promise<BackendResponse<Restaurant>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT, restaurantId);
  const { data } = await axios.put<BackendResponse<Restaurant>>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const deleteRestaurant = async (
  token: string,
  restaurantId: string,
): Promise<BackendResponse> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT, restaurantId);
  const { data } = await axios.delete<BackendResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const listRestaurants = async (
  token: string | null,
  { perPage = 10, nextPageToken }: ListRestaurantParams = {},
): Promise<BackendResponse<ListRestaurantsResponseData>> => {
  const params: Record<string, string | number> = {};

  if (perPage) {
    params.perPage = perPage;
  }

  if (nextPageToken) {
    params.nextPageToken = nextPageToken;
  }

  const url = buildApiUrl(ENDPOINT.RESTAURANT, undefined, params);
  const { data } = await axios.get<BackendResponse<ListRestaurantsResponseData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const listPublicRestaurants = async (
  { perPage = 10, nextPageToken }: ListRestaurantParams = {},
): Promise<BackendResponse<ListRestaurantsResponseData>> => {
  const params: Record<string, string | number> = {};

  if (perPage) {
    params.perPage = perPage;
  }

  if (nextPageToken) {
    params.nextPageToken = nextPageToken;
  }

  const url = buildApiUrl(ENDPOINT.RESTAURANT, ENDPOINT.LIST, params);
  const { data } = await axios.get<BackendResponse<ListRestaurantsResponseData>>(url);
  return data;
};
