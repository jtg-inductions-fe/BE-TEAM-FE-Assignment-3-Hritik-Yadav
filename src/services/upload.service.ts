import axios, { AxiosError } from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";
import type { BackendResponse } from "./service.type";
import type { SignedUrlData } from "./upload.type";

export const getSignedUrl = async (
  token: string,
  name: string,
  type: string,
): Promise<BackendResponse<SignedUrlData>> => {
  const params: Record<string, string> = {};
  params.type = type;
  const url = buildApiUrl(ENDPOINT.UPLOAD_URL, name, params);

  const { data } = await axios.get<BackendResponse<SignedUrlData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const uploadImage = async (token: string, file: File): Promise<string> => {
  const signedUrlResponse = await getSignedUrl(token, file.name, file.type);
  const { uploadUrl, imageName } = signedUrlResponse.data ?? {};

  if (!uploadUrl || !imageName) {
    throw new AxiosError("Unable to resolve upload destination.");
  }

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return imageName;
};
