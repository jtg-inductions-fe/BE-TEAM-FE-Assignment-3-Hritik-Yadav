import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { app } from "@/firebase/firebase";

import { LoginComponent } from "@/components";
import { LoginValues } from "@/components/LoginComponent";
import { ROUTES_URL } from "@/routes/routes.const";

export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginValues) => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      //before- based on role - either user goes to Restaurant Page or the Home page
      // now- not required as roles are handled in the container only
      message.success("Logged in successfully");
      if (!auth.currentUser?.emailVerified) {
        navigate(ROUTES_URL.CONFIRMATION);
        return;
      }
      navigate(ROUTES_URL.HOME);
    } catch {
      message.error("Login Failed");
    }
  };

  return <LoginComponent onSubmit={handleSubmit} />;
};
