import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { ROUTES_URL } from "@/routes/routes.const";
import { Loading } from "@/components";

export const PublicRoute: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          navigate(ROUTES_URL.HOME, { replace: true });
          return;
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth state change error:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  return <Outlet />;
};
