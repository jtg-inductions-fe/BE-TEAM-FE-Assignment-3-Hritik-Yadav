import { BASE_URL, ENDPOINT } from "@services/service.const";
import type { ApiUrlParams, Role } from "@/services/service.type";

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
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};

export const isValidRole = (value: unknown): value is Role =>
  value === "customer" || value === "owner";
