export const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:5000";
export enum ENDPOINT {
  SIGNUP = "auth/signup",
  USER = "users/me",
}

import type { Role } from "./service.type";

export enum USER_ROLE {
  Customer = "Customer",
  Owner = "Owner",
}

export const USER_ROLE_VALUES: Role[] = Object.values(USER_ROLE);

export interface ApiUrlParams {
  [key: string]: string | number | undefined;
}
