import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { ROUTES_URL } from "@/routes/routes.const";

const PublicRoute: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(ROUTES_URL.HOME, { replace: true });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default PublicRoute;
