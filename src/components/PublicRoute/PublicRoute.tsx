import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { AppLoader } from "@/components";
import { useAuthContext } from "@/context/AuthContext";
import { USER_ROLE } from "@services/service.const";

export const PublicRoute: React.FC = () => {
  const navigate = useNavigate();
  const { authUser, isAuthLoading, role } = useAuthContext();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (authUser) {
      const destination = role === USER_ROLE.OWNER ? ROUTES_URL.RESTAURANT : ROUTES_URL.HOME;
      navigate(destination, { replace: true });
    }
  }, [authUser, isAuthLoading, navigate, role]);

  if (isAuthLoading || authUser) {
    return <AppLoader />;
  }

  return <Outlet />;
};
