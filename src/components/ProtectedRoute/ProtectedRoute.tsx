import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { ROUTES_URL } from "@/routes/routes.const";
import { Loading } from "@/components";

const ProtectedRoute: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          navigate(ROUTES_URL.LOGIN, { replace: true });
          setLoading(false);
          return;
        }
        try {
          await user.reload();
        } catch (error) {
          console.error("Firebase reload error:", error);
          setLoading(false);
          return;
        }
        if (!user.emailVerified) {
          navigate(ROUTES_URL.CONFIRMATION, { replace: true });
          setLoading(false);
          return;
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth state change error:", error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
