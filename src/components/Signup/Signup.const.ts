import { USER_ROLE } from "@/services/service.const";
import type { SignupValues } from "./Signup.type";

export const INITIAL_SIGNUP_VALUES: SignupValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: USER_ROLE.Customer,
};
