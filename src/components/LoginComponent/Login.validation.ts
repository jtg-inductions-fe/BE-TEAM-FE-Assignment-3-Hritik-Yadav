import * as Yup from "yup";

export const LOGIN_VALIDATION_SCHEMA = Yup.object().shape({
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters"),
});
