import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import app from "@/firebase/firebase";

import { ROUTES_URL } from "@/routes/routes.const";
import { signup } from "@/services";
import { Signup } from "@/components";
import type { SignupValues } from "@components/Signup";

const SignupContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: SignupValues) => {
    try {
      const resp = await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      const uid = resp?.data?.uid;
      if (!uid) {
        message.error(resp?.message || "User not created. Try Again Later");
        return;
      }
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success(resp?.message || "User created successfully. Please confirm your email.");
      navigate(ROUTES_URL.CONFIRMATION);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("signup error", err);
        const msg: string = err?.message || "User not created.";
        message.error(msg);
      } else {
        console.error("Unexpected error", err);
      }
    }
  };

  return <Signup onSubmit={handleSubmit} />;
};

export default SignupContainer;
