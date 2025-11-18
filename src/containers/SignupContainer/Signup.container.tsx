import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithCustomToken } from "firebase/auth";

import { ROUTES_URL } from "@/routes/routes.const";
import { signup } from "@/services";
import { SignupComponent } from "@/components";
import { resolveError } from "@/utils/errorHandlers";

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
      const customToken = response.data!.customToken;
      const auth = getAuth();
      await signInWithCustomToken(auth, customToken);
      message.success("User created successfully. Please confirm your email.");
      navigate(ROUTES_URL.VERIFICATION);
    } catch (error: unknown) {
      const errorMessage = resolveError({
        error,
        firebaseErrorMessage: "User Created, Login failed: Please Try Login Again",
        axiosErrorMessage: "User not created. Try again later.",
      });
      message.error(errorMessage);
    }
  };

  return <SignupComponent onSubmit={handleSubmit} />;
};
