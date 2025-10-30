import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "@/firebase/firebase";

import { ROUTES_URL } from "@/routes/routes.const";
import { getUserDetails } from "@/services";
import { Login } from "@/components";
import { LoginValues } from "@components/Login";
import { setUser } from "@/store/actions/actions";

export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values: LoginValues) => {
    try {
      const auth = getAuth(app);
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = cred.user;
      const token = await user.getIdToken();
      if (!token) {
        message.error("Login failed: no user id");
        return;
      }
      const idTokenResult = await user.getIdTokenResult();
      const roleFromClaims = (idTokenResult.claims as Record<string, unknown>)["role"] as
        | "Customer"
        | "Owner"
        | undefined;

      const resp = await getUserDetails(token);
      const role = resp?.data?.role || roleFromClaims;
      if (resp?.data) {
        dispatch(setUser(resp.data));
      }
      message.success(resp?.message || "Logged in successfully");

      if (!auth.currentUser?.emailVerified) {
        navigate(ROUTES_URL.CONFIRMATION);
        return;
      }
      if (role === "Owner") {
        navigate(ROUTES_URL.RESTAURANT);
      } else {
        navigate(ROUTES_URL.HOME);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("login error", err);
        const msg: string = err?.message || "Login failed";
        message.error(msg);
      } else {
        console.error("Unexpected error", err);
      }
    }
  };

  return <Login onSubmit={handleSubmit} />;
};

