import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";

import type { BackendResponse } from "./service.type";
import type {
  ListMenuItemsParams,
  ListMenuItemsResponseData,
  MenuItem,
  MenuItemPayload,
} from "./menu.type";

export const createMenuItem = async (
  token: string,
  restaurantId: string,
  payload: MenuItemPayload,
): Promise<BackendResponse<MenuItem>> => {
  const url = buildApiUrl([ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.MENU_ITEMS]);
  const { data } = await axios.post<BackendResponse<MenuItem>>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getMenuItem = async (
  token: string,
  restaurantId: string,
  menuItemId: string,
): Promise<BackendResponse<MenuItem>> => {
  const url = buildApiUrl([ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.MENU_ITEMS, menuItemId]);

  const { data } = await axios.get<BackendResponse<MenuItem>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getPublicMenuItem = async (
  restaurantId: string,
  menuItemId: string,
): Promise<BackendResponse<MenuItem>> => {
  const url = buildApiUrl([ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.MENU_ITEMS, menuItemId]);

  const { data } = await axios.get<BackendResponse<MenuItem>>(url);
  return data;
};

export const updateMenuItem = async (
  token: string,
  restaurantId: string,
  menuItemId: string,
  payload: MenuItemPayload,
): Promise<BackendResponse<MenuItem>> => {
  const url = buildApiUrl([ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.MENU_ITEMS, menuItemId]);
  const { data } = await axios.put<BackendResponse<MenuItem>>(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const deleteMenuItem = async (
  token: string,
  restaurantId: string,
  menuItemId: string,
  imageName: string,
): Promise<BackendResponse> => {
  const params: Record<string, string | number> = {};

  if (imageName) {
    params.imageName = imageName;
  }
  const url = buildApiUrl(
    [ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.MENU_ITEMS, menuItemId],
    params,
  );
  const { data } = await axios.delete<BackendResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const listMenuItems = async (
  token: string | null,
  restaurantId: string,
  { perPage = 10, nextPageToken }: ListMenuItemsParams = {},
): Promise<BackendResponse<ListMenuItemsResponseData>> => {
  const params: Record<string, string | number> = {};

  if (perPage) {
    params.perPage = perPage;
  }

  if (nextPageToken) {
    params.nextPageToken = nextPageToken;
  }

  const url = buildApiUrl([ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.MENU_ITEMS], params);
  const { data } = await axios.get<BackendResponse<ListMenuItemsResponseData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const listPublicMenuItems = async (
  restaurantId: string,
  { perPage = 10, nextPageToken }: ListMenuItemsParams = {},
): Promise<BackendResponse<ListMenuItemsResponseData>> => {
  const params: Record<string, string | number> = {};

  if (perPage) {
    params.perPage = perPage;
  }

  if (nextPageToken) {
    params.nextPageToken = nextPageToken;
  }

  const url = buildApiUrl(
    [ENDPOINT.RESTAURANT, restaurantId, ENDPOINT.MENU_ITEMS, ENDPOINT.LIST],
    params,
  );
  const { data } = await axios.get<BackendResponse<ListMenuItemsResponseData>>(url);
  return data;
};
