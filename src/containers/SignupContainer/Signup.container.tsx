import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { AxiosError } from "axios";

import { ROUTES_URL } from "@/routes/routes.const";
import { signup } from "@/services";
import { SignupComponent } from "@/components";
import { resolveAxiosError, resolveFirebaseError } from "@/utils/errorHandlers";
import { ERROR_MESSAGE } from "@services/service.const";

import type { SignupValues } from "@components/SignupComponent";

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
      navigate(ROUTES_URL.VERIFICATION);
    } catch (error: unknown) {
      let errorMessage = ERROR_MESSAGE;

      if (error instanceof AxiosError) {
        errorMessage = resolveAxiosError(error, "User not created. Try again later.");
      } else if (error instanceof FirebaseError) {
        errorMessage = resolveFirebaseError(
          error,
          "User Created, Login failed: Please Try Login Again",
        );
      }
      message.error(errorMessage);
    }
  };

  return <SignupComponent onSubmit={handleSubmit} />;
};
