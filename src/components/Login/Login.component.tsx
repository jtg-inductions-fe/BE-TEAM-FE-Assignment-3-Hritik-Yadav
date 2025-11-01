import React from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { Form, Input, Button, Typography } from "antd";
=======
import { Input, Button, Typography } from "antd";
import { Formik, Form as FormikForm, Field, FieldProps } from "formik";
>>>>>>> 2f0948c2ab13cf45bc3b5eee99aca9253d6ff918

import { ROUTES_URL } from "@/routes/routes.const";

import { INITIAL_LOGIN_VALUES } from "./Login.const";
import { loginValidationSchema } from "./Login.validation";
import type { LoginProps } from "./Login.type";

import "./login.style.scss";

export const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  return (
    <div className="login">
      <div className="login__card">
        <Typography.Title level={3} className="login__title">
          Welcome back
        </Typography.Title>
        <Formik
          initialValues={INITIAL_LOGIN_VALUES}
          validationSchema={loginValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
          }}
        >
<<<<<<< HEAD
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
            <Form layout="vertical" onFinish={() => handleSubmit()}>
              <Form.Item
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
              </Form.Item>

              <Form.Item
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
              </Form.Item>

              <Form.Item className="login__actions">
=======
          {({ isSubmitting, submitCount, isValid }) => (
            <FormikForm className="login__form">
              <Field name="email">
                {({ field, meta }: FieldProps<string>) => (
                  <div className="login__field">
                    <label className="login__label" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" placeholder="you@example.com" {...field} />
                    {(meta.touched || submitCount > 0) && meta.error && (
                      <div className="login__error">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <Field name="password">
                {({ field, meta }: FieldProps<string>) => (
                  <div className="login__field">
                    <label className="login__label" htmlFor="password">
                      Password
                    </label>
                    <Input.Password id="password" placeholder="Password" {...field} />
                    {(meta.touched || submitCount > 0) && meta.error && (
                      <div className="login__error">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <div className="login__actions">
>>>>>>> 2f0948c2ab13cf45bc3b5eee99aca9253d6ff918
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  Log in
                </Button>
<<<<<<< HEAD
              </Form.Item>
=======
              </div>
>>>>>>> 2f0948c2ab13cf45bc3b5eee99aca9253d6ff918
              <Typography.Paragraph className="login__message">
                Don&apos;t have an account?
                <Link to={ROUTES_URL.SIGNUP}>Sign up</Link>
              </Typography.Paragraph>
<<<<<<< HEAD
            </Form>
=======
            </FormikForm>
>>>>>>> 2f0948c2ab13cf45bc3b5eee99aca9253d6ff918
          )}
        </Formik>
      </div>
    </div>
  );
};
