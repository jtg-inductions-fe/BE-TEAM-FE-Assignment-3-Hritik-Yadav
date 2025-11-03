import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { app } from "@/firebase/firebase";

import { Login } from "@/components";
import { LoginValues } from "@components/Login";
import { ROUTES_URL } from "@/routes/routes.const";
import { USER_ROLE } from "@services/service.const";

export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginValues) => {
    try {
      const auth = getAuth(app);
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = cred.user;
      const token = await user.getIdToken();
      if (!token) {
        message.error("Login failed");
        return;
      }
      const idTokenResult = await user.getIdTokenResult();
      const roleFromClaims = (idTokenResult.claims as Record<string, unknown>)["role"] as
        | USER_ROLE
        | undefined;

      message.success("Logged in successfully");
      if (!auth.currentUser?.emailVerified) {
        navigate(ROUTES_URL.CONFIRMATION);
        return;
      }
      const route = roleFromClaims === USER_ROLE.Owner ? ROUTES_URL.ADMIN : ROUTES_URL.HOME;
      navigate(route);
    } catch {
      message.error("Login Failed");
    }
  };

  return <Login onSubmit={handleSubmit} />;
};
