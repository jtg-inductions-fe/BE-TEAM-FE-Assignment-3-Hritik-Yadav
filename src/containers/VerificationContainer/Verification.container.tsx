import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";

import app from "@/firebase/firebase";

import { Confirmation } from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";

const VerificationContainer: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "error" | "info">("info");
  const [title, setTitle] = useState<string>("Checking verification status...");
  const [subTitle, setSubTitle] = useState<string>("");

  const checkVerified = useCallback(async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) {
      setStatus("info");
      setTitle("Please sign in first");
      setSubTitle("Go to signup, create an account and sign in to verify.");
      return;
    }
    await user.reload();
    if (user.emailVerified) {
      navigate(ROUTES_URL.HOME);
      return;
    }
    setStatus("info");
    setTitle("Email not verified yet");
    setSubTitle("Click resend to send the verification email again.");
  }, [navigate]);

  useEffect(() => {
    (async () => {
      await checkVerified();
    })();
  }, [checkVerified]);

  const handleResend = useCallback(async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) return;
    await sendEmailVerification(user);
  }, []);

  const resultStatus = status;

  return (
    <Confirmation
      status={resultStatus}
      title={title}
      subTitle={subTitle}
      onRetry={checkVerified}
      onResend={handleResend}
    />
  );
};

export default VerificationContainer;
