import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";

import { ROUTES_URL } from "@/routes/routes.const";
import { signup } from "@/services";
import { SignupComponent } from "@/components";
import type { SignupValues } from "@/components/SignupComponent";

export const SignupContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: SignupValues) => {
    try {
      const response = await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      const customToken = response?.data?.customToken;
      if (!customToken) {
        return;
      }
      const auth = getAuth();
      await signInWithCustomToken(auth, customToken);

      message.success("User created successfully. Please confirm your email.");
      navigate(ROUTES_URL.CONFIRMATION);
    } catch (error: unknown) {
      const genericError = "User not created. Try again later.";
      let errMsg = genericError;

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status && status >= 400 && status < 500) {
          errMsg = error.response?.data?.message ?? genericError;
        } else if (status && status >= 500) {
          errMsg = "Server error. Please try again shortly.";
        } else if (!status && error.request) {
          errMsg = "Network error. Check your connection.";
        } else if (error.message) {
          errMsg = error.message;
        }
      }
      if (error instanceof FirebaseError) {
        errMsg = "User Created, Login failed: Please Try Login Again";
      }
      message.error(errMsg);
    }
  };

  return <SignupComponent onSubmit={handleSubmit} />;
};
