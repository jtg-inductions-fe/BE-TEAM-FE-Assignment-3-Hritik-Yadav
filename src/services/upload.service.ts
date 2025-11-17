import axios, { AxiosError } from "axios";

import { buildApiUrl } from "@/utils/helper";
import { ENDPOINT } from "./service.const";

import type { BackendResponse } from "./service.type";
import type { CsvSignedUrlData, SignedUrlData } from "./upload.type";

export const getImageSignedUrl = async (
  token: string,
  name: string,
  type: string,
): Promise<BackendResponse<SignedUrlData>> => {
  const params: Record<string, string> = {};
  params.type = type;
  const url = buildApiUrl([ENDPOINT.UPLOAD_URL, name], params);

  const { data } = await axios.get<BackendResponse<SignedUrlData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const uploadImage = async (token: string, file: File): Promise<string> => {
  const signedUrlResponse = await getImageSignedUrl(token, file.name, file.type);
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

export const getCsvSignedUrl = async (
  token: string,
  restaurantId: string,
  name: string,
  type: string,
  email: string,
): Promise<BackendResponse<CsvSignedUrlData>> => {
  const params: Record<string, string> = {};
  params.type = type;
  params.email = email;
  const url = buildApiUrl(
    [ENDPOINT.RESTAURANT,
    restaurantId,
    ENDPOINT.CSV_UPLOAD_URL,
    name],
    params,
  );

  const { data } = await axios.get<BackendResponse<CsvSignedUrlData>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const uploadCsv = async (
  token: string,
  restaurantId: string,
  file: File,
): Promise<string> => {
  const email = "Your@gmail.com";
  const signedUrlResponse = await getCsvSignedUrl(token, restaurantId, file.name, file.type, email);
  const { csvUploadUrl, csvFileName } = signedUrlResponse.data ?? {};

  if (!csvUploadUrl || !csvFileName) {
    throw new AxiosError("Unable to resolve upload destination.");
  }

  await axios.put(csvUploadUrl, file, {
    headers: {
      "Content-Type": file.type,
      "x-goog-meta-restaurant-id": restaurantId,
      "x-goog-meta-email": email,
    },
  });

  return csvFileName;
};
