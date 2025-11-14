import type { Role } from "@services/service.type";

export interface SignupValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export type SignupProps = {
  onSubmit: (values: SignupValues) => void;
};
