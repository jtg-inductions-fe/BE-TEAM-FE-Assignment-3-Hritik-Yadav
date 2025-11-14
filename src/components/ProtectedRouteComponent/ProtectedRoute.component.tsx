import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ROUTES_URL } from "@/routes/routes.const";
import { AppLoaderComponent } from "@/components";
import { useAuthContext } from "@/context/AuthContext";

export const ProtectedRouteComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, isAuthLoading, role } = useAuthContext();
  const { pathname } = location;
  const isVerificationRoute = pathname === ROUTES_URL.VERIFICATION;

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
    //to not allow verified user to visit confirmation route
    if (isVerificationRoute) {
      navigate(ROUTES_URL.HOME, { replace: true });
      return;
    }

  }, [authUser, isAuthLoading, isVerificationRoute, navigate, pathname, role]);

  if (isAuthLoading || !authUser) {
    return <AppLoaderComponent />;
  }

  return <Outlet />;
};
