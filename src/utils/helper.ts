import { BASE_URL, ENDPOINT, USER_ROLE } from "@services/service.const";

import type { ApiUrlParams, Role } from "@services/service.type";

export const buildApiUrl = (
  endpoint: ENDPOINT,
  id?: number | string,
  params?: ApiUrlParams,
): string => {
  let url = `${BASE_URL}/${endpoint}`;

  if (id) {
    url += `/${id}`;
  }

  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();
    url += `?${queryString}`;
  }

  return url;
};

export const buildMenuApiUrl = (
  ENDPOINT: ENDPOINT,
  restaurantId?: string,
  endpointNext?: ENDPOINT,
  menuItemId?: string,
  params?: ApiUrlParams,
): string => {
  let url = `${BASE_URL}/${ENDPOINT}`;

  if (restaurantId) {
    url += `/${restaurantId}`;
  }
  if (endpointNext) {
    url += `/${endpointNext}`;
  }
  if (menuItemId) {
    url += `/${menuItemId}`;
  }

  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();
    url += `?${queryString}`;
  }

  return url;
};

export const normalizeRole = (value: unknown): Role | null => {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === USER_ROLE.CUSTOMER || normalized === USER_ROLE.OWNER) {
    return normalized as Role;
  }

  return null;
};

export const getPriceLabel = (currency: string, price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(price);
};
