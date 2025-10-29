import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";
import { BackendResponse } from "./service.type";
import {
  CreateRestaurantResponseData,
  DeleteRestaurantResponseData,
  GetRestaurantResponseData,
  RestaurantPayLoad,
  UpdateRestaurantResponseData,
} from "./restaurant.type";

export const createRestaurant = async (
  token: string,
  payload: RestaurantPayLoad,
): Promise<BackendResponse<CreateRestaurantResponseData>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT);
  const { data } = await axios.post<BackendResponse<CreateRestaurantResponseData>>(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    payload,
  );
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
  payload: RestaurantPayLoad,
): Promise<BackendResponse<UpdateRestaurantResponseData>> => {
  const url = buildApiUrl(ENDPOINT.RESTAURANT, restaurantId);
  const { data } = await axios.post<BackendResponse<UpdateRestaurantResponseData>>(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    payload,
  );
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
