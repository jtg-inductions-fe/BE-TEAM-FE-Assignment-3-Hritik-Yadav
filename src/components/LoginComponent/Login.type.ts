export interface LoginValues {
  email: string;
  password: string;
}

export type LoginProps = {
  onSubmit: (values: LoginValues) => void;
};
