import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";
import type { BackendResponse, SignupPayload, SignupResponseData } from "./service.type";

export const signup = async (
  payload: SignupPayload,
): Promise<BackendResponse<SignupResponseData>> => {

  const url = buildApiUrl(ENDPOINT.SIGNUP);
  
  const { data } = await axios.post<BackendResponse<SignupResponseData>>(url, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
