import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ListOrderParams, ListOrdersResponseData, OrderPayload } from "./order.type";
import { BackendResponse } from "./service.type";
import { ENDPOINT } from "./service.const";

export const createOrder = async (
  token: string,
  payload: OrderPayload,
): Promise<BackendResponse> => {
  const url = buildApiUrl([ENDPOINT.ORDER]);
  const { data } = await axios.post<BackendResponse>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getUserOrders = async (
  token: string | null,
  { status = "all", perPage = 10, nextPageToken }: ListOrderParams = {},
): Promise<BackendResponse<ListOrdersResponseData>> => {
  const params: Record<string, string | number> = {};
  if (status !== "all") {
    params.status = status;
  }

  if (perPage) {
    params.perPage = perPage;
  }

  if (nextPageToken) {
    params.nextPageToken = nextPageToken;
  }

  const url = buildApiUrl([ENDPOINT.ORDER], params);
  const { data } = await axios.get<BackendResponse<ListOrdersResponseData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateOrder = async (
  token: string,
  restaurantId: string,
  status: string,
  orderId: string,
): Promise<BackendResponse> => {
  const url = buildApiUrl([ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.ORDER, orderId]);
  const payload = {
    orderStatus: status,
  };
  const { data } = await axios.patch<BackendResponse>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getRestaurantOrders = async (
  token: string | null,
  restaurantId: string,
  { status = "all", perPage = 10, nextPageToken }: ListOrderParams = {},
): Promise<BackendResponse<ListOrdersResponseData>> => {
  const params: Record<string, string | number> = {};
  if (status !== "all") {
    params.status = status;
  }

  if (perPage) {
    params.perPage = perPage;
  }

  if (nextPageToken) {
    params.nextPageToken = nextPageToken;
  }

  const url = buildApiUrl([ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.ORDER], params);
  const { data } = await axios.get<BackendResponse<ListOrdersResponseData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
