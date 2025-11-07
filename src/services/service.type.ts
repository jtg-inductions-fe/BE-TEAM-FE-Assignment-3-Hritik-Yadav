export type Role = "customer" | "owner";

export interface ApiUrlParams {
  [key: string]: string | number | undefined;
}

export interface UserData {
  uid: string;
  username: string;
  email: string;
  role: Role;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface BackendResponse<T = unknown> {
  data?: T;
  message: string;
  errors?: Record<string, string[]> | string;
  status_code: number;
}

export interface SignupResponseData {
  customToken: string;
}
