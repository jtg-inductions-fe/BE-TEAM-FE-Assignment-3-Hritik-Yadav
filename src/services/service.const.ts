export const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:5000";
export enum ENDPOINT {
  SIGNUP = "auth/signup",
  LOGIN = "login",
  USER = "user/me",
  RESTAURANT = "restaurant"
}

export interface ApiUrlParams {
  [key: string]: string | number | undefined;
}
