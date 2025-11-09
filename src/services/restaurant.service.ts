import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";
import { BackendResponse } from "./service.type";
import {
  CreateRestaurantResponseData,
  DeleteRestaurantResponseData,
  GetRestaurantResponseData,
  ListRestaurantsResponseData,
  RestaurantPayload,
  UpdateRestaurantResponseData,
} from "./restaurant.type";

export const createRestaurant = async (
  token: string,
  payload: RestaurantPayload,
): Promise<BackendResponse<CreateRestaurantResponseData>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT);
  const { data } = await axios.post<BackendResponse<CreateRestaurantResponseData>>(url, payload, {
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
): Promise<BackendResponse<GetRestaurantResponseData>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT, restaurantId);
  const { data } = await axios.get<BackendResponse<GetRestaurantResponseData>>(url, {
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
): Promise<BackendResponse<UpdateRestaurantResponseData>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT, restaurantId);
  const { data } = await axios.put<BackendResponse<UpdateRestaurantResponseData>>(url, payload, {
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
): Promise<BackendResponse<DeleteRestaurantResponseData>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT, restaurantId);
  const { data } = await axios.delete<BackendResponse<DeleteRestaurantResponseData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

interface ListRestaurantParams {
  perPage?: number;
  nextPageToken?: string | null;
}

export const listRestaurants = async (
  token: string,
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
