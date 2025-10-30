import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form as AntForm, Input, Button, Typography, Radio } from "antd";
import { Link } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { SIGNUP_LABELS, VALUES } from "./Signup.const";

import type { SignupProps, SignupValues } from "./Signup.type";

import "./signup.style.scss";

export const Signup: React.FC<SignupProps> = ({ onSubmit }) => {
  const initialValues: SignupValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name cannot exceed 30 characters")
      .matches(
        /^[a-zA-Z0-9_ ]+$/,
        "Name can only contain letters, numbers, spaces, and underscores",
      ),

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

    role: Yup.string()
      .required("Role is required")
      .oneOf(["Customer", "Owner"], "Invalid role selected"),
  });

  return (
    <div className="signup">
      <div className="signup__card">
        <Typography.Title level={3} className="signup__title">
          {SIGNUP_LABELS.title}
        </Typography.Title>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            submitCount,
            isValid,
          }) => (
            <AntForm layout="vertical" onFinish={() => handleSubmit()}>
              <AntForm.Item
                className="signup__field"
                label={SIGNUP_LABELS.name}
                validateStatus={
                  (touched.username || submitCount > 0) && errors.username ? "error" : ""
                }
                help={
                  (touched.username || submitCount > 0) && errors.username
                    ? errors.username
                    : undefined
                }
              >
                <Input
                  name="username"
                  placeholder="Your username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup__field"
                label={SIGNUP_LABELS.email}
                validateStatus={(touched.email || submitCount > 0) && errors.email ? "error" : ""}
                help={(touched.email || submitCount > 0) && errors.email ? errors.email : undefined}
              >
                <Input
                  name="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup__field"
                label={SIGNUP_LABELS.password}
                validateStatus={
                  (touched.password || submitCount > 0) && errors.password ? "error" : ""
                }
                help={
                  (touched.password || submitCount > 0) && errors.password
                    ? errors.password
                    : undefined
                }
              >
                <Input.Password
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup__field"
                label={SIGNUP_LABELS.confirmPassword}
                validateStatus={
                  (touched.confirmPassword || submitCount > 0) && errors.confirmPassword
                    ? "error"
                    : ""
                }
                help={
                  (touched.confirmPassword || submitCount > 0) && errors.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
              >
                <Input.Password
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup__role"
                label={SIGNUP_LABELS.role}
                validateStatus={(touched.role || submitCount > 0) && errors.role ? "error" : ""}
                help={
                  (touched.role || submitCount > 0) && errors.role
                    ? (errors.role as string)
                    : undefined
                }
              >
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  value={values.role}
                  onChange={(e) => setFieldValue("role", e.target.value)}
                >
                  <Radio.Button value="Customer">{VALUES.Customer}</Radio.Button>
                  <Radio.Button value="Owner">{VALUES.Owner}</Radio.Button>
                </Radio.Group>
              </AntForm.Item>

              <AntForm.Item className="signup__actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  {SIGNUP_LABELS.submit}
                </Button>
              </AntForm.Item>
              <Typography.Paragraph className="signup__message">
                Already have an account? <Link to={ROUTES_URL.LOGIN}>Log in</Link>
              </Typography.Paragraph>
            </AntForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
