import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { Form as AntForm, Input, Button, Typography } from "antd";

import { ROUTES_URL } from "@/routes/routes.const";
import { LOGIN_LABELS } from "./Login.const";

import type { LoginProps, LoginValues } from "./Login.type";

import "./login.style.scss";

export const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const initialValues: LoginValues = { email: "", password: "" };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="login">
      <div className="login__card">
        <Typography.Title level={3} className="login__title">
          {LOGIN_LABELS.title}
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
            submitCount,
            isValid,
          }) => (
            <AntForm layout="vertical" onFinish={() => handleSubmit()}>
              <AntForm.Item
                className="login__field"
                label={LOGIN_LABELS.email}
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
                className="login__field"
                label={LOGIN_LABELS.password}
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

              <AntForm.Item className="login__actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  {LOGIN_LABELS.submit}
                </Button>
              </AntForm.Item>
              <Typography.Paragraph className="login__message">
                {LOGIN_LABELS.message}
                <Link to={ROUTES_URL.SIGNUP}>Sign up</Link>
              </Typography.Paragraph>
            </AntForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
