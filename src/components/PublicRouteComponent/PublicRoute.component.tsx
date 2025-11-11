import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { AppLoaderComponent } from "@/components";
import { useAuthContext } from "@/context/AuthContext";

export const PublicRouteComponent: React.FC = () => {
  const { isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return <AppLoaderComponent />;
  }

  return <Outlet />;
};
//recheck - dont remove - for the creator