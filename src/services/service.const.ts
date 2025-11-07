import { Role } from "./service.type";

export const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:5000";
export enum ENDPOINT {
  SIGNUP = "auth/signup",
  USER = "users/me",
}

export enum USER_ROLE {
  Customer = "customer",
  Owner = "owner",
}

export const USER_ROLE_VALUES: Role[] = ["customer", "owner"];

export interface ApiUrlParams {
  [key: string]: string | number | undefined;
}
