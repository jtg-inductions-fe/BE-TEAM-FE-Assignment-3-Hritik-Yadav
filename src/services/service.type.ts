export type Role = "Customer" | "Owner";

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
  errors?: Record<string, unknown> | string;
  status_code: number;
}

export interface SignupResponseData {
  customToken: string;
}
