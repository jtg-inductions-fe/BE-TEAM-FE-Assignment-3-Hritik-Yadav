import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { app } from "@/firebase/firebase";
import { LoginComponent } from "@/components";
import { LoginValues } from "@components/LoginComponent";
import { ROUTES_URL } from "@/routes/routes.const";
import { USER_ROLE } from "@services/service.const";
import { normalizeRole } from "@/utils/helper";
import { resolveError } from "@/utils/errorHandlers";

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
      const roleFromClaims = normalizeRole(idTokenResult.claims["role"]);

      message.success("Logged in successfully");
      if (!auth.currentUser?.emailVerified) {
        navigate(ROUTES_URL.VERIFICATION);
        return;
      }
      const route = roleFromClaims === USER_ROLE.OWNER ? ROUTES_URL.RESTAURANT : ROUTES_URL.HOME;
      navigate(route);
    } catch (error) {
      const errorMessage = resolveError({ error, firebaseErrorMessage: "Login Failed" });
      message.error(errorMessage);
    }
  };

  return <LoginComponent onSubmit={handleSubmit} />;
};
