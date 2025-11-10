import { USER_ROLE } from "@/services/service.const";
import type { SignupValues } from "./Signup.component.type";

export const INITIAL_SIGNUP_VALUES: SignupValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: USER_ROLE.CUSTOMER,
};
