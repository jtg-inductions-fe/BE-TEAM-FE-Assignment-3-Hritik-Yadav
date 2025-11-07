import { Role } from "./service.type";

export const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:5000";
export enum ENDPOINT {
  SIGNUP = "auth/signup",
  USER = "users/me",
  RESTAURANT = "restaurants",
  UPLOAD_URL = "upload-url",
  MENU_ITEMS = "menu-items",
}

export enum USER_ROLE {
  CUSTOMER = "customer",
  OWNER = "owner",
}

export const USER_ROLE_VALUES: Role[] = [USER_ROLE.CUSTOMER, USER_ROLE.OWNER];

export interface ApiUrlParams {
  [key: string]: string | number | undefined;
}
