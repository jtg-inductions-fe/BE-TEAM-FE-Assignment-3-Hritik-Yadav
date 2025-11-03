import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { getAuth, signInWithCustomToken } from "firebase/auth";

import { ROUTES_URL } from "@/routes/routes.const";
import { signup } from "@/services";
import { Signup } from "@/components";
import { setUser } from "@store/actions/actions";
import type { SignupValues } from "@components/Signup";

export const SignupContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values: SignupValues) => {
    try {
      const resp = await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      const customToken = resp?.data?.customToken;
      if (!customToken) {
        message.error(resp?.message || "User not created. Try Again Later");
        return;
      }
      const auth = getAuth();
      await signInWithCustomToken(auth, customToken);
      dispatch(
        setUser({
          uid: "",
          username: values.username,
          email: values.email,
          role: values.role,
        }),
      );
      message.success("User created successfully. Please confirm your email.");
      navigate(ROUTES_URL.CONFIRMATION);
    } catch {
      message.error("User not created. Try Again Later");
    }
  };

  return <Signup onSubmit={handleSubmit} />;
};
