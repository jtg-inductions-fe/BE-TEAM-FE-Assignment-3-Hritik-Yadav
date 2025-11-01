import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Typography, Radio } from "antd";
import { Formik, Form as FormikForm, Field, FieldProps } from "formik";

import { ROUTES_URL } from "@/routes/routes.const";
import { USER_ROLE } from "@/services/service.const";

import { signupValidationSchema } from "./Signup.validation";
import { INITIAL_SIGNUP_VALUES } from "./Signup.const";
import type { SignupProps, SignupValues } from "./Signup.type";

import "./signup.style.scss";

export const Signup: React.FC<SignupProps> = ({ onSubmit }) => {
  return (
    <div className="signup">
      <div className="signup__card">
        <Typography.Title level={3} className="signup__title">
          Create your account
        </Typography.Title>
        <Formik
          initialValues={INITIAL_SIGNUP_VALUES}
          validationSchema={signupValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, submitCount, isValid }) => (
            <FormikForm className="signup__form">
              <Field name="username">
                {({ field, meta }: FieldProps<string>) => (
                  <div className="signup__field">
                    <label className="signup__label" htmlFor="username">
                      Name
                    </label>
                    <Input id="username" placeholder="Your username" {...field} />
                    {(meta.touched || submitCount > 0) && meta.error && (
                      <div className="signup__error">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <Field name="email">
                {({ field, meta }: FieldProps<string>) => (
                  <div className="signup__field">
                    <label className="signup__label" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" placeholder="you@example.com" {...field} />
                    {(meta.touched || submitCount > 0) && meta.error && (
                      <div className="signup__error">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <Field name="password">
                {({ field, meta }: FieldProps<string>) => (
                  <div className="signup__field">
                    <label className="signup__label" htmlFor="password">
                      Password
                    </label>
                    <Input.Password id="password" placeholder="Password" {...field} />
                    {(meta.touched || submitCount > 0) && meta.error && (
                      <div className="signup__error">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field, meta }: FieldProps<string>) => (
                  <div className="signup__field">
                    <label className="signup__label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <Input.Password
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      {...field}
                    />
                    {(meta.touched || submitCount > 0) && meta.error && (
                      <div className="signup__error">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <Field name="role">
                {({ field, form }: FieldProps<SignupValues["role"]>) => (
                  <div className="signup__role">
                    <span className="signup__label">Role</span>
                    <Radio.Group
                      className="signup__role-options"
                      optionType="button"
                      buttonStyle="solid"
                      value={field.value}
                      onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                      onBlur={() => form.setFieldTouched(field.name, true)}
                    >
                      <Radio.Button value={USER_ROLE.Customer}>{USER_ROLE.Customer}</Radio.Button>
                      <Radio.Button value={USER_ROLE.Owner}>{USER_ROLE.Owner}</Radio.Button>
                    </Radio.Group>
                  </div>
                )}
              </Field>

              <div className="signup__actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  Sign up
                </Button>
              </div>
              <Typography.Paragraph className="signup__message">
                Already have an account? <Link to={ROUTES_URL.LOGIN}>Log in</Link>
              </Typography.Paragraph>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
