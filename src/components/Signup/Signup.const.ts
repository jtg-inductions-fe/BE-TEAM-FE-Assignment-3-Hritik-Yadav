import { USER_ROLE } from "@/services/service.const";
import type { SignupValues } from "./Signup.type";

export const VALUES = {
  Customer: USER_ROLE.Customer,
  Owner: USER_ROLE.Owner,
};

export const INITIAL_SIGNUP_VALUES: SignupValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: USER_ROLE.Customer,
};
