import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { ROUTES_URL } from "@/routes/routes.const";
import { signup } from "@/services";
import { Signup } from "@/components";
import { resolveAxiosErrorMessage } from "@/utils/helper";
import type { SignupValues } from "@components/Signup";

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
      let errMsg = resolveAxiosErrorMessage(error, genericError);
      if (error instanceof FirebaseError) {
        errMsg = "User Created, Login failed: Please Try Login Again";
      }
      message.error(errMsg);
    }
  };

  return <Signup onSubmit={handleSubmit} />;
};
