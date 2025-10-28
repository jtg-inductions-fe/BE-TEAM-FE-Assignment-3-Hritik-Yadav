import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";

import type { BackendResponse, UserData } from "./service.type";

export const getUserDetails = async (token: string): Promise<BackendResponse<UserData>> => {
  const url = buildApiUrl(ENDPOINT.USER);

  const { data } = await axios.get<BackendResponse<UserData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
