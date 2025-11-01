import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { AppLoader } from "@/components";
import { useAuthContext } from "@/context/AuthContext";
import { USER_ROLE } from "@/services/service.const";

export const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, isAuthLoading, role } = useAuthContext();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!authUser) {
      navigate(ROUTES_URL.LOGIN, { replace: true });
      return;
    }

    if (!authUser.emailVerified) {
      navigate(ROUTES_URL.CONFIRMATION, { replace: true });
      return;
    }

    if (location.pathname === ROUTES_URL.ADMIN && role !== USER_ROLE.Owner) {
      navigate(ROUTES_URL.HOME, { replace: true });
    }
  }, [authUser, isAuthLoading, navigate, role, location.pathname]);

  if (isAuthLoading || !authUser || !authUser.emailVerified) {
    return <AppLoader />;
  }

  return <Outlet />;
};
