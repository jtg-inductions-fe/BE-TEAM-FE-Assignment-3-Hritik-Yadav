import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { AppLoaderComponent } from "@/components";
import { useAuthContext } from "@/context/AuthContext";
import { USER_ROLE } from "@services/service.const";

export const ProtectedRouteComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, isAuthLoading, role } = useAuthContext();
  const { pathname } = location;
  const isVerificationRoute = pathname === ROUTES_URL.VERIFICATION;
  const isAdminRoute = pathname === ROUTES_URL.ADMIN;

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!authUser) {
      if (pathname !== ROUTES_URL.LOGIN) {
        navigate(ROUTES_URL.LOGIN, { replace: true });
      }
      return;
    }

    if (!authUser.emailVerified) {
      if (!isVerificationRoute) {
        navigate(ROUTES_URL.VERIFICATION, { replace: true });
      }
      return;
    }

    if (isVerificationRoute) {
      const destination = role === USER_ROLE.OWNER ? ROUTES_URL.ADMIN : ROUTES_URL.HOME;
      navigate(destination, { replace: true });
      return;
    }

    if (isAdminRoute && role !== USER_ROLE.OWNER) {
      navigate(ROUTES_URL.HOME, { replace: true });
    }
  }, [authUser, isAdminRoute, isAuthLoading, isVerificationRoute, navigate, pathname, role]);

  if (isAuthLoading || !authUser) {
    return <AppLoaderComponent />;
  }

  return <Outlet />;
};
