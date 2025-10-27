import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";

import type { BackendResponse, UserData } from "./service.type";

export const getUserById = async (uid: string): Promise<BackendResponse<UserData>> => {
  
  const url = buildApiUrl(ENDPOINT.USER, uid);
  const { data } = await axios.get<BackendResponse<UserData>>(url);
  return data;
};
