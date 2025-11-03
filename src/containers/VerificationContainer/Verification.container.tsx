import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendEmailVerification } from "firebase/auth";
import { message } from "antd";

import { Verification } from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { USER_ROLE } from "@services/service.const";
import { selectUserRole } from "@store/selectors/selector";
import { useAuthContext } from "@/context/AuthContext";

export const VerificationContainer: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("Checking verification status...");
  const [subtitle, setSubtitle] = useState<string>("");
  const role = useSelector(selectUserRole);
  const auth = useAuthContext();

  const checkVerified = useCallback(async () => {
    const user = auth.authUser;
    if (!user) {
      return;
    }
    if (user.emailVerified) {
      const route = role == USER_ROLE.Owner ? ROUTES_URL.ADMIN : ROUTES_URL.HOME;
      navigate(route, { replace: true });
      return;
    }
    setTitle("Email not verified yet");
    setSubtitle("Click resend to send the verification email again.");
  }, [auth, navigate, role]);

  useEffect(() => {
    (async () => {
      await checkVerified();
    })();
  }, [checkVerified]);

  const handleResend = useCallback(async () => {
    try {
      const user = auth.authUser;
      if (!user) {
        message.info("Please Log in to resend the verification email.");
        navigate(ROUTES_URL.LOGIN);
        return;
      }
      await sendEmailVerification(user);
      message.success("Verification email sent successfully!");
    } catch {
      message.error("Failed to send verification email");
    }
  }, [auth, navigate]);

  return (
    <Verification
      title={title}
      subtitle={subtitle}
      onRetry={checkVerified}
      onResend={handleResend}
    />
  );
};
