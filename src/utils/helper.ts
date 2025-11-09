import { AxiosError } from "axios";

import { BASE_URL, ENDPOINT, USER_ROLE } from "@services/service.const";

import type { ApiUrlParams, Role } from "@services/service.type";

export const buildApiUrl = (
  ENDPOINT: ENDPOINT,
  id?: number | string,
  params?: ApiUrlParams,
): string => {
  let url = `${BASE_URL}/${ENDPOINT}`;

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
export const resolveAxiosErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (!(error instanceof AxiosError)) {
    return defaultMessage;
  }

  const status = error.response?.status;

  if (status && status >= 500) {
    return "Server error. Please try again shortly.";
  }

  if (status && status >= 400) {
    const responseMessage = error.response?.data?.message;
    return responseMessage ?? defaultMessage;
  }

  if (!status && error.request) {
    return "Network error. Check your connection.";
  }

  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};
