import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form as AntForm, Input, Button, Typography, Radio } from "antd";
import { Link } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { SIGNUP_LABELS, VALUES } from "./Signup.const";
import { LOGIN_LABELS } from "@components/Login/Login.const";

import type { SignupProps, SignupValues } from "./Signup.type";

import "./signup.style.scss";

const Signup: React.FC<SignupProps> = ({ onSubmit }) => {
  const initialValues: SignupValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string().oneOf(["Customer", "Owner"]).required("Role is required"),
  });

  return (
    <div className="signup-container">
      <div className="signup-card">
        <Typography.Title level={3} className="signup-title">
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
            setFieldTouched,
            isValid,
          }) => (
            <AntForm layout="vertical" onFinish={() => handleSubmit()}>
              <AntForm.Item
                className="signup-field"
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
                  onFocus={() => setFieldTouched("username", false)}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup-field"
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
                  onFocus={() => setFieldTouched("email", false)}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup-field"
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
                  onFocus={() => setFieldTouched("password", false)}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup-field"
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
                  onFocus={() => setFieldTouched("confirmPassword", false)}
                />
              </AntForm.Item>

              <AntForm.Item
                className="signup-role"
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

              <AntForm.Item className="signup-actions">
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
              <Typography.Paragraph style={{ textAlign: "center", marginTop: 8 }}>
                Already have an account? <Link to={ROUTES_URL.LOGIN}>{LOGIN_LABELS.submit}</Link>
              </Typography.Paragraph>
            </AntForm>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
