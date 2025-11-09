import axios from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";

export const getSignedUrl = async (token: string, name: string, type: string) => {
  const params: Record<string, string> = {};
  params.type = type;
  const url = buildApiUrl(ENDPOINT.UPLOAD_URL, name, params);

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
