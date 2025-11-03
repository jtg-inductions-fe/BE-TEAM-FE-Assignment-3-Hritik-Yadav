import * as Yup from "yup";

import { USER_ROLE_VALUES } from "@services/service.const";

export const signupValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot exceed 30 characters")
    .matches(/^[a-zA-Z0-9_ ]+$/, "Name can only contain letters, numbers, spaces, and underscores"),

  email: Yup.string().email("Invalid email address format").required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),

  role: Yup.string().required("Role is required").oneOf(USER_ROLE_VALUES, "Invalid role selected"),
});
