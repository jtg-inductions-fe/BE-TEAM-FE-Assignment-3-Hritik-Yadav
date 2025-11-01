import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";

import { app } from "@/firebase/firebase";

import { Verification } from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { message } from "antd";

export const VerificationContainer: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "error" | "info">("info");
  const [title, setTitle] = useState<string>("Checking verification status...");
  const [subtitle, setSubtitle] = useState<string>("");

  const checkVerified = useCallback(async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) {
      setStatus("info");
      setTitle("Please sign in first");
      setSubtitle("Go to signup, create an account and sign in to verify.");
      return;
    }
    await user.reload();
    if (user.emailVerified) {
      navigate(ROUTES_URL.HOME, { replace: true });
      return;
    }
    setStatus("info");
    setTitle("Email not verified yet");
    setSubtitle("Click resend to send the verification email again.");
  }, [navigate]);

  useEffect(() => {
    (async () => {
      await checkVerified();
    })();
  }, [checkVerified]);

  const handleResend = useCallback(async () => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        message.info("Please sign in to resend the verification email.");
        return;
      }
      await sendEmailVerification(user);
      message.success("Verification email sent successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message || "Failed to send verification email");
      }
    }
  }, []);

  return (
    <Verification
      status={status}
      title={title}
      subtitle={subtitle}
      onRetry={checkVerified}
      onResend={handleResend}
    />
  );
};
