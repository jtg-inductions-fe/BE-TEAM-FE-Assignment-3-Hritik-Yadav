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
