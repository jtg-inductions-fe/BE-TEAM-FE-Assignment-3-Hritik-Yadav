import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { message } from "antd";

import { Verification } from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { USER_ROLE } from "@services/service.const";
import { useAuthContext } from "@/context/AuthContext";

export const VerificationContainer: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("Checking verification status...");
  const [subtitle, setSubtitle] = useState<string>("");
  const { authUser, role } = useAuthContext();

  const checkVerified = useCallback(async () => {
    if (!authUser) {
      return;
    }
    await authUser.reload();
    if (authUser.emailVerified) {
      const route = role == USER_ROLE.OWNER ? ROUTES_URL.ADMIN : ROUTES_URL.HOME;
      navigate(route, { replace: true });
      return;
    }
    setTitle("Email not verified yet");
    setSubtitle("Click resend to send the verification email again.");
  }, [authUser, navigate, role]);

  useEffect(() => {
    (async () => {
      await checkVerified();
    })();
  }, [checkVerified]);

  const handleResend = useCallback(async () => {
    try {
      if (!authUser) {
        message.info("Please Log in to resend the verification email.");
        navigate(ROUTES_URL.LOGIN);
        return;
      }
      await sendEmailVerification(authUser);
      message.success("Verification email sent successfully!");
    } catch {
      message.error("Failed to send verification email");
    }
  }, [authUser, navigate]);

  return (
    <Verification
      title={title}
      subtitle={subtitle}
      onRetry={checkVerified}
      onResend={handleResend}
    />
  );
};
