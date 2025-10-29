import { ApiUrlParams, BASE_URL, ENDPOINT } from "@services/service.const";

export const buildApiUrl = (
  ENDPOINT: ENDPOINT,
  id?: string,
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
