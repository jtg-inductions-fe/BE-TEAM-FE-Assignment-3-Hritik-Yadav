import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import app from "@/firebase/firebase";

import { ROUTES_URL } from "@/routes/routes.const";
import { getUserById } from "@/services";
import { Login } from "@/components";
import { LoginValues } from "@components/Login";

const LoginContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: LoginValues) => {
    (async () => {
      try {
        const auth = getAuth(app);
        const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
        const uid = cred.user?.uid;
        if (!uid) {
          message.error("Login failed: no user id");
          return;
        }
        const resp = await getUserById(uid);
        const role = resp?.data?.role;
        message.success(resp?.message || "Logged in successfully");
        // Navigate based on role; Owner -> /admin else HOME
        if (auth.currentUser?.emailVerified) {
          navigate(ROUTES_URL.CONFIRMATION);
        }
        if (role === "Owner") {
          navigate("/admin");
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
    })();
  };

  return <Login onSubmit={handleSubmit} />;
};

export default LoginContainer;
